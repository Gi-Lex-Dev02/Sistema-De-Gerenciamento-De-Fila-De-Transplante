import React from 'react';
import { Button } from './button';
import { Upload, X } from 'lucide-react';
import type { FileAttachment } from '@/lib/schemas';

interface FileUploadProps {
  files: FileAttachment[];
  onUpload: (files: File[]) => void;
  onRemove: (file: FileAttachment) => void;
  accept?: string;
}

export function FileUpload({ files, onUpload, onRemove, accept = "application/pdf,image/png,image/jpeg" }: FileUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    onUpload(selectedFiles);
    event.target.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button type="button" variant="outline" onClick={() => document.getElementById('file-upload')?.click()} className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Anexar arquivo
        </Button>
        <input id="file-upload" type="file" className="hidden" accept={accept} onChange={handleFileChange} multiple />
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.url} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{file.name}</span>
                <span className="text-xs text-gray-500">{new Date(file.uploadedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800">Visualizar</a>
                <Button type="button" variant="ghost" size="sm" onClick={() => onRemove(file)} className="h-8 w-8 p-0 text-red-600 hover:text-red-800">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
