import React, { useState, useCallback } from 'react';
import { Photo } from '../types';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useAuth } from '../hooks/useAuth';

interface PhotoUploadProps {
  onPhotosUpload: (photos: Photo[]) => void;
  multiple: boolean;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ onPhotosUpload, multiple }) => {
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setIsLoading(true);
    setPreviews([]);

    const filesArray: File[] = Array.from(files);
    const imageFiles = filesArray.filter(file => file.type.startsWith('image/'));

    if (imageFiles.length !== filesArray.length) {
      setError('Please upload only image files.');
      setIsLoading(false);
      return;
    }
    
    if (!currentUser) {
        setError("You must be logged in to upload files.");
        setIsLoading(false);
        return;
    }

    try {
        const uploadPromises = imageFiles.map(async (file) => {
            const storageRef = ref(storage, `images/${currentUser.id}/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            const newPhoto: Photo = {
                id: snapshot.ref.fullPath,
                url: downloadURL,
                caption: ''
            };
            return newPhoto;
        });

        const photos = await Promise.all(uploadPromises);
        onPhotosUpload(photos);
        setPreviews(photos.map(p => p.url));
    } catch (err) {
        console.error(err);
        setError('Error processing images. Please try again.');
    } finally {
        setIsLoading(false);
    }
  }, [onPhotosUpload, currentUser]);
  
  return (
    <div>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-soft-gray border-dashed rounded-md">
        <div className="space-y-1 text-center">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <svg className="animate-spin h-12 w-12 text-dusty-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <p className="text-sm text-soft-gray mt-2">Uploading...</p>
            </div>
          ) : (
            <>
              <svg className="mx-auto h-12 w-12 text-soft-gray" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="flex text-sm text-soft-gray">
                <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-dusty-blue hover:text-deep-navy focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-dusty-blue">
                  <span>Upload {multiple ? 'files' : 'a file'}</span>
                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} multiple={multiple} accept="image/*" disabled={isLoading} />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-soft-gray/80">PNG, JPG, GIF up to 10MB</p>
            </>
          )}
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
