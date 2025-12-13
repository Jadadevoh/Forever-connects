import React from 'react';
import { Tribute } from '../types';
import { useMemorials } from '../hooks/useMemorials';
import { useAuth } from '../hooks/useAuth';
// FIX: Import Timestamp to correctly handle date objects from Firestore.
import { Timestamp } from 'firebase/firestore';

interface TributeListProps {
  tributes: Tribute[];
  memorialId: string;
}

const TributeList: React.FC<TributeListProps> = ({ tributes, memorialId }) => {
  const { toggleLike } = useMemorials();
  const { currentUser } = useAuth();

  if (tributes.length === 0) {
    return <p className="text-center text-soft-gray mt-8">Be the first to leave a tribute.</p>;
  }

  const formatTributeDate = (timestamp: Timestamp) => {
    // FIX: Handle Firestore Timestamp object correctly.
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="mt-8 space-y-6">
      {tributes.map(tribute => (
        <div key={tribute.id} className="p-4 bg-pale-sky rounded-lg border border-silver flex flex-col sm:flex-row sm:space-x-4">
          {tribute.photo && (
            <div className="flex-shrink-0 w-full sm:w-32 sm:h-32 mb-4 sm:mb-0">
                {/* FIX: Changed dataUrl to url to match Photo type. */}
                <img src={tribute.photo.url} alt="Tribute attachment" className="w-full h-full object-cover rounded-md" />
            </div>
          )}
          <div className="flex-grow">
            <p className="text-deep-navy leading-relaxed whitespace-pre-wrap">"{tribute.message}"</p>
            <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-soft-gray">
                    <span className="font-semibold text-deep-navy/80">{tribute.author}</span>
                    <span className="mx-1 hidden sm:inline">&ndash;</span>
                    <br className="sm:hidden" />
                    {/* FIX: Handle potential null value and convert Timestamp correctly. */}
                    <time dateTime={tribute.createdAt?.toDate().toISOString()}>{formatTributeDate(tribute.createdAt)}</time>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => currentUser && toggleLike(memorialId, tribute.id, currentUser.id)} 
                        disabled={!currentUser}
                        className={`p-1 rounded-full transition-colors duration-200 text-soft-gray hover:text-red-500 hover:bg-red-100`}
                        aria-label="Like tribute"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <span className="text-sm font-semibold text-deep-navy">{tribute.likes}</span>
                </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TributeList;