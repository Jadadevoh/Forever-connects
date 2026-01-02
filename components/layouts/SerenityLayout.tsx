import React, { useEffect, useState } from 'react';
import { Memorial } from '../../types';
import { renderGalleryItem } from '../GalleryHelpers';
import DonationModule from '../DonationModule';

interface SerenityLayoutProps {
    memorial: Memorial;
    fullName: string;
}

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const SerenityLayout: React.FC<SerenityLayoutProps> = ({ memorial, fullName }) => {
    const [reflection, setReflection] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'story' | 'gallery' | 'tributes' | 'events'>('story');
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    // Candle state removed

    useEffect(() => {
        // Use AI highlights if available
        if (memorial.aiHighlights && memorial.aiHighlights.length > 0) {
            setReflection(memorial.aiHighlights[0]);
        } else {
            setReflection(null);
        }
    }, [memorial]);

    return (
        <div className={`min-h-screen transition-colors duration-1000 bg-white text-gray-900 font-sans`}>
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

            <div className="flex flex-col lg:flex-row min-h-screen relative">

                {/* Left Sidebar - Profile (Sticky) */}
                <aside className="lg:w-[400px] lg:h-screen lg:sticky lg:top-0 bg-gray-50/50 border-r border-gray-100 flex flex-col items-center justify-center p-8 lg:p-12 z-10">
                    <div className="relative mb-10 group">
                        <div className={`absolute -inset-4 rounded-[40px] blur-3xl bg-blue-200/50 transition-opacity duration-1000 opacity-0`}></div>
                        <div className="relative h-64 w-64 md:h-72 md:w-72 overflow-hidden rounded-[40px] shadow-2xl transition-all duration-700 group-hover:scale-[1.02]">
                            <img
                                src={memorial.profileImage.url}
                                className={`h-full w-full object-cover transition-all duration-1000 grayscale-[0.2]`}
                                alt={fullName}
                            />
                        </div>
                    </div>

                    <h1 className="font-serif text-3xl md:text-4xl font-bold text-center mb-2 tracking-tight text-deep-navy">{fullName}</h1>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">
                        {new Date(memorial.birthDate).getFullYear()} — {new Date(memorial.deathDate).getFullYear()}
                    </p>

                    <div className="space-y-3 w-full max-w-[280px]">
                        {/* Candle Removed */}
                        {/* <button className="w-full py-4 rounded-2xl bg-gray-900 text-white hover:bg-gray-800 transition-all flex items-center justify-center gap-3 font-semibold text-sm shadow-xl shadow-gray-200">
                             <span className="material-symbols-outlined text-sm">edit</span>
                             Share Memory
                         </button> */}
                        {/* Share Memory typically triggers the tab or modal. I'll link it to Tributes tab */}
                        <button
                            onClick={() => setActiveTab('tributes')}
                            className="w-full py-4 rounded-2xl bg-[var(--primary-color)] text-white hover:opacity-90 transition-all flex items-center justify-center gap-3 font-semibold text-sm shadow-xl shadow-gray-200"
                            style={{ backgroundColor: 'var(--primary-color)' }}
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                            Share Memory
                        </button>
                    </div>

                    <div className="mt-12 flex items-center gap-2 text-gray-400 font-medium text-xs">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {memorial.city}, {memorial.state}
                    </div>
                </aside>

                {/* Right Content Area - Scrolling */}
                <main className="lg:flex-1 p-6 md:p-12 lg:p-24 bg-white/50 backdrop-blur-sm">
                    {/* Modern Pill Navigation */}
                    <nav className="flex overflow-x-auto whitespace-nowrap no-scrollbar bg-gray-100/80 p-1.5 rounded-2xl mb-16 backdrop-blur-md sticky top-4 z-40 max-w-full">
                        {[
                            { id: 'story', label: 'Story' },
                            { id: 'gallery', label: 'Gallery' },
                            { id: 'tributes', label: 'Tributes' },
                            { id: 'events', label: 'Events' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-deep-navy shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <div className="max-w-3xl">
                        {activeTab === 'story' && (
                            <div className="space-y-16 animate-fade-in">
                                {/* Modern AI Reflection Card */}
                                {reflection && (
                                    <div className="relative rounded-3xl bg-slate-900 p-10 md:p-14 text-white shadow-2xl shadow-slate-200">
                                        <div className="absolute top-6 left-6 text-slate-700 opacity-50">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H14.017C13.4647 8 13.017 7.55228 13.017 7V5C13.017 4.44772 13.4647 4 14.017 4H21.017C21.5693 4 22.017 4.44772 22.017 5V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H3.017C2.46472 8 2.017 7.55228 2.017 7V5C2.017 4.44772 2.46472 4 3.017 4H10.017C10.5693 4 11.017 4.44772 11.017 5V15C11.017 18.3137 8.33072 21 5.017 21H3.017Z" /></svg>
                                        </div>
                                        <p className="font-serif text-3xl md:text-4xl italic leading-tight relative z-10 text-slate-50">
                                            {reflection}
                                        </p>
                                    </div>
                                )}

                                <section>
                                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 mb-8">The Story</h2>
                                    <div
                                        className="font-sans text-lg md:text-xl leading-relaxed text-gray-600 space-y-8"
                                        dangerouslySetInnerHTML={{ __html: memorial.biography }}
                                    />
                                </section>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 pt-12 border-t border-gray-100">
                                    <div>
                                        <h4 className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Born</h4>
                                        <p className="font-medium text-gray-900">{formatDate(memorial.birthDate)}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Departed</h4>
                                        <p className="font-medium text-gray-900">{formatDate(memorial.deathDate)}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Resting</h4>
                                        <p className="font-medium text-gray-900">{memorial.city}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Legacy</h4>
                                        <p className="font-medium text-gray-900">Never Forgotten</p>
                                    </div>
                                    {/* Cause of Death - Only shown if not private and exists */}
                                    {!memorial.isCauseOfDeathPrivate && memorial.causeOfDeath && memorial.causeOfDeath.length > 0 && (
                                        <div>
                                            <h4 className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Cause</h4>
                                            <p className="font-medium text-gray-900">{memorial.causeOfDeath.join(', ')}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="animate-fade-in">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {memorial.gallery.map(item => (
                                        <div key={item.id}>{renderGalleryItem(item)}</div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'tributes' && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="flex justify-between items-end border-b border-gray-100 pb-6">
                                    <h2 className="font-serif text-4xl font-bold text-gray-900 italic">Tributes</h2>
                                    {/* <button className="text-xs font-bold uppercase tracking-widest text-slate-600 hover:text-slate-900 px-6 py-2 bg-slate-50 rounded-full transition-colors">Write Message</button> */}
                                    {/* Tribute form is handled by MemorialPage wrapper usually, but this layout seems self-contained? 
                                        Actually, MemorialPage renders TributeForm if activeTab is tribute. 
                                        Here, SerenityLayout is handling its own structure. 
                                        I should just list them, and maybe rely on the wrapper or let the user know they can't post here directly yet?
                                        OR better: Render the TributeForm here if we can import it.
                                        For now, I'll match the snippet which just lists them.
                                    */}
                                </div>
                                <div className="grid gap-8">
                                    {memorial.tributes.map((tribute) => (
                                        <div key={tribute.id} className="group relative p-10 bg-white border border-gray-100 rounded-[32px] hover:shadow-2xl hover:shadow-gray-100 transition-all duration-500">
                                            <div className="flex items-center gap-4 mb-8">
                                                {/* <img src={tribute.avatarUrl} className="h-12 w-12 rounded-2xl grayscale transition-all group-hover:grayscale-0" alt="" /> */}
                                                <div className="h-12 w-12 rounded-2xl bg-gray-200 flex items-center justify-center font-bold text-gray-500">{tribute.author.charAt(0)}</div>
                                                <div>
                                                    <h4 className="font-bold text-sm tracking-tight text-gray-900">{tribute.author}</h4>
                                                    <p className="text-[10px] uppercase tracking-widest text-gray-400">{formatDate(tribute.date)}</p>
                                                </div>
                                            </div>
                                            <p className="font-sans text-lg text-gray-600 leading-relaxed italic">"{tribute.content}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'events' && (
                            <div className="text-center py-20 text-gray-400 animate-fade-in">
                                <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                                <p>No upcoming events scheduled.</p>
                            </div>
                        )}

                        {/* Modern Donation Section */}
                        {memorial.donationInfo?.isEnabled && (
                            <div className="mt-24 p-12 md:p-16 bg-deep-navy rounded-[40px] text-white relative overflow-hidden shadow-2xl shadow-gray-200">
                                <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/10 blur-[80px]"></div>
                                <div className="relative z-10 text-center">
                                    <h3 className="font-serif text-4xl mb-4 italic">The Legacy Fund</h3>
                                    <p className="text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed text-lg">
                                        Honoring {memorial.firstName}'s passion through the <strong>{memorial.donationInfo.description}</strong>.
                                    </p>

                                    <div className="max-w-md mx-auto mb-10">
                                        <div className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">
                                            <span>Goal ${memorial.donationInfo.goal}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setIsDonationModalOpen(true)}
                                        className="px-14 py-5 bg-white text-gray-900 font-bold uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-gray-100 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                                    >
                                        Make a Contribution
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <footer className="mt-24 pt-12 border-t border-gray-100 text-center">
                        <p className="font-serif text-2xl italic text-gray-400">"Architecture starts where engineering ends."</p>
                        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] font-bold text-gray-300">Memorial Powered by Forever Connects</p>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default SerenityLayout;
