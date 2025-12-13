import React, { useState, useCallback } from 'react';
import { MediaItem } from '../types';

interface MediaUploadProps {
  onMediaUpload: (items: MediaItem[]) => void;
  multiple: boolean;
}

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
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setIsProcessing(true);
    
    const filesArray: File[] = Array.from(files);
    const validFiles = filesArray.filter((f) => getFileType(f));

    if (validFiles.length !== filesArray.length) {
      setError('Some file types are not supported.');
    }
    if (validFiles.length === 0) {
      setIsProcessing(false);
      event.target.value = '';
      return;
    }

    const fileProcessingPromises = validFiles.map(file => {
      return new Promise<MediaItem>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            const fileType = getFileType(file);
            if (fileType) {
              const newMediaItem: MediaItem = {
                id: `media_${Date.now()}_${Math.random()}`,
                url: e.target.result as string,
                type: fileType,
                fileName: file.name
              };
              resolve(newMediaItem);
            } else {
              reject(new Error('Unsupported file type.'));
            }
          } else {
            reject(new Error('Failed to read file.'));
          }
        };
        reader.onerror = () => reject(new Error('Error reading file.'));
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileProcessingPromises)
      .then(items => {
        onMediaUpload(items);
        setIsProcessing(false);
        event.target.value = ''; // Reset file input
      })
      .catch(err => {
        console.error(err);
        setError('Error processing files. Please try again.');
        setIsProcessing(false);
      });

  }, [onMediaUpload]);
  
  return (
    <div>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-soft-gray border-dashed rounded-md">
        <div className="space-y-1 text-center">
           {isProcessing ? (
            <div className="flex flex-col items-center justify-center">
              <svg className="animate-spin h-12 w-12 text-dusty-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <p className="text-sm text-soft-gray mt-2">Processing...</p>
            </div>
           ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-soft-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <div className="flex text-sm text-soft-gray">
                <label htmlFor="media-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-dusty-blue hover:text-deep-navy focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-dusty-blue">
                  <span>Upload {multiple ? 'files' : 'a file'}</span>
                  <input id="media-upload" name="media-upload" type="file" className="sr-only" onChange={handleFileChange} multiple={multiple} disabled={isProcessing} accept="image/*,video/*,audio/*,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-soft-gray/80">Photos, Videos, Audio, & Docs</p>
            </>
           )}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default MediaUpload;