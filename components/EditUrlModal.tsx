
import React, { useState, useEffect } from 'react';

interface EditUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlug: string;
  onSave: (newSlug: string) => { success: boolean, message: string };
}

const EditUrlModal: React.FC<EditUrlModalProps> = ({ isOpen, onClose, currentSlug, onSave }) => {
  const [slug, setSlug] = useState(currentSlug);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSlug(currentSlug);
    setError(''); // Reset error when modal is reopened
  }, [isOpen, currentSlug]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // This is now a synchronous call
    const result = onSave(slug);

    setIsLoading(false);
    if (!result.success) {
      setError(result.message);
    } else {
      onClose(); // Parent will handle success message and navigation
    }
  };

  const domain = window.location.origin + window.location.pathname;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
        <h3 className="text-2xl font-serif font-bold text-deep-navy mb-4">Edit Web Address</h3>
        <p className="text-sm text-soft-gray mb-4">
          Create a personal, memorable link for this memorial. Use only letters, numbers, and hyphens.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center">
              <span className="text-soft-gray bg-pale-sky px-3 py-2 rounded-l-md border border-r-0 border-silver">{domain}memorial/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                className="block w-full rounded-r-md bg-white border-silver shadow-sm focus:border-dusty-blue focus:ring-dusty-blue sm:text-sm text-deep-navy px-3 py-2"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-silver hover:bg-soft-gray/80 text-deep-navy font-bold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-dusty-blue hover:opacity-90 text-white font-bold rounded-lg disabled:bg-soft-gray"
            >
              {isLoading ? 'Saving...' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUrlModal;
