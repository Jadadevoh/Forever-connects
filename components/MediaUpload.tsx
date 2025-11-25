import React, { useState, useCallback } from 'react';
import { MediaItem } from '../types';

interface MediaUploadProps {
  onMediaUpload: (items: MediaItem[]) => void;
  multiple: boolean;
}

// FIX: Changed return type from `GalleryItemType` to `MediaItem['type']` to be more specific
// and prevent type errors, as this function only handles media files, not links.
const getFileType = (file: File): MediaItem['type'] | null => {
  const type = file.type;
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('audio/')) return 'audio';
  if (type === 'application/pdf' || type.startsWith('application/msword') || type.startsWith('application/vnd.openxmlformats-officedocument')) return 'document';
  return null;
};

const MediaUpload: React.FC<MediaUploadProps> = ({ onMediaUpload, multiple }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    
    const newMediaItems: MediaItem[] = [];
    const filesArray = Array.from(files);
    // FIX: Explicitly type `f` as `File` to resolve type inference issue where `f` was inferred as `unknown`.
    const validFiles = filesArray.filter((f: File) => getFileType(f));

    if (validFiles.length !== filesArray.length) {
        setError('Some file types are not supported.');
    }


    if(validFiles.length === 0) {
        // Clear the input value to allow re-uploading the same file
        event.target.value = '';
        return;
    }


    validFiles.forEach((file: File) => {
      const fileType = getFileType(file)!; // We know it's valid from the filter

      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          newMediaItems.push({
            id: `${file.name}-${Date.now()}`,
            dataUrl,
            type: fileType,
            fileName: file.name,
          });

          // If all valid files are processed, call the callback
          if (newMediaItems.length === validFiles.length) {
            onMediaUpload(newMediaItems);
          }
        }
      };
      reader.onerror = () => {
        setError(`Error reading file: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
     // Clear the input value to allow re-uploading the same file
    event.target.value = '';
  }, [onMediaUpload]);
  
  return (
    <div>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-soft-gray border-dashed rounded-md">
        <div className="space-y-1 text-center">
           <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-soft-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          <div className="flex text-sm text-soft-gray">
            <label htmlFor="media-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-dusty-blue hover:text-deep-navy focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-dusty-blue">
              <span>Upload {multiple ? 'files' : 'a file'}</span>
              <input id="media-upload" name="media-upload" type="file" className="sr-only" onChange={handleFileChange} multiple={multiple} accept="image/*,video/*,audio/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-soft-gray/80">Photos, Videos, Audio, & Docs</p>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default MediaUpload;