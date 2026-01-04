import React, { useState, useEffect } from 'react';
import { Memorial } from '../../types';
import DonationModule from '../DonationModule';
import TributeForm from '../TributeForm';
import TributeList from '../TributeList';

interface ModernMinimalLayoutProps {
    memorial: Memorial;
    fullName: string;
}

const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const ModernMinimalLayout: React.FC<ModernMinimalLayoutProps> = ({ memorial, fullName }) => {
    const [reflection, setReflection] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'story' | 'gallery' | 'tributes' | 'events'>('story');
    const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
    const [showTributeForm, setShowTributeForm] = useState(false);

    useEffect(() => {
        // If AI highlights exist, use the first one as a hero reflection
        if (memorial.aiHighlights && memorial.aiHighlights.length > 0) {
            setReflection(memorial.aiHighlights[0]);
        } else {
            setReflection(null);
        }
    }, [memorial]);

    const locationString = [memorial.city, memorial.state].filter(Boolean).join(', ');

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

            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Left Sidebar */}
                <aside className="lg:w-[400px] lg:h-screen lg:sticky lg:top-0 bg-gray-50/50 border-r border-gray-100 flex flex-col items-center justify-center p-8 lg:p-12 z-10">
                    <div className="relative mb-10 group">
                        <div className={`absolute -inset-4 rounded-[40px] blur-3xl bg-orange-200 transition-opacity duration-1000 opacity-0`}></div>
                        <div className="relative h-64 w-64 md:h-72 md:w-72 overflow-hidden rounded-[40px] shadow-2xl transition-all duration-700 group-hover:scale-[1.02]">
                            <img
                                src={memorial.profileImage.url}
                                className={`h-full w-full object-cover transition-all duration-1000 grayscale-[0.2]`}
                                alt={fullName}
                            />
                        </div>
                    </div>


                    <h1 className="font-serif text-3xl font-bold text-center mb-2 tracking-tight">{fullName}</h1>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">
                        {new Date(memorial.birthDate).getFullYear()} — {new Date(memorial.deathDate).getFullYear()}
                    </p>



                    <div className="mt-12 flex items-center gap-2 text-gray-400 font-medium text-xs">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {locationString}
                    </div>
                </aside>

                {/* Right Content Area */}
                <main className="lg:flex-1 p-6 md:p-12 lg:py-12 lg:px-24 bg-white/50 backdrop-blur-sm">
                    {/* Navigation */}
                    <nav className="flex overflow-x-auto whitespace-nowrap no-scrollbar bg-gray-100/80 p-1.5 rounded-2xl mb-16 backdrop-blur-md max-w-full">
                        {[
                            { id: 'story', label: 'Story' },
                            { id: 'gallery', label: 'Gallery' },
                            { id: 'tributes', label: 'Tributes' },
                            { id: 'events', label: 'Events' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-8 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>

                    <div className="max-w-3xl">
                        {activeTab === 'story' && (
                            <div className="space-y-16 animate-fade-in">
                                {reflection && (
                                    <div className="relative rounded-3xl bg-deep-navy p-10 md:p-14 text-white shadow-2xl shadow-slate-200">
                                        <div className="absolute top-6 left-8 text-6xl text-slate-700 font-serif opacity-50">“</div>
                                        <p className="font-serif text-2xl md:text-3xl italic leading-tight relative z-10 text-slate-50 text-center">
                                            {reflection}
                                        </p>
                                        <div className="absolute bottom-6 right-8 text-6xl text-slate-700 font-serif opacity-50 rotate-180">“</div>
                                    </div>
                                )}

                                <section>
                                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 mb-8">The Story</h2>
                                    <div
                                        className="font-sans text-lg md:text-xl leading-relaxed text-gray-600 space-y-8"
                                        dangerouslySetInnerHTML={{ __html: memorial.biography }}
                                    />
                                </section>

                                {memorial.aiHighlights && memorial.aiHighlights.length > 1 && (
                                    <section>
                                        <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 mb-8">Community Reflections</h2>
                                        <div className="grid gap-6">
                                            {memorial.aiHighlights.slice(1).map((highlight, idx) => (
                                                <blockquote key={idx} className="p-6 bg-slate-50 border-l-4 border-slate-200 rounded-r-xl italic text-gray-600">
                                                    "{highlight}"
                                                </blockquote>
                                            ))}
                                        </div>
                                    </section>
                                )}

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
                                        <p className="font-medium text-gray-900">{memorial.restingPlace || 'Private'}</p>
                                    </div>
                                    {/* Cause of Death - Only shown if not private and exists */}
                                    {!memorial.isCauseOfDeathPrivate && memorial.causeOfDeath && memorial.causeOfDeath.length > 0 && (
                                        <div>
                                            <h4 className="text-[9px] uppercase tracking-[0.2em] font-bold text-gray-400 mb-2">Cause</h4>
                                            <p className="font-medium text-gray-900">{memorial.causeOfDeath.join(', ')}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Tributes List in Story Tab (Standard Compliance) */}
                                <div className="pt-12 border-t border-gray-100">
                                    <h2 className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 mb-8">Tributes</h2>
                                    <TributeList tributes={memorial.tributes} memorialId={memorial.id} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                                {memorial.gallery.map((item) => (
                                    <div key={item.id} className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                                        <img src={item.url} alt={item.caption || "Memory"} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                {memorial.gallery.length === 0 && <p className="text-gray-400">No photos shared yet.</p>}
                            </div>
                        )}

                        {activeTab === 'tributes' && (
                            <div className="space-y-12 animate-fade-in">
                                <div className="flex justify-between items-center">
                                    <h2 className="font-serif text-4xl font-bold text-gray-900 italic">Tributes</h2>
                                    <button
                                        onClick={() => setShowTributeForm(!showTributeForm)}
                                        className="bg-gray-900 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors"
                                    >
                                        {showTributeForm ? 'Cancel' : 'Add Tribute'}
                                    </button>
                                </div>

                                {showTributeForm && (
                                    <div className="bg-gray-50 p-8 rounded-3xl mb-8">
                                        <TributeForm memorialId={memorial.id} fullName={fullName} onSuccess={() => setShowTributeForm(false)} />
                                    </div>
                                )}

                                <div className="grid gap-8">
                                    <TributeList tributes={memorial.tributes} memorialId={memorial.id} />
                                </div>
                            </div>
                        )}

                        {activeTab === 'events' && (
                            <div className="text-center py-20 text-gray-400 animate-fade-in">
                                <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                                <p>No upcoming events scheduled.</p>
                            </div>
                        )}

                        {/* Donation Section */}
                        {memorial.donationInfo?.isEnabled && (
                            {/* Donation Section - Compact & Minimal */ }
                        {memorial.donationInfo?.isEnabled && (
                            <section className="mt-16 pt-8 border-t border-gray-100 animate-fade-in">
                                <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg shadow-gray-100">
                                    <div className="flex items-center gap-5">
                                        <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                                            <span className="material-symbols-outlined text-2xl">favorite</span>
                                        </div>
                                        <div>
                                            <h3 className="font-serif text-xl text-gray-900 italic mb-1">Legacy Fund</h3>
                                            <p className="text-sm text-gray-500 max-w-sm">Support the family and honor {memorial.firstName}'s memory.</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsDonationModalOpen(true)}
                                        className="shrink-0 px-8 py-3 bg-gray-900 text-white font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-gray-800 transition-all"
                                    >
                                        Contribute
                                    </button>
                                </div>
                            </section>
                        )}
                        )}
                    </div>
                </main>
            </div >
        </div >
    );
};

export default ModernMinimalLayout;
