import React, { useState } from 'react';
import { Memorial } from '../../types';
import TributeList from '../TributeList';
import TributeForm from '../TributeForm';
import { renderGalleryItem } from '../GalleryHelpers';
import DonationModule from '../DonationModule';

interface PersonalTouchLayoutProps {
    memorial: Memorial;
    fullName: string;
}

const PersonalTouchLayout: React.FC<PersonalTouchLayoutProps> = ({ memorial, fullName }) => {
    const [activeTab, setActiveTab] = useState<'story' | 'gallery' | 'tributes' | 'events' | 'support'>('story');
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    // Helper to format dates
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const renderHero = () => (
        <section className="relative pt-10 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left: Text Content */}
                <div className="lg:col-span-5 flex flex-col gap-4 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-primary w-fit border border-blue-100 dark:border-blue-800">
                        <span className="material-symbols-outlined text-sm">filter_vintage</span>
                        <span className="text-xs font-bold uppercase tracking-wider">In Loving Memory</span>
                    </div>
                    <h1 className="font-handwriting text-7xl sm:text-8xl text-deep-navy dark:text-white leading-[0.9] drop-shadow-sm rotate-random-1 origin-bottom-left">
                        {memorial.firstName} <br /> <span className="text-primary">{memorial.lastName}</span>
                    </h1>
                    <div className="flex flex-col gap-1 pl-2 border-l-4 border-primary/30 mt-2">
                        <p className="text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400">
                            {formatDate(memorial.birthDate)} — {formatDate(memorial.deathDate)}
                        </p>
                        {memorial.aiHighlights && memorial.aiHighlights.length > 0 && (
                            <p className="text-base text-slate-400 dark:text-slate-500 italic">
                                "{memorial.aiHighlights[0]}"
                            </p>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-6">
                        <button onClick={() => setActiveTab('tributes')} className="flex items-center gap-2 bg-deep-navy dark:bg-white text-white dark:text-deep-navy px-6 py-3 rounded-full font-bold shadow-lg hover:transform hover:-translate-y-1 transition-all">
                            <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
                            Share a Memory
                        </button>
                    </div>
                </div>

                {/* Right: Photo Collage */}
                <div className="lg:col-span-7 relative h-[400px] sm:h-[500px] w-full mt-8 lg:mt-0">
                    {/* Photo 1: Main Portrait */}
                    <div className="absolute top-0 right-[15%] w-[55%] aspect-[3/4] bg-slate-200 dark:bg-slate-700 rounded-2xl shadow-xl z-20 overflow-hidden border-4 border-white dark:border-slate-800 rotate-random-2 transform hover:scale-105 transition-transform duration-500 group">
                        <img
                            src={memorial.profileImage?.url || 'https://via.placeholder.com/400x500'}
                            alt={fullName}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-sm font-medium">Portrait</p>
                        </div>
                    </div>

                    {/* Photo 2: Secondary (using first gallery image or placeholder) */}
                    <div className="absolute bottom-4 left-[5%] w-[40%] aspect-square bg-slate-200 dark:bg-slate-700 rounded-full shadow-lg z-30 overflow-hidden border-4 border-white dark:border-slate-800 -rotate-3 hover:rotate-0 transition-transform duration-500">
                        {memorial.gallery && memorial.gallery.length > 0 ? (
                            <img src={memorial.gallery[0].url} className="w-full h-full object-cover" alt="Memory" />
                        ) : (
                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${memorial.profileImage?.url})`, filter: 'grayscale(100%)' }}></div>
                        )}
                    </div>

                    {/* Photo 3: Landscape (using second gallery image or placeholder) */}


                    {/* Decorative Element */}

                </div>
            </div>
        </section>
    );

    return (
        <div className="font-display bg-background-light dark:bg-background-dark min-h-screen pb-20">
            {/* Donation Modal */}
            {isDonationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsDonationModalOpen(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl animate-scale-up" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setIsDonationModalOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                        >
                            <span className="material-symbols-outlined text-gray-500">close</span>
                        </button>
                        <div className="p-8 pt-12">
                            <DonationModule memorial={memorial} />
                        </div>
                    </div>
                </div>
            )}



            {renderHero()}

            {/* Navigation Tabs */}
            <div className="max-w-7xl mx-auto px-4 py-4 border-b border-slate-200 dark:border-slate-800 shadow-sm text-center sticky top-16 z-40 bg-background-light/95 backdrop-blur-md">
                <div className="flex justify-center overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-3 p-1 bg-white dark:bg-slate-800/50 rounded-full shadow-inner border border-slate-100 dark:border-slate-700/50">
                        {[
                            { id: 'story', icon: 'auto_stories', label: 'Story' },
                            { id: 'gallery', icon: 'photo_library', label: 'Gallery' },
                            { id: 'tributes', icon: 'favorite', label: 'Tributes' },
                            { id: 'events', icon: 'event', label: 'Events' },
                            ...(memorial.donationInfo?.isEnabled ? [{ id: 'support', icon: 'volunteer_activism', label: 'Support' }] : [])
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                            >
                                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col gap-10">

                {/* STORY TAB */}
                {activeTab === 'story' && (
                    <div className="animate-fade-in space-y-10">
                        <article className="bg-paper-light dark:bg-paper-dark p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-primary to-purple-500 opacity-70"></div>
                            <h2 className="font-handwriting text-5xl mb-6 text-slate-800 dark:text-slate-100 rotate-random-1">A Story of Laughter & Love</h2>
                            <div className="prose prose-lg dark:prose-invert font-display text-slate-600 dark:text-slate-300 max-w-none" dangerouslySetInnerHTML={{ __html: memorial.biography || 'No biography provided yet.' }} />

                            <div className="my-10 mx-auto max-w-md bg-[#fffdeb] dark:bg-slate-700 text-slate-800 dark:text-slate-100 p-6 rounded-lg shadow-lg rotate-2 transform hover:rotate-0 transition-transform duration-300 relative">
                                <span className="material-symbols-outlined absolute -top-3 -left-3 text-red-400 text-3xl drop-shadow-sm">push_pin</span>
                                <p className="font-handwriting text-3xl text-center leading-relaxed">
                                    "The only thing that really matters is how much you loved, and how gently you lived."
                                </p>
                            </div>
                        </article>

                        {/* Things They Loved (Static for now, as consistent with design request) */}
                        {/* Gallery Preview */}
                        {/* Gallery Preview */}
                        {memorial.gallery && memorial.gallery.length > 0 && (
                            <section className="animate-fade-in mt-12">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="font-handwriting text-4xl text-slate-800 dark:text-slate-100">Cherished Memories</h3>
                                    <button onClick={() => setActiveTab('gallery')} className="text-primary font-bold hover:underline">View All</button>
                                </div>

                                {/* Recent Photos */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                    {memorial.gallery.filter(i => i.type === 'image').slice(0, 4).map((item) => (
                                        <div key={item.id} className="aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-pointer" onClick={() => setActiveTab('gallery')}>
                                            <img src={item.url} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" alt={item.caption || "Memory"} />
                                        </div>
                                    ))}
                                </div>

                                {/* Videos, Links & Files */}
                                {memorial.gallery.some(i => i.type !== 'image') && (
                                    <div className="mt-8">
                                        <h4 className="font-bold text-lg text-slate-700 dark:text-slate-200 mb-4 border-b border-slate-200 pb-2">Videos & Resources</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                            {memorial.gallery.filter(i => i.type !== 'image').slice(0, 6).map((item) => (
                                                <div key={item.id} onClick={() => setActiveTab('gallery')} className="flex items-center p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-shadow">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mr-3 shrink-0">
                                                        {item.type === 'video' && <span className="material-symbols-outlined text-red-500">play_circle</span>}
                                                        {item.type === 'link' && <span className="material-symbols-outlined text-blue-500">link</span>}
                                                        {item.type === 'audio' && <span className="material-symbols-outlined text-purple-500">mic</span>}
                                                        {item.type === 'document' && <span className="material-symbols-outlined text-orange-500">description</span>}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="font-medium text-sm truncate text-slate-800 dark:text-slate-100">
                                                            {'caption' in item && item.caption ? item.caption :
                                                                'title' in item && item.title ? item.title :
                                                                    'fileName' in item ? item.fileName : 'Untitled Item'}
                                                        </p>
                                                        <p className="text-xs text-slate-500 uppercase">{item.type}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Tributes List */}
                        <section className="animate-fade-in mt-16 space-y-8">
                            <div className="text-center">
                                <h3 className="font-handwriting text-4xl text-slate-800 dark:text-slate-100 mb-2">Tributes</h3>
                                <div className="flex justify-center gap-4 text-sm text-slate-500">
                                    <button onClick={() => setActiveTab('tributes')} className="hover:text-primary underline">Read All</button>
                                    <span>&bull;</span>
                                    <button onClick={() => setActiveTab('tributes')} className="hover:text-primary underline">Share a Memory</button>
                                </div>
                            </div>
                            <TributeList tributes={memorial.tributes.slice(0, 3)} memorialId={memorial.id} />
                            {memorial.tributes.length > 3 && (
                                <div className="text-center mt-6">
                                    <button onClick={() => setActiveTab('tributes')} className="px-6 py-2 border border-slate-300 rounded-full text-slate-600 hover:bg-slate-50 transition-colors">
                                        View more tributes
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>
                )}



                {/* GALLERY TAB */}
                {activeTab === 'gallery' && (
                    <div className="animate-fade-in">
                        <h2 className="font-handwriting text-5xl mb-8 text-center text-slate-800 dark:text-slate-100 rotate-random-1">Cherished Memories</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {memorial.gallery.map((item) => (
                                <div key={item.id} className="break-inside-avoid mb-6">
                                    {renderGalleryItem(item)}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TRIBUTES TAB */}
                {activeTab === 'tributes' && (
                    <div className="animate-fade-in space-y-10 max-w-4xl mx-auto">
                        <div className="bg-primary/5 dark:bg-slate-800/50 p-8 rounded-3xl border border-primary/10 text-center flex flex-col items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined text-3xl text-primary">edit</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-2xl mb-1">Have a story to tell?</h3>
                                <p className="text-slate-500 dark:text-slate-400">Share your favorite memory of {memorial.firstName} to help keep their spirit alive.</p>
                            </div>
                            {/* Form Component would go here, unwrapped for brevity or reused */}
                            <div className="w-full text-left">
                                <TributeForm memorialId={memorial.id} fullName={fullName} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="font-handwriting text-4xl text-center mb-6">Tributes & Condolences</h3>
                            <TributeList tributes={memorial.tributes} memorialId={memorial.id} />
                        </div>
                    </div>
                )}

                {/* EVENTS TAB */}
                {activeTab === 'events' && (
                    <div className="animate-fade-in text-center py-20 text-slate-500">
                        <span className="material-symbols-outlined text-6xl mb-4 text-slate-300">event_busy</span>
                        <p className="text-xl">No upcoming events scheduled.</p>
                    </div>
                )}

                {/* SUPPORT TAB */}
                {activeTab === 'support' && memorial.donationInfo?.isEnabled && (
                    <div className="animate-fade-in max-w-4xl mx-auto">
                        <div className="bg-white dark:bg-paper-dark p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800">
                            <DonationModule memorial={memorial} />
                        </div>
                    </div>
                )}

            </div>


        </div >
    );
};

export default PersonalTouchLayout;
