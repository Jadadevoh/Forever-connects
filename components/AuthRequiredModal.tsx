
import React from 'react';

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthRedirect: (path: '/login' | '/signup') => void;
}

const AuthRequiredModal: React.FC<AuthRequiredModalProps> = ({ isOpen, onClose, onAuthRedirect }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-dusty-blue/10">
          <svg className="h-6 w-6 text-dusty-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif font-bold text-deep-navy mt-4">Save Your Beautiful Memorial</h3>
        <p className="mt-2 text-deep-navy/80">
          You're almost there! To securely save this memorial and publish it for others to see, please create a free account.
        </p>
        <p className="mt-1 text-sm text-soft-gray">
          Don't worry, all your photos and text have been saved.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={() => onAuthRedirect('/signup')}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-dusty-blue text-base font-medium text-white hover:opacity-90 sm:w-auto sm:text-sm"
          >
            Create Free Account
          </button>
          <button
            type="button"
            onClick={() => onAuthRedirect('/login')}
            className="w-full inline-flex justify-center rounded-md border border-silver shadow-sm px-4 py-2 bg-white text-base font-medium text-deep-navy hover:bg-pale-sky sm:mt-0 sm:w-auto sm:text-sm"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthRequiredModal;
