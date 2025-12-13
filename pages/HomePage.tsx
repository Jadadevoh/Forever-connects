
import React from 'react';
import { Link } from 'react-router-dom';
import { useMemorials } from '../hooks/useMemorials';
import MemorialCard from '../components/MemorialCard';
import { useSiteSettings } from '../hooks/useSiteSettings';

const HelpfulToolsSection: React.FC = () => {
    const features = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
            title: "Biography Assistant",
            description: "If you're finding it hard to start, our assistant can help you craft a beautiful life story from key memories and personality traits."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
            title: "Beautiful Themes",
            description: "Choose from a selection of elegant design themes to create a visually stunning memorial that reflects their unique spirit."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
            title: "Tribute Suggestions",
            description: "For friends and family struggling for words, our optional AI offers gentle, personalized suggestions to help them express their love."
        }
    ];

    return (
        <div className="bg-pale-sky">
            <div className="container mx-auto py-16 sm:py-24 px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-serif font-bold text-deep-navy">Tools to Help You Tell Their Story</h2>
                    <p className="mt-2 text-lg text-soft-gray max-w-3xl mx-auto">
                        We provide thoughtful features to make the process of creating a beautiful tribute as simple and stress-free as possible.
                    </p>
                </div>
                <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    {features.map(feature => (
                        <div key={feature.title} className="flex flex-col items-center">
                            <div className="flex-shrink-0 bg-dusty-blue/10 text-dusty-blue rounded-full p-4">
                                {feature.icon}
                            </div>
                            <h3 className="mt-4 text-xl font-serif text-deep-navy font-semibold">{feature.title}</h3>
                            <p className="mt-2 text-deep-navy/80">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const HomePage: React.FC = () => {
  const { memorials } = useMemorials();
  const { siteSettings } = useSiteSettings();
  const publishedMemorials = memorials.filter(m => m.status === 'active');

  const heroImage = siteSettings.heroImageUrl || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop';

  return (
    <div className="animate-fade-in -mt-4 sm:-mt-6 lg:-mt-8">
        {/* Full-width Hero Section */}
        <div className="w-full bg-cover bg-center h-96 sm:h-[500px] relative" style={{ backgroundImage: `url('${heroImage}')` }}>
            <div className="absolute inset-0 bg-deep-navy/40" />
            <div className="relative h-full flex items-center justify-center text-center text-white">
                <div className="max-w-3xl px-4">
                    <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight">Honor a Life. Share a Legacy.</h1>
                    <p className="mt-4 text-lg sm:text-xl text-white/90">
                        Create a beautiful, lasting online memorial to celebrate the life of someone you love. A place for family and friends to gather, share memories, and find comfort together.
                    </p>
                    <Link
                        to="/create"
                        className="mt-8 inline-block bg-white text-deep-navy font-bold py-3 px-8 rounded-lg transition duration-300 text-lg hover:bg-pale-sky"
                    >
                        Create a Free Memorial
                    </Link>
                </div>
            </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white">
            <div className="container mx-auto py-16 sm:py-24 px-4">
                <div className="text-center">
                    <h2 className="text-3xl sm:text-4xl font-serif font-bold text-deep-navy">A Simple & Dignified Way to Remember</h2>
                    <p className="mt-4 text-lg text-soft-gray max-w-3xl mx-auto">
                        In just a few easy steps, you can create a beautiful online space to celebrate their life and legacy.
                    </p>
                </div>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 text-center">
                    <div className="flex flex-col items-center">
                        <div className="flex-shrink-0 bg-dusty-blue/10 text-dusty-blue rounded-full p-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h3 className="mt-4 text-2xl font-serif text-deep-navy font-semibold">1. Create Their Tribute</h3>
                        <p className="mt-2 text-deep-navy/80">Easily build their memorial with our step-by-step guide. Add their life story, photos, and key details. Our optional assistant can even help you write a beautiful biography.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex-shrink-0 bg-dusty-blue/10 text-dusty-blue rounded-full p-4">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.835 2.149a.5.5 0 00-.33.918l1.415 1.414a.5.5 0 00.707 0L10.33 3.067a.5.5 0 00-.918-.33zM15.165 2.149a.5.5 0 01.33.918l-1.415 1.414a.5.5 0 01-.707 0L12.67 3.067a.5.5 0 01.918-.33zM3.841 7.414a.5.5 0 00-.33.918l1.415 1.414a.5.5 0 00.707 0L4.926 8.332a.5.5 0 00-.918-.33z" /></svg>
                        </div>
                        <h3 className="mt-4 text-2xl font-serif text-deep-navy font-semibold">2. Share with Loved Ones</h3>
                        <p className="mt-2 text-deep-navy/80">Invite family and friends with a simple, shareable link. They can visit anytime to leave tributes, share memories, and feel connected.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex-shrink-0 bg-dusty-blue/10 text-dusty-blue rounded-full p-4">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </div>
                        <h3 className="mt-4 text-2xl font-serif text-deep-navy font-semibold">3. Accept Support</h3>
                        <p className="mt-2 text-deep-navy/80">Optionally enable a secure donation page to support a charity, cover final expenses, or help the family during a difficult time.</p>
                    </div>
                </div>
            </div>
        </div>

        <HelpfulToolsSection />

        <div className="container mx-auto py-16 sm:py-24 px-4">
            {publishedMemorials.length > 0 ? (
                <div>
                <h2 className="text-3xl font-serif text-deep-navy mb-6 text-center">Recent Memorials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {publishedMemorials.map(memorial => (
                    <MemorialCard key={memorial.id} memorial={memorial} />
                    ))}
                </div>
                </div>
            ) : (
                <div className="text-center bg-white p-12 rounded-lg shadow-sm border border-silver">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-soft-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-2xl font-serif text-deep-navy">No Public Memorials Yet</h3>
                <p className="mt-1 text-base text-soft-gray">Be the first to create a beautiful memorial for someone special.</p>
                <div className="mt-6">
                    <Link
                    to="/create"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-dusty-blue hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dusty-blue"
                    >
                    Create a Memorial
                    </Link>
                </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default HomePage;