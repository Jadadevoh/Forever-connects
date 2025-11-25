import React from 'react';
import { SITE_NAME } from '../config';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="animate-fade-in bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-silver max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif font-bold text-deep-navy text-center mb-6">Privacy Policy</h1>

      <div className="space-y-6 text-deep-navy/90 leading-relaxed">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">1. Introduction</h2>
          <p>
            Welcome to {SITE_NAME}. We are committed to protecting your personal data and respecting your privacy. This Privacy Policy explains what personal data we collect, how we use it, and your rights in relation to it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">2. Data We Collect</h2>
          <p>We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li><strong>Identity Data:</strong> Includes first name, last name, email address, and relationship to the deceased.</li>
            <li><strong>Memorial Data:</strong> Includes all information you provide for a memorial, such as names, dates, biographies, photos, videos, and other media. This is considered sensitive data, and we handle it with the utmost care.</li>
            <li><strong>Financial Data:</strong> For donations and plan purchases, payment details are processed by our payment provider, Stripe. We do not store your full card details on our servers.</li>
            <li><strong>Technical Data:</strong> Includes internet protocol (IP) address, browser type and version, time zone setting and location, and other technology on the devices you use to access this website.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">3. How We Use Your Data</h2>
          <p>We will only use your personal data when the law allows us to. Most commonly, we will use your personal data to:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Provide and manage your account and the memorials you create.</li>
            <li>Process transactions and donations.</li>
            <li>Notify you about activity on a memorial you created (e.g., new tributes, donations).</li>
            <li>Communicate with you regarding your account or services.</li>
            <li>Comply with legal or regulatory obligations.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way. Access to your personal data is limited to employees and third parties who have a business need to know.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">5. Your Legal Rights (GDPR)</h2>
          <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:</p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>The right to request access to your personal data.</li>
            <li>The right to request correction of your personal data.</li>
            <li>The right to request erasure of your personal data.</li>
            <li>The right to object to processing of your personal data.</li>
            <li>The right to request restriction of processing your personal data.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">6. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us through our <a href="#/contact" className="text-dusty-blue hover:underline">Contact Page</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;