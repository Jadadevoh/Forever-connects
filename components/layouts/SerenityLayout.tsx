import React, { useState } from 'react';
import { Memorial } from '../../types';
import { renderGalleryItem } from '../GalleryHelpers';
import DonationModule from '../DonationModule';
import TributeForm from '../TributeForm';
import TributeList from '../TributeList';

interface SerenityLayoutProps {
    memorial: Memorial;
    fullName: string;
}

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const SerenityLayout: React.FC<SerenityLayoutProps> = ({ memorial, fullName }) => {
    const [activeTab, setActiveTab] = useState<'story' | 'gallery' | 'tributes' | 'events' | 'support'>('story');
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);

    return (
        <div className={`min-h-screen transition-colors duration-1000 bg-[#FAFAF9] text-stone-800 font-sans selection:bg-stone-200`}>
            {/* Donation Modal */}
            {isDonationModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md animate-fade-in" onClick={() => setIsDonationModalOpen(false)}>
                    <div className="bg-[#FAFAF9] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-2xl shadow-stone-200 animate-scale-up border border-stone-100" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setIsDonationModalOpen(false)}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 transition-colors z-10 text-stone-500"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <div className="p-8 pt-12">
                            <DonationModule memorial={memorial} />
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col lg:flex-row min-h-screen relative">

                {/* Left Sidebar - Profile (Sticky) */}
                <aside className="lg:w-[450px] lg:h-screen lg:sticky lg:top-0 bg-[#F5F5F4] border-r border-stone-200/50 flex flex-col items-center justify-center p-8 lg:p-12 z-10 relative overflow-hidden">
                    {/* Organic Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-stone-100 to-transparent opacity-50"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-green-100/30 rounded-full blur-3xl"></div>

                    <div className="relative mb-12 group z-10">
                        <div className="absolute -inset-4 rounded-full blur-2xl bg-stone-200/60 transition-opacity duration-1000 opacity-70"></div>
                        <div className="relative h-64 w-64 md:h-72 md:w-72 overflow-hidden rounded-full border-4 border-white shadow-xl transition-all duration-700 group-hover:scale-[1.01]">
                            <img
                                src={memorial.profileImage.url}
                                className="h-full w-full object-cover transition-all duration-1000 opacity-95 group-hover:opacity-100"
                                alt={fullName}
                            />
                        </div>
                    </div>

                    <h1 className="font-display text-4xl md:text-5xl font-medium text-center mb-3 tracking-tight text-stone-800 italic">{fullName}</h1>

                    <div className="flex items-center justify-center gap-2 mb-6 text-stone-500 font-medium text-xs tracking-widest uppercase">
                        <span className="material-symbols-outlined text-sm opacity-70">spa</span>
                        {memorial.city}, {memorial.state}
                    </div>

                    <p className="font-display text-lg text-stone-600 mb-10 italic">
                        {new Date(memorial.birthDate).getFullYear()} — {new Date(memorial.deathDate).getFullYear()}
                    </p>

                    <div className="w-full max-w-[280px] space-y-8 mb-10 text-center">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm">
                            <div>
                                <h4 className="font-bold text-[10px] uppercase tracking-widest text-stone-400 mb-1">Born</h4>
                                <p className="font-serif text-stone-700">{formatDate(memorial.birthDate)}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-[10px] uppercase tracking-widest text-stone-400 mb-1">Departed</h4>
                                <p className="font-serif text-stone-700">{formatDate(memorial.deathDate)}</p>
                            </div>
                        </div>
                        {memorial.restingPlace && (
                            <div>
                                <h4 className="font-bold text-[10px] uppercase tracking-widest text-stone-400 mb-1">Resting Place</h4>
                                <p className="font-serif text-stone-700">{memorial.restingPlace}</p>
                            </div>
                        )}
                        {!memorial.isCauseOfDeathPrivate && memorial.causeOfDeath && memorial.causeOfDeath.length > 0 && (
                            <div>
                                <h4 className="font-bold text-[10px] uppercase tracking-widest text-stone-400 mb-1">Cause</h4>
                                <p className="font-serif text-stone-700">{memorial.causeOfDeath.join(', ')}</p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-3 w-full max-w-[280px]">
                        <button
                            onClick={() => setActiveTab('tributes')}
                            className="w-full py-4 rounded-full bg-stone-800 text-[#FAFAF9] hover:bg-stone-700 transition-all flex items-center justify-center gap-3 font-medium text-sm shadow-lg shadow-stone-200 tracking-wide"
                        >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            Share a Memory
                        </button>
                    </div>
                </aside>

                {/* Right Content Area */}
                <main className="lg:flex-1 p-6 md:p-16 lg:p-24 bg-[#FAFAF9]">
                    {/* Serene Navigation - Understated */}
                    <nav className="flex items-center justify-center lg:justify-start overflow-x-auto whitespace-nowrap no-scrollbar mb-20 gap-8 border-b border-stone-200 pb-1">
                        {[
                            { id: 'story', label: 'Life Story' },
                            { id: 'gallery', label: 'Gallery' },
                            { id: 'tributes', label: 'Tributes' },
                            { id: 'events', label: 'Events' },
                            ...(memorial.donationInfo?.isEnabled ? [{ id: 'support', label: 'Legacy Fund' }] : [])
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`pb-4 text-sm uppercase tracking-widest font-medium transition-all relative ${activeTab === tab.id
                                    ? 'text-stone-800'
                                    : 'text-stone-400 hover:text-stone-600'
                                    }`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-stone-800"></span>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="max-w-3xl mx-auto lg:mx-0">
                        {activeTab === 'story' && (
                            <div className="space-y-20 animate-fade-in">
                                <section>
                                    <div className="flex items-center gap-4 mb-10">
                                        <span className="h-[1px] w-12 bg-stone-300"></span>
                                        <h2 className="font-display text-2xl italic text-stone-800">In Loving Memory</h2>
                                    </div>
                                    <div
                                        className="font-serif text-lg md:text-xl leading-loose text-stone-600 space-y-8 first-letter:text-5xl first-letter:font-display first-letter:mr-1 first-letter:float-left first-letter:text-stone-800"
                                        dangerouslySetInnerHTML={{ __html: memorial.biography }}
                                    />
                                </section>

                                {/* Highlights - Softer Card */}
                                {memorial.aiHighlights && memorial.aiHighlights.length > 0 && (
                                    <div className="space-y-8">
                                        {memorial.aiHighlights.slice(0, 2).map((highlight, idx) => (
                                            <div key={idx} className="relative p-12 bg-stone-100 rounded-[2rem] border border-stone-200/50">
                                                <span className="absolute top-8 left-8 text-6xl font-display text-stone-300 opacity-50">"</span>
                                                <p className="font-display text-2xl md:text-3xl italic leading-relaxed text-stone-700 relative z-10 text-center">
                                                    {highlight}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Gallery Preview - Masonry-ish feel */}
                                {memorial.gallery && memorial.gallery.length > 0 && (
                                    <section>
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="font-display text-2xl italic text-stone-800">Cherished Moments</h2>
                                            <button
                                                onClick={() => setActiveTab('gallery')}
                                                className="text-xs uppercase tracking-widest text-stone-500 hover:text-stone-800 transition-colors"
                                            >
                                                View All
                                            </button>
                                        </div>
                                        <div className="columns-2 md:columns-3 gap-4 space-y-4">
                                            {memorial.gallery.slice(0, 6).map(item => (
                                                <div key={item.id} className="break-inside-avoid rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-500">
                                                    {renderGalleryItem(item)}
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                )}

                                {/* Serene Donation Card */}
                                {memorial.donationInfo?.isEnabled && (
                                    <div className="mt-16 p-10 bg-[#F0F2F0] rounded-3xl border border-stone-100 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div>
                                            <h3 className="font-display text-2xl text-stone-800 mb-2 italic">Honoring a Legacy</h3>
                                            <p className="text-stone-500 text-sm max-w-sm leading-relaxed">
                                                Support {memorial.firstName}'s memory through a contribution to the family.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setIsDonationModalOpen(true)}
                                            className="px-8 py-3 bg-white border border-stone-200 text-stone-800 font-medium uppercase tracking-widest text-xs rounded-full hover:bg-stone-50 transition-all shadow-sm hover:shadow-md"
                                        >
                                            Make a Donation
                                        </button>
                                    </div>
                                )}

                                <div className="mt-20 border-t border-stone-200 pt-16">
                                    <h3 className="font-display text-3xl mb-10 text-center text-stone-800 italic">Tributes & Condolences</h3>
                                    <TributeList tributes={memorial.tributes} memorialId={memorial.id} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="animate-fade-in">
                                <div className="columns-1 sm:columns-2 gap-6 space-y-6">
                                    {memorial.gallery.map(item => (
                                        <div key={item.id} className="break-inside-avoid rounded-2xl overflow-hidden shadow-stone-200 shadow-lg">
                                            {renderGalleryItem(item)}
                                            {item.caption && (
                                                <p className="p-4 bg-white text-sm text-stone-600 text-center font-serif italic border-t border-stone-50">{item.caption}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'tributes' && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="flex justify-between items-end border-b border-stone-200 pb-6 mb-8">
                                    <h2 className="font-display text-4xl text-stone-800 italic">Tributes</h2>
                                </div>

                                <div className="bg-stone-50 p-8 rounded-3xl border border-stone-100">
                                    <TributeForm memorialId={memorial.id} fullName={fullName} onSuccess={() => { }} />
                                </div>

                                <div className="grid gap-10 mt-12">
                                    {memorial.tributes.map((tribute) => (
                                        <div key={tribute.id} className="relative pl-8 border-l-2 border-stone-200">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="h-10 w-10 rounded-full bg-stone-200 flex items-center justify-center font-serif font-bold text-stone-600 text-lg">
                                                    {tribute.author.charAt(0)}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-sm tracking-wide text-stone-900 uppercase">{tribute.author}</h4>
                                                    <p className="text-xs text-stone-400 font-serif">{formatDate(tribute.date)}</p>
                                                </div>
                                            </div>
                                            <p className="font-serif text-lg text-stone-600 leading-relaxed italic">"{tribute.content}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'events' && (
                            <div className="text-center py-24 text-stone-300 animate-fade-in border-2 border-dashed border-stone-200 rounded-3xl">
                                <span className="material-symbols-outlined text-5xl mb-4 font-light">event_upcoming</span>
                                <p className="font-serif text-lg text-stone-400">No events currently scheduled.</p>
                            </div>
                        )}

                        {activeTab === 'support' && (
                            <div className="animate-fade-in">
                                <div className="flex justify-between items-end border-b border-stone-200 pb-6 mb-8">
                                    <h2 className="font-display text-4xl text-stone-800 italic">Support</h2>
                                </div>
                                <DonationModule memorial={memorial} />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SerenityLayout;
