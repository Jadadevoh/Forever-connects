import React from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url, title }) => {
  if (!isOpen) return null;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    }, () => {
      alert('Failed to copy link.');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
        <h3 className="text-2xl font-serif font-bold text-deep-navy text-center mb-4">Share this Memorial</h3>
        
        <div className="flex items-center space-x-2">
          <input
            type="text"
            readOnly
            value={url}
            className="w-full rounded-md bg-pale-sky border-silver shadow-sm sm:text-sm text-deep-navy px-3 py-2"
          />
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-dusty-blue hover:opacity-90 text-white font-bold rounded-lg"
          >
            Copy
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-silver text-center">
          <p className="text-soft-gray mb-3">Share on social media</p>
          <div className="flex justify-center space-x-4">
            <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.59 0 0 .59 0 1.325v21.35C0 23.41.59 24 1.325 24H12.82v-9.29H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.735 0 1.325-.59 1.325-1.325V1.325C24 .59 23.41 0 22.675 0z"/></svg>
            </a>
             <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-700">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616v.064c0 2.444 1.743 4.482 4.058 4.95-.423.115-.87.176-1.322.176-.326 0-.64-.031-.945-.093.64 2.005 2.502 3.46 4.718 3.501-1.73 1.354-3.91 2.165-6.28 2.165-.41 0-.814-.024-1.21-.072 2.236 1.438 4.896 2.28 7.73 2.28 9.284 0 14.376-7.712 14.376-14.376 0-.219-.005-.436-.014-.653.985-.712 1.836-1.6 2.518-2.612z"/></svg>
            </a>
             <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.25V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
            </a>
             <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-700">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04 2.01A10.03 10.03 0 002.01 12.04a10.03 10.03 0 0017.92 6.32l2.06-2.06-2.06 2.06a10.03 10.03 0 00-6.32-17.92zM12.04 3.51a8.53 8.53 0 11-6.32 14.85l.53-.53-.53.53a8.53 8.53 0 016.32-14.85zM17.43 14.84l-1.42-2.84a.5.5 0 00-.67-.2l-1.34.67.67-1.34a.5.5 0 00-.2-.67L12 9.04l-1.52.76a.5.5 0 00-.2.67l.67 1.34-1.34-.67a.5.5 0 00-.67.2l-1.42 2.84a.5.5 0 00.11.56l2.12 2.12a.5.5 0 00.56.11l2.84-1.42 1.42 2.84a.5.5 0 00.56.11l2.12-2.12a.5.5 0 00.11-.56z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
