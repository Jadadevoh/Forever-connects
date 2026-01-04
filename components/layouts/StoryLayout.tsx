import React from 'react';
import { Memorial } from '../../types';
import { GallerySlider } from '../GalleryHelpers';

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

const StoryLayout: React.FC<{ memorial: Memorial, fullName: string }> = ({ memorial, fullName }) => {
    const locationString = [memorial.city, memorial.state, memorial.country].filter(Boolean).join(', ');
    return (
        <div className="p-8">
            <section className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
                <div className="md:col-span-1 text-center md:text-left">
                    <img src={memorial.profileImage.url} alt={fullName} className="w-40 h-40 object-cover rounded-full mx-auto md:mx-0 shadow-lg border-4 border-white" />
                    <h1 className="text-4xl font-serif font-bold text-deep-navy mt-4">{fullName}</h1>
                    <p className="text-lg text-soft-gray mt-2">{formatDate(memorial.birthDate)} &ndash; {formatDate(memorial.deathDate)}</p>
                    <p className="text-md text-soft-gray mt-1">{locationString} &bull; Aged {getAge(memorial.birthDate, memorial.deathDate)}{memorial.gender && memorial.gender !== 'Prefer not to say' && ` • ${memorial.gender}`}</p>
                    {memorial.restingPlace && <p className="text-sm text-soft-gray mt-2">Resting Place: {memorial.restingPlace}</p>}
                    {memorial.causeOfDeath.length > 0 && !memorial.isCauseOfDeathPrivate && <p className="text-sm text-soft-gray mt-2">Cause of Death: {memorial.causeOfDeath.join(', ')}</p>}
                </div>
                <div className="md:col-span-2">
                    <h2 className="text-3xl font-serif text-deep-navy mb-4 border-b border-silver pb-2">Life Story</h2>
                    {memorial.aiHighlights && memorial.aiHighlights.length > 0 && (
                        <blockquote className="mb-6 pl-4 border-l-4 border-deep-navy/20 italic text-lg text-deep-navy/80 font-serif">
                            "{memorial.aiHighlights[0]}"
                        </blockquote>
                    )}
                    <div className="prose-styles text-base md:text-lg text-deep-navy/90 leading-relaxed" dangerouslySetInnerHTML={{ __html: memorial.biography }} />
                </div>
            </section>
            {memorial.gallery.length > 0 && (
                <section className="mt-10">
                    <h2 className="text-3xl font-serif text-deep-navy mb-4 border-b border-silver pb-2">Media Gallery</h2>
                    <GallerySlider items={memorial.gallery} />
                </section>
            )}
        </div>
    );
}

export default StoryLayout;
