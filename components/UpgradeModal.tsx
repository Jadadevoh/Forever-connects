
import React from 'react';
import { Link } from 'react-router-dom';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, reason }) => {
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
        </div>
        <h3 className="text-2xl font-serif font-bold text-deep-navy mt-4">Upgrade to Premium</h3>
        <p className="mt-2 text-deep-navy/80">
          Please upgrade your plan {reason}.
        </p>
        <p className="mt-1 text-deep-navy/80">
          Our premium plans unlock unlimited media uploads and many more features to create a truly special memorial.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
          <Link
            to="/pricing"
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-dusty-blue text-base font-medium text-white hover:opacity-90 sm:w-auto sm:text-sm"
          >
            View Plans
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="w-full inline-flex justify-center rounded-md border border-silver shadow-sm px-4 py-2 bg-white text-base font-medium text-deep-navy hover:bg-pale-sky sm:mt-0 sm:w-auto sm:text-sm"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;
