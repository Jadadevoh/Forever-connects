
import React, { useState, useEffect } from 'react';
import { Tribute } from '../types';
import { useMemorials } from '../hooks/useMemorials';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

interface TributeItemProps {
  tribute: Tribute;
  memorialId: string;
}

const TributeItem: React.FC<TributeItemProps> = ({ tribute, memorialId }) => {
  const { toggleLike } = useMemorials();
  const { currentUser } = useAuth();

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  useEffect(() => {
    const likesCollectionRef = collection(db, 'memorials', memorialId, 'tributes', tribute.id, 'likes');
    const unsubscribe = onSnapshot(likesCollectionRef, (snapshot) => {
      setLikeCount(snapshot.size);
      if (currentUser) {
        setIsLiked(snapshot.docs.some(doc => doc.id === currentUser.id));
      }
    });

    return () => unsubscribe();
  }, [memorialId, tribute.id, currentUser]);

  const handleLikeClick = async () => {
    if (!currentUser) {
      alert("Please log in to like a tribute.");
      return;
    }
    setIsLikeLoading(true);
    await toggleLike(memorialId, tribute.id, currentUser.id);
    setIsLikeLoading(false);
  };

  const formatTributeDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="p-4 bg-pale-sky rounded-lg border border-silver flex flex-col sm:flex-row sm:space-x-4">
      {tribute.photo && (
        <div className="flex-shrink-0 w-full sm:w-32 sm:h-32 mb-4 sm:mb-0">
            <img src={tribute.photo.dataUrl} alt="Tribute attachment" className="w-full h-full object-cover rounded-md" />
        </div>
      )}
      <div className="flex-grow">
        <p className="text-deep-navy leading-relaxed whitespace-pre-wrap">"{tribute.message}"</p>
        <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-soft-gray">
                <span className="font-semibold text-deep-navy/80">{tribute.author}</span>
                <span className="mx-1 hidden sm:inline">&ndash;</span>
                <br className="sm:hidden" />
                <time dateTime={tribute.createdAt?.toDate().toISOString()}>{formatTributeDate(tribute.createdAt)}</time>
            </div>
            <div className="flex items-center space-x-2">
                <button 
                    onClick={handleLikeClick} 
                    disabled={isLikeLoading || !currentUser}
                    className={`p-1 rounded-full transition-colors duration-200 ${isLiked ? 'text-red-500 bg-red-100' : 'text-soft-gray hover:text-red-500 hover:bg-red-100'}`}
                    aria-label="Like tribute"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                </button>
                <span className="text-sm font-semibold text-deep-navy">{likeCount}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TributeItem;
