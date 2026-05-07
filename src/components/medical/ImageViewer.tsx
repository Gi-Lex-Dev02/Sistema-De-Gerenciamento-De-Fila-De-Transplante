import React, { useEffect, useRef } from 'react';
import * as cornerstone from 'cornerstone-core';
import * as cornerstoneTools from 'cornerstone-tools';
import * as cornerstoneMath from 'cornerstone-math';
import * as cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader';
import dicomParser from 'dicom-parser';

interface ImageViewerProps {
  imageId: string;
  className?: string;
}

// Initialize cornerstone WADO image loader
cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
cornerstoneWADOImageLoader.webWorkerManager.initialize({
  maxWebWorkers: navigator.hardwareConcurrency || 1,
  startWebWorkersOnDemand: true,
  taskConfiguration: {
    decodeTask: {
      initializeCodecsOnStartup: true,
      usePDFJS: false,
      strict: false,
    },
  },
});

// Initialize the web image loader
cornerstone.registerImageLoader('web', (imageId) => {
  const imageUrl = imageId.replace('web:', '');
  const image = new Image();
  image.crossOrigin = 'anonymous';
  
  const promise = new Promise((resolve, reject) => {
    image.src = imageUrl;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }
      
      ctx.drawImage(image, 0, 0);
      
      resolve({
        imageId,
        minPixelValue: 0,
        maxPixelValue: 255,
        slope: 1.0,
        intercept: 0,
        windowCenter: 127,
        windowWidth: 256,
        getPixelData: () => {
          const imageData = ctx.getImageData(0, 0, image.width, image.height);
          return new Uint8ClampedArray(imageData.data);
        },
        rows: image.height,
        columns: image.width,
        height: image.height,
        width: image.width,
        color: true,
        rgba: true,
        columnPixelSpacing: 1,
        rowPixelSpacing: 1,
        invert: false,
        sizeInBytes: image.width * image.height * 4,
      });
    };
    image.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });

  return { promise, cancelFn: undefined };
});

export function ImageViewer({ imageId, className }: ImageViewerProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    cornerstone.enable(elementRef.current);

    cornerstoneTools.external.cornerstone = cornerstone;
    cornerstoneTools.external.Hammer = window.Hammer;
    cornerstoneTools.external.cornerstoneMath = cornerstoneMath;
    cornerstoneTools.init({ showSVGCursors: true });

    const sampleImageUrl = 'https://images.unsplash.com/photo-1495020689067-958852a7765e';
    const webImageId = `web:${sampleImageUrl}`;

    cornerstone.loadImage(webImageId).then(image => {
      if (elementRef.current) {
        cornerstone.displayImage(elementRef.current, image);
        
        const WwwcTool = cornerstoneTools.WwwcTool;
        const PanTool = cornerstoneTools.PanTool;
        const ZoomTool = cornerstoneTools.ZoomTool;
        const MagnifyTool = cornerstoneTools.MagnifyTool;
        
        cornerstoneTools.addTool(WwwcTool);
        cornerstoneTools.addTool(PanTool);
        cornerstoneTools.addTool(ZoomTool);
        cornerstoneTools.addTool(MagnifyTool);
        
        cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 1 });
        cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 2 });
        cornerstoneTools.setToolActive('Zoom', { mouseButtonMask: 4 });
      }
    }).catch(error => {
      console.error('Error loading image:', error);
    });

    return () => {
      if (elementRef.current) {
        cornerstone.disable(elementRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={elementRef}
      className={`relative min-h-[400px] bg-black ${className}`}
    />
  );
}
