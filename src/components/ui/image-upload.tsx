import React, { useState } from 'react';
import { Button } from './button';
import { Upload, X, Eye } from 'lucide-react';
import type { FileAttachment } from '@/lib/schemas';

interface ImageUploadProps {
  image?: FileAttachment;
  onUpload: (file: File) => void;
  onRemove: () => void;
  label: string;
  accept?: string;
}

export function ImageUpload({ image, onUpload, onRemove, label, accept = "image/png,image/jpeg" }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(image?.url || null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      onUpload(file);
    }
    event.target.value = '';
  };

  const handleRemove = () => {
    setPreview(null);
    onRemove();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={() => document.getElementById(`image-upload-${label}`)?.click()} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          {image ? 'Alterar' : 'Adicionar'} {label}
        </Button>
        <input id={`image-upload-${label}`} type="file" className="hidden" accept={accept} onChange={handleFileChange} />
      </div>
      {(preview || image) && (
        <div className="relative inline-block">
          <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
            <img src={preview || image?.url} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="flex gap-2">
                <Button type="button" size="sm" variant="secondary" onClick={() => window.open(preview || image?.url, '_blank')} className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button type="button" size="sm" variant="destructive" onClick={handleRemove} className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm font-medium">{image?.name || 'Nova imagem'}</p>
            {image?.uploadedAt && <p className="text-xs text-gray-500">{new Date(image.uploadedAt).toLocaleDateString()}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
