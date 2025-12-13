import React, { useState, useCallback } from 'react';
import { MediaItem } from '../types';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../hooks/useAuth';

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
  const { currentUser } = useAuth();

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setIsProcessing(true);
    
    if (!currentUser) {
        setError("You must be logged in to upload files.");
        setIsProcessing(false);
        return;
    }
    
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

    try {
        const uploadPromises = validFiles.map(async (file) => {
            const fileType = getFileType(file)!;
            const storageRef = ref(storage, `media/${currentUser.id}/${fileType}s/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            const newMediaItem: MediaItem = {
                id: snapshot.ref.fullPath,
                url: downloadURL,
                type: fileType,
                fileName: file.name
            };
            return newMediaItem;
        });

        const items = await Promise.all(uploadPromises);
        onMediaUpload(items);
    } catch (err) {
        console.error(err);
        setError('Error processing files. Please try again.');
    } finally {
        setIsProcessing(false);
        event.target.value = '';
    }

  }, [onMediaUpload, currentUser]);
  
  return (
    <div>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-soft-gray border-dashed rounded-md">
        <div className="space-y-1 text-center">
           {isProcessing ? (
            <div className="flex flex-col items-center justify-center">
              <svg className="animate-spin h-12 w-12 text-dusty-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <p className="text-sm text-soft-gray mt-2">Uploading...</p>
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
