import React, { useState } from 'react';
import { Memorial } from '../../types';
import TributeForm from '../TributeForm';
import TributeList from '../TributeList';
import { renderGalleryItem } from '../GalleryHelpers';
import DonationModule from '../DonationModule';
import { useAuth } from '../../hooks/useAuth';

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
    const { currentUser } = useAuth();

    // Custom styles from the snippet
    const customStyles = `
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .fade-in-section {
            opacity: 1;
            transform: translateY(0);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
            animation: fadeIn 0.8s ease-out;
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#0d121b] dark:text-white overflow-x-hidden antialiased selection:bg-primary/20 min-h-screen">
            <style>{customStyles}</style>

            <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 lg:px-12 backdrop-blur-md bg-white/90 dark:bg-background-dark/90 transition-colors border-b border-gray-100 dark:border-white/5">
                <a className="flex items-center justify-center p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors group" href="/">
                    <span className="material-symbols-outlined text-2xl text-[#0d121b] dark:text-white/80 group-hover:text-primary transition-colors">arrow_back</span>
                </a>
                <div className="flex items-center gap-6">
                    {!currentUser && (
                        <button className="text-xs font-semibold tracking-widest text-[#0d121b] dark:text-white/80 hover:text-primary transition-colors uppercase">
                            Login
                        </button>
                    )}
                    <button className="flex items-center justify-center h-10 px-8 rounded-full bg-[#0d121b] dark:bg-white hover:bg-primary dark:hover:bg-primary text-white dark:text-[#0d121b] dark:hover:text-white text-xs font-bold tracking-widest transition-all uppercase">
                        Share
                    </button>
                </div>
            </header>

            <main className="flex flex-col items-center w-full min-h-screen pt-20 pb-32">
                <section className="w-full max-w-5xl px-6 flex flex-col items-center justify-center text-center mt-8 mb-12 fade-in-section">
                    <div className="relative w-64 h-64 mb-12 group cursor-default">
                        <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl scale-110 group-hover:scale-125 transition-transform duration-1000"></div>
                        <div className="relative w-full h-full rounded-full overflow-hidden ring-1 ring-black/5 dark:ring-white/10" style={{ backgroundImage: `url('${memorial.profileImage?.url || 'https://via.placeholder.com/300'}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-extralight tracking-tight text-[#0d121b] dark:text-white mb-6 leading-[1.1]">
                        {memorial.firstName} <span className="font-extralight">{memorial.lastName}</span>
                    </h1>
                    <div className="flex items-center gap-6 text-sm md:text-base text-gray-400 dark:text-gray-500 font-medium tracking-[0.2em] uppercase mb-10">
                        <span>{formatDate(memorial.birthDate)}</span>
                        <span className="w-12 h-[1px] bg-gray-200 dark:bg-gray-800"></span>
                        <span>{formatDate(memorial.deathDate)}</span>
                    </div>
                    <p className="text-xl md:text-3xl font-light text-[#0d121b]/70 dark:text-white/70 italic max-w-2xl leading-relaxed">
                        "{memorial.aiHighlights && memorial.aiHighlights.length > 0 ? memorial.aiHighlights[0] : "Beloved soul, visionary spirit, and a gentle heart who painted the world with kindness."}"
                    </p>
                </section>

                <section className="w-full border-y border-gray-100 dark:border-white/5 mb-16 bg-surface-light/50 dark:bg-white/[0.02]">
                    <div className="max-w-7xl mx-auto px-6">
                        <nav className="flex items-center justify-center gap-10 md:gap-24 overflow-x-auto no-scrollbar py-6">
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
                                    className={`font-medium text-xs uppercase tracking-[0.2em] relative group transition-colors whitespace-nowrap ${activeTab === tab.id ? 'text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-[#0d121b] dark:hover:text-white'}`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"></span>}
                                </button>
                            ))}
                        </nav>
                    </div>
                </section>

                {activeTab === 'story' && (
                    <>
                        <section className="w-full max-w-7xl px-4 md:px-8 mb-40 fade-in-section">
                            {memorial.gallery.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[500px] md:h-[700px]">
                                    <div className="md:col-span-8 h-full overflow-hidden relative group">
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700 z-10"></div>
                                        {/* Wrappers to control image styles if renderGalleryItem doesn't accept class */}
                                        <div className="w-full h-full [&>img]:object-cover [&>img]:w-full [&>img]:h-full [&>img]:grayscale-[20%] group-hover:[&>img]:grayscale-0 [&>img]:transition-all [&>img]:duration-1000">
                                            {renderGalleryItem(memorial.gallery[0])}
                                        </div>
                                    </div>
                                    <div className="md:col-span-4 flex flex-col gap-6 h-full">
                                        {memorial.gallery.slice(1, 3).map((item, idx) => (
                                            <div key={idx} className="h-1/2 overflow-hidden relative group">
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-700 z-10"></div>
                                                <div className="w-full h-full [&>img]:object-cover [&>img]:w-full [&>img]:h-full [&>img]:grayscale-[20%] group-hover:[&>img]:grayscale-0 [&>img]:transition-all [&>img]:duration-1000">
                                                    {renderGalleryItem(item)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full h-64 bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-400 font-light">
                                    No gallery images available
                                </div>
                            )}
                        </section>

                        <div className="w-16 h-[1px] bg-gray-200 dark:bg-white/10 mb-32 mx-auto"></div>

                        <section className="w-full max-w-3xl px-8 mb-40 fade-in-section">
                            <div className="flex flex-col gap-12">
                                <div className="flex flex-col items-center text-center gap-4">
                                    <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">Biography</span>
                                    <h3 className="text-4xl font-light text-[#0d121b] dark:text-white">Her Story</h3>
                                </div>
                                <div className="prose prose-xl dark:prose-invert prose-p:font-light prose-p:leading-10 prose-p:text-gray-600 dark:prose-p:text-gray-300 text-justify">
                                    <p className="first-letter:text-6xl first-letter:font-thin first-letter:text-[#0d121b] dark:first-letter:text-white first-letter:float-left first-letter:mr-4 first-letter:mt-[-12px]">
                                        <span dangerouslySetInnerHTML={{ __html: memorial.biography }} />
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="w-full max-w-6xl px-8 mb-24 fade-in-section">
                            <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-6 border-b border-gray-100 dark:border-white/5 pb-6">
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-bold tracking-[0.3em] uppercase text-primary">Memories</span>
                                    <h3 className="text-3xl font-light text-[#0d121b] dark:text-white">Tributes</h3>
                                </div>
                                <span className="text-xs text-gray-400 font-mono tracking-wider mb-2">{memorial.tributes.length > 0 ? `3 OF ${memorial.tributes.length} POSTS` : '0 POSTS'}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                                {memorial.tributes.slice(0, 3).map((tribute) => (
                                    <div key={tribute.id} className="flex flex-col gap-6 p-10 bg-surface-light dark:bg-white/5 rounded-sm">
                                        <span className="material-symbols-outlined text-4xl text-primary/20">format_quote</span>
                                        <p className="text-lg text-gray-600 dark:text-gray-300 font-light leading-loose italic">"{tribute.content}"</p>
                                        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-white/5">
                                            <span className="block text-sm font-medium text-[#0d121b] dark:text-white uppercase tracking-wider">{tribute.author}</span>
                                            <span className="text-xs text-gray-400 uppercase tracking-widest mt-1">{formatFullDate(tribute.date)}</span>
                                        </div>
                                    </div>
                                ))}
                                {memorial.tributes.length === 0 && (
                                    <div className="col-span-full text-center text-gray-400 font-light">
                                        No tributes yet.
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-center mt-20">
                                <button
                                    onClick={() => setActiveTab('tributes')}
                                    className="px-8 py-4 border border-gray-200 dark:border-white/20 hover:border-[#0d121b] dark:hover:border-white text-xs font-bold uppercase tracking-[0.2em] transition-all"
                                >
                                    View All Tributes
                                </button>
                            </div>
                        </section>
                    </>
                )}

                {/* Other tabs support can be added similarly or reusing components */}
                {activeTab === 'gallery' && (
                    <section className="w-full max-w-7xl px-4 md:px-8 mb-40 fade-in-section">
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                            {memorial.gallery.map((item) => (
                                <div key={item.id} className="break-inside-avoid relative group rounded-lg overflow-hidden">
                                    <div className="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black/20 transition-opacity duration-300 z-10"></div>
                                    {renderGalleryItem(item)}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === 'tributes' && (
                    <section className="w-full max-w-4xl px-6 mb-40 fade-in-section">
                        <div className="flex flex-col items-center mb-16">
                            <h3 className="text-3xl font-light text-[#0d121b] dark:text-white mb-8">All Tributes</h3>
                            <TributeForm memorialId={memorial.id} fullName={fullName} />
                        </div>
                        <div className="grid gap-8">
                            <div className="grid gap-8">
                                <TributeList tributes={memorial.tributes} memorialId={memorial.id} />
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'events' && (
                    <section className="w-full max-w-3xl px-6 mb-40 fade-in-section text-center">
                        <h3 className="text-3xl font-light text-[#0d121b] dark:text-white mb-12">Events</h3>
                        <div className="text-center py-20 text-gray-400">
                            <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                            <p>No upcoming events scheduled.</p>
                        </div>
                    </section>
                )}

                {activeTab === 'support' && memorial.donationInfo?.isEnabled && (
                    <section className="w-full max-w-4xl px-6 mb-40 fade-in-section">
                        <h3 className="text-3xl font-light text-[#0d121b] dark:text-white text-center mb-12">Support</h3>
                        <DonationModule memorial={memorial} />
                    </section>
                )}
            </main>
        </div>
    );
};

export default UltraMinimalLayout;
