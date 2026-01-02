import React, { useState } from 'react';
import { Memorial } from '../../types';
import DonationModule from '../DonationModule';

interface TimelessLayoutProps {
    memorial: Memorial;
    fullName: string;
}

const TimelessLayout: React.FC<TimelessLayoutProps> = ({ memorial, fullName }) => {
    const [activeTab, setActiveTab] = useState<'story' | 'gallery' | 'tributes' | 'events' | 'support'>('story');

    const renderHero = () => (
        <section className="w-full relative min-h-[500px] flex flex-col items-center justify-center text-center px-4 md:px-8 bg-gradient-to-b from-background-light to-[#e7ebf3] dark:from-background-dark dark:to-gray-900 py-16">
            <div className="relative group mb-8">
                <div className="size-40 md:size-56 rounded-full border-4 border-white dark:border-gray-700 shadow-xl overflow-hidden relative bg-gray-200">
                    <img
                        src={memorial.profileImage.url}
                        alt={fullName}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
            <div className="space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-deep-navy dark:text-white font-display">
                    {fullName}
                </h1>
                <p className="text-lg md:text-xl text-soft-gray dark:text-gray-400 font-medium">
                    {new Date(memorial.birthDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} – {new Date(memorial.deathDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <div className="flex items-center justify-center gap-2 mt-4">
                    <span className="material-symbols-outlined text-primary text-lg">favorite</span>
                    <p className="text-soft-gray dark:text-gray-400 italic text-lg">"Loved by all who knew him."</p>
                </div>
            </div>
        </section>
    );

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen font-display">
            {renderHero()}

            {/* Navigation */}
            <div className="w-full max-w-[960px] mx-auto px-4 md:px-8 mt-10">
                <nav className="flex border-b border-[#cfd7e7] dark:border-gray-800 gap-8 overflow-x-auto whitespace-nowrap no-scrollbar justify-start md:justify-center">
                    {[
                        { id: 'story', label: 'Story' },
                        { id: 'gallery', label: 'Gallery' },
                        { id: 'tributes', label: 'Tributes' },
                        { id: 'events', label: 'Events' },
                        ...(memorial.donationInfo?.isEnabled ? [{ id: 'support', label: 'Support' }] : [])
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`group flex flex-col items-center justify-center border-b-[3px] pb-3 px-2 min-w-[80px] transition-colors ${activeTab === tab.id ? 'border-b-primary' : 'border-b-transparent hover:border-b-gray-300 dark:hover:border-b-gray-600'
                                }`}
                        >
                            <span className={`text-sm font-bold tracking-wide ${activeTab === tab.id ? 'text-primary' : 'text-soft-gray group-hover:text-deep-navy dark:group-hover:text-white'}`}>
                                {tab.label}
                            </span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content Grid */}
            <div className="w-full max-w-[1200px] mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-x-10 gap-y-12 items-start pb-20">

                {/* Left Column (Sticky Details) */}
                <div className="flex flex-col gap-8 lg:sticky lg:top-[9rem]">
                    {/* AI Reflection */}
                    {memorial.aiHighlights && memorial.aiHighlights.length > 0 && (
                        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/10 dark:border-primary/20 rounded-xl p-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <span className="material-symbols-outlined text-6xl text-primary">auto_awesome</span>
                            </div>
                            <div className="flex gap-3 mb-3 items-center">
                                <div className="bg-primary/10 p-1.5 rounded-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-primary text-sm">auto_awesome</span>
                                </div>
                                <span className="text-xs font-bold text-primary uppercase tracking-wider">AI Reflection</span>
                            </div>
                            <h3 className="text-lg font-bold text-deep-navy dark:text-white mb-2">A Legacy of Life</h3>
                            <p className="text-soft-gray dark:text-gray-300 text-base leading-relaxed">
                                {memorial.aiHighlights[0]}
                            </p>
                        </div>
                    )}

                    {/* Details Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-silver dark:border-gray-700">
                        <h4 className="text-lg font-bold text-deep-navy dark:text-white mb-4 border-b border-silver dark:border-gray-700 pb-2">Details</h4>
                        <dl className="flex flex-col gap-5">
                            <div className="flex gap-4 items-start">
                                <span className="material-symbols-outlined mt-1 text-soft-gray">location_on</span>
                                <div>
                                    <dt className="text-xs font-semibold text-soft-gray uppercase tracking-wide">Place</dt>
                                    <dd className="text-deep-navy dark:text-white text-base">{memorial.city}, {memorial.state}</dd>
                                </div>
                            </div>
                            {memorial.restingPlace && (
                                <div className="flex gap-4 items-start">
                                    <span className="material-symbols-outlined mt-1 text-soft-gray">church</span>
                                    <div>
                                        <dt className="text-xs font-semibold text-soft-gray uppercase tracking-wide">Resting</dt>
                                        <dd className="text-deep-navy dark:text-white text-base">{memorial.restingPlace}</dd>
                                    </div>
                                </div>
                            )}
                            {!memorial.isCauseOfDeathPrivate && memorial.causeOfDeath && memorial.causeOfDeath.length > 0 && (
                                <div className="flex gap-4 items-start">
                                    <span className="material-symbols-outlined mt-1 text-soft-gray">medical_services</span>
                                    <div>
                                        <dt className="text-xs font-semibold text-soft-gray uppercase tracking-wide">Cause of Passing</dt>
                                        <dd className="text-deep-navy dark:text-white text-base">{memorial.causeOfDeath.join(', ')}</dd>
                                    </div>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>

                {/* Middle Column (Main Content) */}
                <div className="flex flex-col gap-8">
                    {activeTab === 'story' && (
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            <h3 className="text-2xl font-bold text-deep-navy dark:text-white mb-4">Biography</h3>
                            <div className="text-soft-gray dark:text-gray-400 text-lg leading-relaxed mb-6 space-y-4" dangerouslySetInnerHTML={{ __html: memorial.biography }} />

                            {memorial.aiHighlights && memorial.aiHighlights.length > 1 && (
                                <blockquote className="border-l-4 border-primary pl-4 italic text-xl text-deep-navy dark:text-gray-200 my-8">
                                    "{memorial.aiHighlights[1]}"
                                </blockquote>
                            )}
                        </div>
                    )}

                    {activeTab === 'gallery' && (
                        <div className="grid grid-cols-2 gap-4">
                            {memorial.gallery.map(item => (
                                <div key={item.id} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                    <img src={item.url} alt="Memory" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'tributes' && (
                        <div className="space-y-6">
                            {memorial.tributes.map(tribute => (
                                <div key={tribute.id} className="bg-white p-6 rounded-xl border border-silver">
                                    <p className="italic text-gray-600 mb-4">"{tribute.content}"</p>
                                    <p className="font-bold text-sm text-deep-navy">- {tribute.author}</p>
                                </div>
                            ))}
                            {memorial.tributes.length === 0 && <p className="text-center text-gray-500">No tributes yet.</p>}
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className="text-center py-20 text-soft-gray dark:text-gray-400">
                            <span className="material-symbols-outlined text-5xl mb-3 opacity-50">calendar_month</span>
                            <p className="text-xl font-medium">No upcoming events.</p>
                        </div>
                    )}

                    {activeTab === 'support' && memorial.donationInfo?.isEnabled && (
                        <div className="py-8">
                            <h3 className="text-2xl font-bold text-deep-navy dark:text-white mb-6 text-center">Support the Family</h3>
                            <div className="max-w-xl mx-auto">
                                <DonationModule memorial={memorial} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column (Recent Photos / Donate) */}
                <div className="flex flex-col gap-8 lg:sticky lg:top-[9rem]">
                    {/* Recent Photos Widget */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-silver dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4 border-b border-silver dark:border-gray-700 pb-2">
                            <h4 className="text-lg font-bold text-deep-navy dark:text-white">Recent Photos</h4>
                            {memorial.gallery.length > 0 && <button onClick={() => setActiveTab('gallery')} className="text-primary text-sm font-bold hover:underline">View All</button>}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            {memorial.gallery.slice(0, 4).map(item => (
                                <div key={'widget-' + item.id} className="aspect-square rounded-lg bg-gray-100 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                                    <img src={item.url} className="w-full h-full object-cover" alt="Recent" />
                                </div>
                            ))}
                            {memorial.gallery.length === 0 && <p className="text-xs text-gray-500 col-span-2">No photos available</p>}
                        </div>
                    </div>

                    {/* Donation Widget */}
                    {memorial.donationInfo?.isEnabled && (
                        <div className="bg-gradient-to-br from-primary to-deep-navy rounded-xl p-6 text-white shadow-lg text-center">
                            <span className="material-symbols-outlined text-4xl mb-2">volunteer_activism</span>
                            <h4 className="text-lg font-bold mb-2">Support the Family</h4>
                            <p className="text-blue-100 text-sm mb-4">
                                {memorial.donationInfo.description || "The family appreciates your support during this time."}
                            </p>
                            <button
                                onClick={() => setActiveTab('support')}
                                className="w-full py-2.5 bg-white text-primary font-bold rounded-full text-sm hover:bg-blue-50 transition-colors"
                            >
                                Donate Now
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default TimelessLayout;
