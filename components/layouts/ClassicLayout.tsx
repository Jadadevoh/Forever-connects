import React, { useState } from 'react';
import { Memorial } from '../../types';
import { renderGalleryItem } from '../GalleryHelpers';
import DonationModule from '../DonationModule';
import TributeList from '../TributeList';

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

const ClassicLayout: React.FC<{ memorial: Memorial, fullName: string }> = ({ memorial, fullName }) => {
    const [activeTab, setActiveTab] = useState<'story' | 'gallery' | 'tributes' | 'events' | 'support'>('story');
    const locationString = [memorial.city, memorial.state, memorial.country].filter(Boolean).join(', ');

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <header className="text-center mb-8">
                <img src={memorial.profileImage.url} alt={fullName} className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-full mx-auto shadow-lg border-4 border-white -mb-0 relative z-10" />
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-deep-navy mt-6">{fullName}</h1>
                <p className="text-lg text-soft-gray mt-2">{formatDate(memorial.birthDate)} &ndash; {formatDate(memorial.deathDate)}</p>
                <p className="text-md text-soft-gray mt-1">{locationString} &bull; Aged {getAge(memorial.birthDate, memorial.deathDate)}{memorial.gender && memorial.gender !== 'Prefer not to say' && ` • ${memorial.gender}`}</p>
                {memorial.restingPlace && <p className="text-sm text-soft-gray mt-2">Resting Place: {memorial.restingPlace}</p>}
                {!memorial.isCauseOfDeathPrivate && memorial.causeOfDeath && memorial.causeOfDeath.length > 0 && (
                    <p className="text-sm text-soft-gray mt-2">Cause of Death: {memorial.causeOfDeath.join(', ')}</p>
                )}
            </header>

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto whitespace-nowrap no-scrollbar border-b border-silver mb-8 md:justify-center">
                {[
                    { id: 'story', label: 'Story' },
                    { id: 'gallery', label: 'Gallery' },
                    { id: 'tributes', label: 'Tributes' },
                    ...(memorial.donationInfo?.isEnabled ? [{ id: 'support', label: 'Support' }] : []),
                    { id: 'events', label: 'Events' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-3 font-serif font-bold text-lg transition-colors border-b-2 ${activeTab === tab.id ? 'border-deep-navy text-deep-navy' : 'border-transparent text-soft-gray hover:text-deep-navy'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-pale-sky/50 rounded-lg p-8 border border-silver min-h-[400px]">
                {activeTab === 'story' && (
                    <section className="animate-fade-in">
                        {memorial.aiHighlights && memorial.aiHighlights.length > 0 && (
                            <div className="mb-8 p-6 bg-paper-light border-l-4 border-deep-navy/30 italic text-deep-navy/80 text-lg font-serif rounded-r-lg">
                                "{memorial.aiHighlights[0]}"
                            </div>
                        )}
                        <h2 className="text-3xl font-serif text-deep-navy mb-4 border-b border-silver pb-2">Life Story</h2>
                        <div className="prose-styles text-base md:text-lg text-deep-navy/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: memorial.biography }} />



                        {/* Recent Photos Preview (Standardized) */}
                        {memorial.gallery.length > 0 && (
                            <div className="mt-12 pt-8 border-t border-silver">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-2xl font-serif text-deep-navy">Recent Photos</h3>
                                    <button onClick={() => setActiveTab('gallery')} className="text-deep-navy font-bold text-sm uppercase tracking-wider hover:underline">View All</button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {memorial.gallery.slice(0, 4).map(item => (
                                        <div key={item.id} className="aspect-square bg-gray-100 border border-silver p-1 shadow-sm">
                                            {renderGalleryItem(item)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tributes List in Story Tab (Standard Compliance) */}
                        <div className="mt-12 pt-8 border-t border-silver">
                            <h3 className="text-2xl font-serif text-deep-navy mb-6">Tributes</h3>
                            <TributeList tributes={memorial.tributes} memorialId={memorial.id} />
                        </div>
                    </section>
                )}

                {activeTab === 'gallery' && (
                    <section className="animate-fade-in">
                        <h2 className="text-3xl font-serif text-deep-navy mb-4 border-b border-silver pb-2">Media Gallery</h2>
                        {memorial.gallery.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {memorial.gallery.map(item => <div key={item.id}>{renderGalleryItem(item)}</div>)}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-10">No photos shared yet.</p>
                        )}
                    </section>
                )}

                {activeTab === 'tributes' && (
                    <section className="animate-fade-in">
                        <h2 className="text-3xl font-serif text-deep-navy mb-4 border-b border-silver pb-2">Tributes</h2>
                        <div className="space-y-6">
                            <TributeList tributes={memorial.tributes} memorialId={memorial.id} />
                        </div>
                    </section>
                )}

                {activeTab === 'events' && (
                    <div className="text-center py-20 text-soft-gray animate-fade-in">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">event_busy</span>
                        <p className="font-serif text-xl">No upcoming events scheduled.</p>
                    </div>
                )}

                {/* Donation Section */}
                {memorial.donationInfo?.isEnabled && (
                    {/* Donation Section - Compact & Cute */ }
                {memorial.donationInfo?.isEnabled && (
                    <section className="mt-8 pt-8 border-t border-silver animate-fade-in">
                        <div className="bg-white/60 p-6 rounded-2xl border border-silver shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4 text-center sm:text-left">
                                <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined text-2xl">volunteer_activism</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif text-deep-navy">The Legacy Fund</h3>
                                    <p className="text-sm text-soft-gray max-w-sm">Honoring {memorial.firstName} with a contribution.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveTab('support' as any)}
                                className="px-6 py-2.5 bg-primary text-white text-sm font-bold uppercase tracking-wider rounded-full hover:opacity-90 transition-all shadow-md whitespace-nowrap"
                            >
                                Donate
                            </button>
                        </div>
                    </section>
                )}

                {activeTab === 'support' && memorial.donationInfo?.isEnabled && (
                    <section className="animate-fade-in p-8">
                        <DonationModule memorial={memorial} />
                    </section>
                )}
            </div>
        </div>
    );
};

export default ClassicLayout;
