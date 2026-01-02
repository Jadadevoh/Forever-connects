import React, { useState } from 'react';
import { Memorial } from '../../types';
import { renderGalleryItem } from '../GalleryHelpers';
import DonationModule from '../DonationModule';

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
                        <h2 className="text-3xl font-serif text-deep-navy mb-4 border-b border-silver pb-2">Life Story</h2>
                        <div className="prose-styles text-base md:text-lg text-deep-navy/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: memorial.biography }} />
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
                            {memorial.tributes.map(tribute => (
                                <div key={tribute.id} className="bg-white p-6 rounded-xl border border-silver shadow-sm">
                                    <p className="italic text-gray-600 mb-4 font-serif">"{tribute.content}"</p>
                                    <div className="flex justify-between items-center">
                                        <p className="font-bold text-sm text-deep-navy">- {tribute.author}</p>
                                        <p className="text-xs text-soft-gray">{new Date(tribute.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                            {memorial.tributes.length === 0 && <p className="text-center text-gray-500 py-10">No tributes yet.</p>}
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
                    <section className="mt-10 pt-10 border-t border-silver text-center animate-fade-in">
                        <div className="max-w-2xl mx-auto bg-white/50 p-8 rounded-xl border border-silver shadow-sm">
                            <span className="material-symbols-outlined text-4xl text-primary mb-4">volunteer_activism</span>
                            <h3 className="text-2xl font-serif text-deep-navy mb-2">The Legacy Fund</h3>
                            <p className="text-soft-gray mb-6">{memorial.donationInfo.description}</p>
                            <div className="w-full bg-silver/30 rounded-full h-3 mb-6 overflow-hidden">
                                <div className="bg-primary h-full rounded-full" style={{ width: '0%' }}></div>
                            </div>
                            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-soft-gray mb-8">
                                <span>$0 Raised</span>
                                <span>Goal ${memorial.donationInfo.goal}</span>
                            </div>
                            <button onClick={() => setActiveTab('support' as any)} className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity shadow-md">
                                Donate Now
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
