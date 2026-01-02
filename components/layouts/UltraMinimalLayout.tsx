import React, { useState } from 'react';
import { Memorial } from '../../types';
import TributeForm from '../TributeForm';
import { renderGalleryItem } from '../GalleryHelpers';
import DonationModule from '../DonationModule';

interface UltraMinimalLayoutProps {
    memorial: Memorial;
    fullName: string;
}

const formatDate = (dateString: string) => {
    return new Date(dateString).getFullYear().toString();
};

const formatFullDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const UltraMinimalLayout: React.FC<UltraMinimalLayoutProps> = ({ memorial, fullName }) => {
    const [activeTab, setActiveTab] = useState<'story' | 'gallery' | 'tributes' | 'events' | 'support'>('story');

    // Hero Section Component (Always visible or part of Story? - Usually Hero is top, formatting suggests it's the header. Let's keep specific hero for Story tab or Global?)
    // In the inspiration, the Hero is the top. Then content follows.
    // I will put the Hero always at top, then tabs below it, or keep Hero in Story?
    // User inspiration is a single page. If I tab it, the Hero usually stays.
    // Let's keep the Header/Hero distinctive to this theme.
    // Actually, "Hero Section" in inspiration contains the Name and Portrait. That should probably be global.

    const renderHero = () => (
        <section className="w-full max-w-4xl px-6 flex flex-col items-center justify-center text-center mt-32 mb-16 animate-fade-in">
            <div className="relative w-48 h-48 mb-10 group cursor-default">
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl scale-90 group-hover:scale-105 transition-transform duration-700"></div>
                <div className="relative w-full h-full rounded-full overflow-hidden border border-white/20 dark:border-white/10 shadow-lg">
                    <img
                        src={memorial.profileImage?.url || 'https://via.placeholder.com/150'}
                        alt={fullName}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-light tracking-tight text-[#0d121b] dark:text-white mb-4 leading-[1.1]">
                {memorial.firstName} <span className="font-normal">{memorial.lastName}</span>
            </h1>
            <div className="flex items-center gap-3 text-lg md:text-xl text-gray-500 dark:text-gray-400 font-normal tracking-wider uppercase mb-6">
                <span>{formatDate(memorial.birthDate)}</span>
                <span className="w-8 h-[1px] bg-gray-300 dark:bg-gray-700"></span>
                <span>{formatDate(memorial.deathDate)}</span>
            </div>
            <p className="text-xl md:text-2xl font-light text-[#0d121b]/80 dark:text-white/80 italic max-w-lg leading-relaxed">
                "{memorial.aiHighlights && memorial.aiHighlights.length > 0 ? memorial.aiHighlights[0] : "Beloved soul, visionary spirit, and a gentle heart who painted the world with kindness."}"
            </p>
        </section>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-color)] dark:bg-background-dark font-display text-[#0d121b] dark:text-white overflow-x-hidden antialiased selection:bg-primary/20">
            {/* Minimal Header */}
            {/* <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 lg:px-12 backdrop-blur-sm bg-[var(--bg-color)]/80 dark:bg-background-dark/80 transition-colors">
                <div className="flex items-center gap-2">
                     <span className="text-sm font-bold tracking-widest uppercase text-primary">Memorial</span>
                </div>
            </header> */}
            {/* Navigation handled by parent usually, but consistent tabs need to be here */}

            <main className="flex flex-col items-center w-full min-h-screen pb-32">

                {renderHero()}

                {/* Minimal Tab Navigation */}
                <div className="sticky top-4 z-40 mb-16 bg-[var(--bg-color)]/80 backdrop-blur-md px-4 py-2 rounded-full border border-black/5 dark:border-white/5 shadow-sm max-w-[95vw]">
                    <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar whitespace-nowrap">
                        {[
                            { id: 'story', label: 'Story' },
                            { id: 'gallery', label: 'Gallery' },
                            { id: 'tributes', label: 'Tributes' },
                            { id: 'events', label: 'Events' },
                            ...(memorial.donationInfo?.isEnabled ? [{ id: 'support', label: 'Support' }] : [])
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeTab === tab.id
                                    ? 'bg-[#0d121b] text-white dark:bg-white dark:text-[#0d121b] shadow-md'
                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="w-full max-w-4xl px-6">

                    {activeTab === 'story' && (
                        <div className="animate-fade-in space-y-24">
                            {/* Biography */}
                            <section className="max-w-2xl mx-auto">
                                <h3 className="text-3xl font-light text-[#0d121b] dark:text-white text-center mb-8">Her Story</h3>
                                <div className="prose prose-lg dark:prose-invert prose-p:font-light prose-p:leading-8 prose-p:text-gray-600 dark:prose-p:text-gray-300 text-justify">
                                    <div dangerouslySetInnerHTML={{ __html: memorial.biography }} className="first-letter-drop-cap" />
                                </div>
                                <style>{`
                                    .first-letter-drop-cap > p:first-of-type::first-letter {
                                        font-size: 3rem;
                                        font-weight: 200;
                                        color: var(--primary-color);
                                        float: left;
                                        margin-right: 0.75rem;
                                        margin-top: -0.5rem;
                                        line-height: 1;
                                    }
                                `}</style>

                                {memorial.aiHighlights && memorial.aiHighlights.length > 1 && (
                                    <div className="mt-12 p-8 bg-white dark:bg-white/5 border-l-2 border-primary rounded-r-xl">
                                        <p className="text-xl font-light italic text-gray-600 dark:text-gray-300">
                                            "{memorial.aiHighlights[1]}"
                                        </p>
                                    </div>
                                )}
                            </section>

                            {/* Legacy Fund / Donation (Minimal style) */}
                            {memorial.donationInfo?.isEnabled && (
                                <section className="max-w-xl mx-auto text-center border-t border-gray-100 dark:border-gray-800 pt-16">
                                    <span className="material-symbols-outlined text-4xl text-primary mb-4 font-light">volunteer_activism</span>
                                    <h4 className="text-2xl font-light mb-2">Legacy Fund</h4>
                                    <p className="text-gray-500 mb-8 font-light">{memorial.donationInfo.description}</p>
                                    <button
                                        onClick={() => setActiveTab('support')}
                                        className="px-8 py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300 text-sm font-bold uppercase tracking-widest"
                                    >
                                        Donate Now
                                    </button>
                                </section>
                            )}
                        </div>
                    )}

                    {activeTab === 'gallery' && (
                        <div className="animate-fade-in">
                            <h3 className="text-3xl font-light text-[#0d121b] dark:text-white text-center mb-12">Visual Memories</h3>
                            {memorial.gallery.length > 0 ? (
                                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                                    {memorial.gallery.map((item) => (
                                        <div key={item.id} className="break-inside-avoid relative group rounded-lg overflow-hidden">
                                            <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black/20 transition-opacity duration-300 z-10"></div>
                                            {renderGalleryItem(item)}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-gray-400 font-light">No photos shared yet.</p>
                            )}
                        </div>
                    )}

                    {activeTab === 'tributes' && (
                        <div className="animate-fade-in max-w-2xl mx-auto">
                            <div className="flex items-center justify-between mb-10 border-b border-gray-100 dark:border-gray-800 pb-4">
                                <h3 className="text-2xl font-light text-[#0d121b] dark:text-white">Tributes</h3>
                                <span className="text-sm text-gray-400">Total {memorial.tributes.length}</span>
                            </div>

                            <div className="grid gap-6">
                                {memorial.tributes.map((tribute) => (
                                    <div key={tribute.id} className="bg-white dark:bg-white/5 p-8 rounded-lg shadow-sm border border-gray-100 dark:border-white/5 hover:border-primary/20 transition-colors group">
                                        <p className="text-gray-600 dark:text-gray-300 font-light leading-relaxed mb-6 italic group-hover:text-gray-900 dark:group-hover:text-white transition-colors">"{tribute.content}"</p>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-[#0d121b] dark:text-white">{tribute.author}</span>
                                            <span className="text-xs text-gray-400 uppercase tracking-wide mt-1">{formatFullDate(tribute.date)}</span>
                                        </div>
                                    </div>
                                ))}
                                {memorial.tributes.length === 0 && (
                                    <div className="text-center py-12 bg-gray-50 dark:bg-white/5 rounded-lg border border-dashed border-gray-200">
                                        <p className="text-gray-400 font-light">No tributes yet. Be the first to share.</p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-16 pt-10 border-t border-gray-100 dark:border-gray-800">
                                <h4 className="text-xl font-light text-center mb-8">Share a Memory</h4>
                                <TributeForm memorialId={memorial.id} fullName={fullName} />
                            </div>
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className="animate-fade-in max-w-2xl mx-auto">
                            <h3 className="text-2xl font-light text-[#0d121b] dark:text-white text-center mb-12">Milestones & Events</h3>
                            <div className="relative border-l border-gray-200 dark:border-gray-800 ml-6 md:ml-12 space-y-16 py-4">
                                {/* Currently using static milestones as inspiration requested, but likely should map to events if they existed. 
                                    Since the 'events' in data are usually empty, I will show the Placeholder OR map Born/Death/Resting Place as milestones if possible.
                                    Let's map the actual timeline data we have: Birth, Death.
                                */}

                                {/* Birth */}
                                <div className="relative pl-8 md:pl-12 group">
                                    <div className="absolute -left-[5px] top-2 w-[10px] h-[10px] rounded-full bg-white dark:bg-background-dark border-2 border-primary transition-colors group-hover:bg-primary"></div>
                                    <span className="block text-sm font-bold tracking-widest text-primary mb-1 uppercase">{formatDate(memorial.birthDate)}</span>
                                    <h4 className="text-lg font-medium text-[#0d121b] dark:text-white">Born</h4>
                                    <p className="text-gray-500 dark:text-gray-400 font-light mt-1">A beautiful journey began.</p>
                                </div>

                                {/* Life/Events could go here if we had an array of life events */}

                                {/* Death */}
                                <div className="relative pl-8 md:pl-12 group">
                                    <div className="absolute -left-[5px] top-2 w-[10px] h-[10px] rounded-full bg-gray-300 dark:bg-gray-600 transition-colors group-hover:bg-primary"></div>
                                    <span className="block text-sm font-bold tracking-widest text-gray-400 dark:text-gray-500 mb-1 uppercase group-hover:text-primary transition-colors">{formatDate(memorial.deathDate)}</span>
                                    <h4 className="text-lg font-medium text-[#0d121b] dark:text-white">Rest in Peace</h4>
                                    <p className="text-gray-500 dark:text-gray-400 font-light mt-1">
                                        Passed away peacefully
                                        {!memorial.isCauseOfDeathPrivate && memorial.causeOfDeath && memorial.causeOfDeath.length > 0 && (
                                            <span> due to {memorial.causeOfDeath.join(', ')}</span>
                                        )}
                                        . Resting at {memorial.city}.
                                    </p>
                                </div>

                                {/* Upcoming Events Placeholder */}
                                <div className="relative pl-8 md:pl-12 group">
                                    <div className="absolute -left-[5px] top-2 w-[10px] h-[10px] rounded-full bg-gray-200 dark:bg-gray-700 transition-colors"></div>
                                    <h4 className="text-lg font-medium text-gray-400 dark:text-gray-600">Upcoming Events</h4>
                                    <p className="text-gray-500 dark:text-gray-500 font-light mt-1 text-sm italic">No upcoming events scheduled.</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'support' && memorial.donationInfo?.isEnabled && (
                        <div className="animate-fade-in max-w-xl mx-auto">
                            <h3 className="text-3xl font-light text-[#0d121b] dark:text-white text-center mb-12">Support the Family</h3>
                            <div className="bg-white dark:bg-white/5 p-8 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm">
                                <DonationModule memorial={memorial} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UltraMinimalLayout;
