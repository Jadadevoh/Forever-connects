import React from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const { siteSettings } = useSiteSettings();

  const defaultHero = '/about-hero.png';
  const heroImage = siteSettings.aboutHeroImageUrl || defaultHero;

  return (
    <div className="animate-fade-in -mt-4 sm:-mt-6 lg:-mt-8">
      {/* Full-width Hero Section - Matching Home Page Style */}
      <div className="w-full bg-cover bg-center h-96 sm:h-[500px] relative" style={{ backgroundImage: `url('${heroImage}')` }}>
        <div className="absolute inset-0 bg-deep-navy/50" />
        <div className="relative h-full flex items-center justify-center text-center text-white">
          <div className="max-w-4xl px-4">
            <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight">A Space for Healing</h1>
            <p className="mt-4 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto">
              Honoring cherished lives with beautiful, lasting tributes that can be shared with family and friends, anywhere in the world.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="bg-white">
        <div className="container mx-auto py-16 sm:py-24 px-4">

          {/* Mission Section */}
          <div className="max-w-3xl mx-auto text-center mb-20">
            <div className="flex justify-center mb-6">
              <div className="bg-dusty-blue/10 text-dusty-blue rounded-full p-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-deep-navy mb-6">Our Mission</h2>
            <p className="text-lg text-deep-navy/80 leading-relaxed">
              In times of loss, finding a way to honor a cherished life can be a profound part of the healing process. {siteSettings.siteName} was created to be a sanctuary for memories—a digital space where the stories, photos, and tributes that define a person can be gathered and shared with love. We believe that remembering is an act of love. Our platform is designed to be simple, respectful, and beautiful, allowing families to focus on what truly matters: celebrating the unique journey of their loved one.
            </p>
          </div>

          {/* Partnership Section - Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div className="order-2 md:order-1">
              <img
                src="/compassionate-support.png"
                alt="Compassionate support"
                className="rounded-lg shadow-lg border border-silver w-full h-[400px] object-cover object-right"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-serif font-bold text-deep-navy mb-6">A Partnership in Compassion</h2>
              <p className="text-lg text-deep-navy/80 leading-relaxed mb-6">
                We are honored to partner with funeral homes and grief counselors who share our commitment to supporting families with compassion and dignity. By integrating our platform, our partners can offer an extended layer of care, providing a lasting digital memorial that complements traditional services.
              </p>
              <p className="text-lg text-deep-navy/80 leading-relaxed">
                This collaboration helps ensure that every family has a dedicated place to continue sharing memories long after the services have concluded.
              </p>
            </div>
          </div>

          {/* Prayer / Comfort Section */}
          <div className="bg-pale-sky/50 rounded-2xl p-8 sm:p-12 text-center border border-silver">
            <h2 className="text-3xl font-serif font-bold text-deep-navy mb-6">A Prayer for Comfort</h2>
            <p className="text-lg text-deep-navy/90 leading-relaxed max-w-2xl mx-auto mb-8">
              For those who find solace in faith, we hold you in our hearts. The journey of grief is a heavy one, but you do not walk it alone.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <svg className="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-dusty-blue/20" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.896 3.456-8.352 9.12-8.352 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
              </svg>
              <blockquote className="relative bg-white p-6 rounded-lg shadow-sm border border-silver">
                <p className="text-xl font-serif italic text-deep-navy/90">
                  "The Lord is close to the brokenhearted and saves those who are crushed in spirit."
                </p>
                <cite className="block mt-4 text-sm font-semibold text-dusty-blue not-italic">&ndash; Psalm 34:18</cite>
              </blockquote>
            </div>
            <p className="mt-8 text-lg text-deep-navy/90 leading-relaxed max-w-2xl mx-auto">
              May you find strength in your memories, comfort in your faith, and peace in the love that surrounds you.
            </p>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-serif font-bold text-deep-navy mb-4">Start Creating a Tribute Today</h2>
            <Link
              to="/create"
              className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-bold rounded-lg shadow-sm text-white bg-dusty-blue hover:opacity-90 transition duration-300"
            >
              Create a Free Memorial
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AboutPage;