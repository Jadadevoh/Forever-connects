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
    const [activeTab, setActiveTab] = useState<'story' | 'gallery' | 'tributes' | 'events'>('story');
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
                    <div className="absolute top-10 right-0 w-[35%] aspect-video bg-slate-200 dark:bg-slate-700 rounded-xl shadow-md z-10 overflow-hidden border-4 border-white dark:border-slate-800 rotate-6 hover:rotate-2 transition-transform duration-500 opacity-90">
                        {memorial.gallery && memorial.gallery.length > 1 ? (
                            <img src={memorial.gallery[1].url} className="w-full h-full object-cover" alt="Memory" />
                        ) : (
                            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-primary/40">landscape</span>
                            </div>
                        )}
                    </div>

                    {/* Decorative Element */}
                    <div className="absolute -bottom-6 right-10 z-0 opacity-20 dark:opacity-10 pointer-events-none">
                        <span className="material-symbols-outlined text-[120px] text-primary rotate-12">history_edu</span>
                    </div>
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
                            { id: 'events', icon: 'event', label: 'Events' }
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
                        <section className="w-full">
                            <div className="bg-white dark:bg-paper-dark p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 text-center">
                                <h3 className="font-handwriting text-4xl mb-6 text-slate-800 dark:text-slate-100 -rotate-1">Things {memorial.firstName} Loved</h3>
                                <div className="flex flex-wrap justify-center gap-3">
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm font-bold">
                                        <span className="material-symbols-outlined text-lg">favorite</span> Family
                                    </span>
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 text-sm font-bold">
                                        <span className="material-symbols-outlined text-lg">group</span> Friends
                                    </span>
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-bold">
                                        <span className="material-symbols-outlined text-lg">nature</span> Nature
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* Moments Preview */}
                        <section className="w-full">
                            <div className="bg-background-light dark:bg-background-dark p-8 rounded-3xl">
                                <div className="flex flex-col gap-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold text-2xl flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">photo_album</span>
                                            Moments to Remember
                                        </h3>
                                        <button onClick={() => setActiveTab('gallery')} className="text-primary font-bold text-sm hover:underline">View All Photos</button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {memorial.gallery.slice(0, 4).map((item) => (
                                            <div key={item.id} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative">
                                                {item.type === 'image' ? (
                                                    <div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${item.url})` }}></div>
                                                ) : (
                                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                                                        <span className="material-symbols-outlined">play_circle</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                        <div onClick={() => setActiveTab('gallery')} className="aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                            <span className="material-symbols-outlined text-4xl text-slate-400">add_a_photo</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Map / Location */}
                        <div className="max-w-3xl mx-auto w-full">
                            <div className="bg-white dark:bg-paper-dark p-2 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
                                <div className="rounded-2xl overflow-hidden h-48 w-full relative group bg-slate-100">
                                    {/* Placeholder Map Image */}
                                    <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://maps.googleapis.com/maps/api/staticmap?center=Vermont&zoom=10&size=600x300&sensor=false)' }}></div>
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur text-slate-900 px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                                            <span className="material-symbols-outlined text-red-500">location_on</span>
                                            <span className="font-bold text-sm">{memorial.city}, {memorial.state}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-4 grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Resting Place</h4>
                                        <p className="text-sm text-slate-500">{memorial.restingPlace || 'Private'}</p>
                                    </div>
                                    {/* Cause of Death */}
                                    {!memorial.isCauseOfDeathPrivate && memorial.causeOfDeath && memorial.causeOfDeath.length > 0 && (
                                        <div>
                                            <h4 className="font-bold text-lg mb-1">Cause of Passing</h4>
                                            <p className="text-sm text-slate-500">{memorial.causeOfDeath.join(', ')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Donation Widget */}
                        {memorial.donationInfo?.isEnabled && (
                            <div className="bg-gradient-to-br from-primary to-blue-600 p-8 rounded-3xl shadow-lg text-white text-center relative overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                                <span className="material-symbols-outlined text-5xl mb-4 relative z-10">volunteer_activism</span>
                                <h3 className="font-handwriting text-4xl mb-4 relative z-10">Legacy Fund</h3>
                                <p className="text-blue-100 text-lg mb-8 relative z-10 max-w-xl mx-auto">{memorial.donationInfo.description}</p>
                                <button
                                    onClick={() => setIsDonationModalOpen(true)}
                                    className="bg-white text-primary font-bold px-10 py-3 rounded-full hover:bg-blue-50 transition-colors shadow-md relative z-10 text-lg"
                                >
                                    Support Family
                                </button>
                            </div>
                        )}
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

            </div>

            <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-12 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-slate-400">favorite</span>
                        <p className="text-sm text-slate-500 font-medium">© 2024 Forever Loved. All rights reserved.</p>
                    </div>
                    <div className="flex gap-6">
                        <a className="text-sm text-slate-500 hover:text-primary" href="#">Privacy</a>
                        <a className="text-sm text-slate-500 hover:text-primary" href="#">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PersonalTouchLayout;
