import React, { useState, useCallback } from 'react';
import { Photo } from '../types';

interface PhotoUploadProps {
  onPhotosUpload: (photos: Photo[]) => void;
  multiple: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotosUpload, multiple }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setPreviews([]);
    
    const newPhotos: Photo[] = [];
    const newPreviews: string[] = [];

    // FIX: Convert FileList to array to avoid issues and use it for length check.
    const filesArray = Array.from(files);

    // FIX: Add explicit type for `file` to resolve 'unknown' type errors.
    filesArray.forEach((file: File) => {
      if (!file.type.startsWith('image/')) {
        setError('Please upload only image files.');
        return;
      }

      const reader = new FileReader();
      // FIX: Add explicit type for event in onload handler.
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          newPhotos.push({ id: `${file.name}-${Date.now()}`, dataUrl });
          newPreviews.push(dataUrl);

          // If all files are processed
          if (newPhotos.length === filesArray.length) {
            onPhotosUpload(newPhotos);
            setPreviews(newPreviews);
          }
        }
      };
      reader.onerror = () => {
        setError('Error reading file.');
      };
      reader.readAsDataURL(file);
    });
  }, [onPhotosUpload]);
  
  return (
    <div>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-soft-gray border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <svg className="mx-auto h-12 w-12 text-soft-gray" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex text-sm text-soft-gray">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-dusty-blue hover:text-deep-navy focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-dusty-blue">
              <span>Upload {multiple ? 'files' : 'a file'}</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} multiple={multiple} accept="image/*" />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-soft-gray/80">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {previews.length > 0 && !multiple && (
        <div className="mt-4">
          <img src={previews[0]} alt="Preview" className="h-24 w-24 rounded-full object-cover mx-auto" />
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;