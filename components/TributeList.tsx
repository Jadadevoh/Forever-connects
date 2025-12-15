import React from 'react';
import { Tribute } from '../types';
import { useMemorials } from '../hooks/useMemorials';
import TributeItem from './TributeItem';

interface TributeListProps {
  tributes: Tribute[];
  memorialId: string;
}

const TributeList: React.FC<TributeListProps> = ({ tributes, memorialId }) => {
  const { toggleLike } = useMemorials();

  if (tributes.length === 0) {
    return <p className="text-center text-soft-gray mt-8">Be the first to leave a tribute.</p>;
  }

  return (
    <div className="mt-8 space-y-6">
      {tributes.map(tribute => (
        <TributeItem 
            key={tribute.id} 
            tribute={tribute} 
            memorialId={memorialId} 
            onLike={toggleLike} 
        />
      ))}
    </div>
  );
};

export default TributeList;