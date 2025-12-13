import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMemorials } from '../hooks/useMemorials';
import { Memorial, GalleryItem, Tribute } from '../types';
import TributeList from '../components/TributeList';
import TributeForm from '../components/TributeForm';
import { useAuth } from '../hooks/useAuth';
import DonationModule from '../components/DonationModule';
import ShareModal from '../components/ShareModal';
import EditUrlModal from '../components/EditUrlModal';

const getAge = (birthDate: string, deathDate: string): number => {
    const start = new Date(birthDate);
    const end = new Date(deathDate);
    let age = end.getFullYear() - start.getFullYear();
    const m = end.getMonth() - start.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < start.getDate())) { age--; }
    return age;
}

const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

const renderGalleryItem = (item: GalleryItem) => {
    switch (item.type) {
        case 'image': return <div className="aspect-w-1 aspect-h-1 flex-shrink-0 w-full"><img src={item.url} alt={item.caption || 'A cherished memory'} className="w-full h-full object-cover rounded-lg shadow-sm" /></div>;
        case 'video': return <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg shadow-sm overflow-hidden flex-shrink-0 w-full"><video src={item.url} controls className="w-full h-full object-contain" /></div>;
        case 'audio': return <div className="p-4 bg-pale-sky rounded-lg shadow-sm border border-silver flex-shrink-0 w-full"><h4 className="text-sm font-semibold text-deep-navy truncate mb-2">{item.fileName}</h4><audio src={item.url} controls className="w-full" /></div>;
        case 'document': return <a href={item.url} target="_blank" rel="noopener noreferrer" download={item.fileName} className="block p-4 bg-pale-sky rounded-lg shadow-sm border border-silver hover:bg-silver transition-colors h-full flex-shrink-0 w-full"><div className="flex items-center space-x-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-dusty-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><p className="text-sm font-semibold text-deep-navy break-all">{item.fileName}</p></div></a>;
        case 'link': return <a href={item.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-pale-sky rounded-lg shadow-sm border border-silver hover:bg-silver transition-colors h-full flex-shrink-0 w-full"><div className="flex items-center space-x-3"><svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-dusty-blue flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg><div className="overflow-hidden"><p className="text-sm font-semibold text-deep-navy truncate">{item.title}</p><p className="text-xs text-soft-gray truncate">{item.url}</p></div></div></a>;
        default: return null;
    }
};

const GallerySlider: React.FC<{items: GalleryItem[]}> = ({items}) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scroll = (direction: 'left' | 'right') => {
        if(scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    }
    if (items.length === 0) return null;
    return <div className="relative"><div ref={scrollRef} className="flex space-x-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4" style={{scrollBehavior: 'smooth'}}>{items.map(item => <div key={item.id} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 snap-center">{renderGalleryItem(item)}</div>)}</div><button onClick={() => scroll('left')} className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md z-10 disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-deep-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button><button onClick={() => scroll('right')} className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow-md z-10 disabled:opacity-50"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-deep-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button></div>;
}

const ClassicLayout: React.FC<{memorial: Memorial, fullName: string}> = ({memorial, fullName}) => {
    const locationString = [memorial.city, memorial.state, memorial.country].filter(Boolean).join(', ');
    return <div className="p-8"><header className="text-center mb-10"><img src={memorial.profileImage.url} alt={fullName} className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full mx-auto shadow-lg border-4 border-white -mb-16 relative z-10" /></header><div className="bg-pale-sky/50 rounded-lg p-8 pt-20 -mt-16 border border-silver"><div className="text-center"><h1 className="text-4xl md:text-5xl font-serif font-bold text-deep-navy">{fullName}</h1><p className="text-lg text-soft-gray mt-2">{formatDate(memorial.birthDate)} &ndash; {formatDate(memorial.deathDate)}</p><p className="text-md text-soft-gray mt-1">{locationString} &bull; Aged {getAge(memorial.birthDate, memorial.deathDate)}{memorial.gender && memorial.gender !== 'Prefer not to say' && ` • ${memorial.gender}`}</p>{memorial.causeOfDeath.length > 0 && !memorial.isCauseOfDeathPrivate && <p className="text-sm text-soft-gray mt-2">Cause of Death: {memorial.causeOfDeath.join(', ')}</p>}</div><section className="mt-10"><h2 className="text-3xl font-serif text-deep-navy mb-4 border-b border-silver pb-2">Life Story</h2><div className="prose-styles text-base md:text-lg text-deep-navy/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: memorial.biography }} /></section>{memorial.gallery.length > 0 && <section className="mt-10"><h2 className="text-3xl font-serif text-deep-navy mb-4 border-b border-silver pb-2">Media Gallery</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{memorial.gallery.map(item => <div key={item.id}>{renderGalleryItem(item)}</div>)}</div></section>}</div></div>;
};

const StoryLayout: React.FC<{memorial: Memorial, fullName: string}> = ({memorial, fullName}) => {
    const locationString = [memorial.city, memorial.state, memorial.country].filter(Boolean).join(', ');
    return <div className="p-8"><section className="grid md:grid-cols-3 gap-8 md:gap-12 items-start"><div className="md:col-span-1 text-center md:text-left"><img src={memorial.profileImage.url} alt={fullName} className="w-40 h-40 object-cover rounded-full mx-auto md:mx-0 shadow-lg border-4 border-white" /><h1 className="text-4xl font-serif font-bold text-deep-navy mt-4">{fullName}</h1><p className="text-lg text-soft-gray mt-2">{formatDate(memorial.birthDate)} &ndash; {formatDate(memorial.deathDate)}</p><p className="text-md text-soft-gray mt-1">{locationString} &bull; Aged {getAge(memorial.birthDate, memorial.deathDate)}{memorial.gender && memorial.gender !== 'Prefer not to say' && ` • ${memorial.gender}`}</p>{memorial.causeOfDeath.length > 0 && !memorial.isCauseOfDeathPrivate && <p className="text-sm text-soft-gray mt-2">Cause of Death: {memorial.causeOfDeath.join(', ')}</p>}</div><div className="md:col-span-2"><h2 className="text-3xl font-serif text-deep-navy mb-4 border-b border-silver pb-2">Life Story</h2><div className="prose-styles text-base md:text-lg text-deep-navy/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: memorial.biography }} /></div></section>{memorial.gallery.length > 0 && <section className="mt-10"><h2 className="text-3xl font-serif text-deep-navy mb-4 border-b border-silver pb-2">Media Gallery</h2><GallerySlider items={memorial.gallery} /></section>}</div>;
}

const MemorialPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { getMemorialBySlug, updateMemorialSlug } = useMemorials();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const memorial = slug ? getMemorialBySlug(slug) : null;
  const tributes = memorial ? memorial.tributes : [];

  const [activeTab, setActiveTab] = useState<'story' | 'tribute' | 'support' | 'gallery'>('story');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isEditUrlModalOpen, setIsEditUrlModalOpen] = useState(false);

  const isOwner = currentUser && memorial && currentUser.id === memorial.userId;
  
  if (!memorial || memorial.status !== 'active') { return <div className="text-center text-xl text-soft-gray p-12">Memorial not found or is not public.</div>; }

  const handleSaveSlug = (newSlug: string) => {
    const result = updateMemorialSlug(memorial.id, newSlug);
    if (result.success) {
      navigate(`/memorial/${newSlug}`, { replace: true });
    }
    return result; 
  };

  const fullName = [memorial.firstName, memorial.middleName, memorial.lastName].filter(Boolean).join(' ');
  const themeParts = memorial.theme.split('-');
  const layoutStyle = themeParts.pop();
  const colorTheme = themeParts.join('-');

  const LayoutComponent = layoutStyle === 'story' ? StoryLayout : ClassicLayout;

  return <>
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} url={window.location.href} title={`In memory of ${fullName}`} />
      {isOwner && (
        <EditUrlModal 
            isOpen={isEditUrlModalOpen} 
            onClose={() => setIsEditUrlModalOpen(false)} 
            currentSlug={memorial.slug} 
            onSave={handleSaveSlug}
        />
      )}
      <div className={`relative max-w-5xl mx-auto ${'theme-' + colorTheme}`}>
          <div className="absolute top-4 right-4 z-20 flex space-x-2">
              <button onClick={() => setIsShareModalOpen(true)} className="bg-white hover:bg-pale-sky text-deep-navy font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md border border-silver flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" /></svg>Share</button>
              {isOwner && (
                <div className="relative">
                    <button onClick={() => setIsEditUrlModalOpen(true)} className="bg-white hover:bg-pale-sky text-deep-navy font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md border border-silver">Manage</button>
                </div>
              )}
          </div>
          <div className="bg-white border border-silver rounded-xl shadow-sm">
              <div className="border-b border-silver flex flex-wrap">
                  <button onClick={() => setActiveTab('story')} className={`flex-grow sm:flex-grow-0 px-4 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${activeTab === 'story' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Life Story</button>
                  <button onClick={() => setActiveTab('tribute')} className={`flex-grow sm:flex-grow-0 px-4 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${activeTab === 'tribute' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Leave a Tribute</button>
                  {memorial.donationInfo.isEnabled && <button onClick={() => setActiveTab('support')} className={`flex-grow sm:flex-grow-0 px-4 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${activeTab === 'support' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Support Memorial</button>}
                  {memorial.gallery.length > 0 && <button onClick={() => setActiveTab('gallery')} className={`flex-grow sm:flex-grow-0 px-4 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${activeTab === 'gallery' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Gallery</button>}
              </div>
              <div>
                  {activeTab === 'story' && <div><LayoutComponent memorial={memorial} fullName={fullName} /><div className="p-8 border-t border-silver"><h2 className="text-3xl font-serif text-deep-navy mb-4">Shared Tributes</h2><TributeList tributes={tributes} memorialId={memorial.id}/></div></div>}
                  {activeTab === 'tribute' && <div className="p-4 sm:p-8"><TributeForm memorialId={memorial.id} fullName={fullName} /></div>}
                  {activeTab === 'support' && memorial.donationInfo.isEnabled && <div className="p-4 sm:p-8"><DonationModule memorial={memorial} /></div>}
                  {activeTab === 'gallery' && memorial.gallery.length > 0 && <div className="p-4 sm:p-8"><h2 className="text-3xl font-serif text-deep-navy mb-4">Media Gallery</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{memorial.gallery.map(item => <div key={item.id}>{renderGalleryItem(item)}</div>)}</div></div>}
              </div>
          </div>
      </div>
    </>;
};

export default MemorialPage;