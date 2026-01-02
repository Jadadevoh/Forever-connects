import React, { useRef } from 'react';
import { GalleryItem } from '../types';

export const renderGalleryItem = (item: GalleryItem) => {
    switch (item.type) {
        case 'image': return <div className="aspect-w-1 aspect-h-1 flex-shrink-0 w-full"><img src={item.url} alt={item.caption || 'A cherished memory'} className="w-full h-full object-cover rounded-lg shadow-sm" /></div>;
        case 'video': return <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg shadow-sm overflow-hidden flex-shrink-0 w-full"><video src={item.url} controls className="w-full h-full object-contain" /></div>;
        case 'audio': return <div className="p-4 bg-pale-sky rounded-lg shadow-sm border border-silver flex-shrink-0 w-full"><h4 className="text-sm font-semibold text-deep-navy truncate mb-2">{item.fileName}</h4><audio src={item.url} controls className="w-full" /></div>;
        case 'document': return <a href={item.url} target="_blank" rel="noopener noreferrer" download={item.fileName} className="block p-4 bg-pale-sky rounded-lg shadow-sm border border-silver hover:bg-silver transition-colors h-full flex-shrink-0 w-full"><div className="flex items-center space-x-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-dusty-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><p className="text-sm font-semibold text-deep-navy break-all">{item.fileName}</p></div></a>;
        case 'link': return <a href={item.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-pale-sky rounded-lg shadow-sm border border-silver hover:bg-silver transition-colors h-full flex-shrink-0 w-full"><div className="flex items-center space-x-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-dusty-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg><div className="overflow-hidden"><p className="text-sm font-semibold text-deep-navy truncate">{item.title}</p><p className="text-xs text-soft-gray truncate">{item.url}</p></div></div></a>;
        default: return null;
    }
};

export const GallerySlider: React.FC<{ items: GalleryItem[] }> = ({ items }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    }
    if (items.length === 0) return null;
    return <div className="relative"><div ref={scrollRef} className="flex space-x-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4" style={{ scrollBehavior: 'smooth' }}>{items.map(item => <div key={item.id} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 snap-center">{renderGalleryItem(item)}</div>)}</div><button onClick={() => scroll('left')} className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md z-10 disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-deep-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button><button onClick={() => scroll('right')} className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md z-10 disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-deep-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button></div>;
}
