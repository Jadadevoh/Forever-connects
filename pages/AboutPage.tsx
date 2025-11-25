import React from 'react';
import { SITE_NAME } from '../config';

const AboutPage: React.FC = () => {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
       {/* Hero Banner */}
      <div className="relative bg-cover bg-center rounded-lg shadow-sm overflow-hidden border border-silver mb-8 h-64" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1528913774727-33c943410982?q=80&w=2070&auto=format&fit=crop')" }}>
        <div className="absolute inset-0 bg-deep-navy/50 flex items-center justify-center p-4">
          <div className="bg-black/30 backdrop-blur-sm p-6 sm:p-8 rounded-lg border border-white/20 text-center text-white">
            <h1 className="text-4xl sm:text-5xl font-serif font-bold">A Space for Healing</h1>
            <p className="mt-2 text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">Honoring cherished lives with beautiful, lasting tributes that can be shared with family and friends, anywhere in the world.</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-silver">
        <section className="mb-8">
          <h2 className="text-3xl font-serif text-deep-navy mb-3 text-center">Our Mission</h2>
          <p className="text-lg text-deep-navy/90 leading-relaxed text-center max-w-3xl mx-auto">
            In times of loss, finding a way to honor a cherished life can be a profound part of the healing process. {SITE_NAME} was created to be a sanctuary for memories—a digital space where the stories, photos, and tributes that define a person can be gathered and shared with love. We believe that remembering is an act of love. Our platform is designed to be simple, respectful, and beautiful, allowing families to focus on what truly matters: celebrating the unique journey of their loved one.
          </p>
        </section>

        <div className="border-t border-silver my-8"></div>

        <section className="mb-8">
          <h2 className="text-3xl font-serif text-deep-navy mb-3 text-center">A Partnership in Compassion</h2>
          <p className="text-lg text-deep-navy/90 leading-relaxed text-center max-w-3xl mx-auto">
            We are honored to partner with funeral homes and grief counselors who share our commitment to supporting families with compassion and dignity. By integrating our platform, our partners can offer an extended layer of care, providing a lasting digital memorial that complements traditional services. This collaboration helps ensure that every family has a dedicated place to continue sharing memories long after the services have concluded.
          </p>
        </section>

        <div className="border-t border-silver my-8"></div>
        
        <section className="bg-pale-sky/50 p-6 rounded-lg border border-silver">
          <h2 className="text-3xl font-serif text-deep-navy mb-3 text-center">A Prayer for Comfort</h2>
          <p className="text-lg text-deep-navy/90 leading-relaxed text-center">
            For those who find solace in faith, we hold you in our hearts. The journey of grief is a heavy one, but you do not walk it alone.
          </p>
          <blockquote className="mt-4 border-l-4 border-dusty-blue pl-4 italic text-deep-navy/80 text-center max-w-xl mx-auto">
            "The Lord is close to the brokenhearted and saves those who are crushed in spirit."
            <cite className="block not-italic mt-2 text-sm">&ndash; Psalm 34:18</cite>
          </blockquote>
          <p className="mt-4 text-lg text-deep-navy/90 leading-relaxed text-center">
            May you find strength in your memories, comfort in your faith, and peace in the love that surrounds you. We pray that you feel the gentle presence of God, offering comfort and hope in your time of need.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;