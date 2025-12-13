import React from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';

const StripeAgreementPage: React.FC = () => {
  const { siteSettings } = useSiteSettings();

  return (
    <div className="animate-fade-in bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-silver max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif font-bold text-deep-navy text-center mb-6">Stripe Connected Account Agreement</h1>

      <div className="space-y-6 text-deep-navy/90 leading-relaxed">
        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">1. Agreement to Stripe's Terms</h2>
          <p>
            {siteSettings.siteName} uses Stripe, a third-party payment processor, to handle all donations and payouts. To enable the donation feature on your memorial, you must agree to the Stripe Connected Account Agreement.
          </p>
          <p className="mt-2">
            By enabling donations, you are creating a "Connected Account" with Stripe and are agreeing to be bound by their terms of service, which may be modified by Stripe from time to time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">2. Your Responsibilities</h2>
          <p>
            As the owner of the Stripe Connected Account, you are responsible for:
          </p>
          <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
            <li>Providing accurate and complete information about yourself and your bank account for payouts.</li>
            <li>Complying with all applicable laws and regulations regarding the funds you receive.</li>
            <li>Handling any disputes or chargebacks related to donations made to your memorial.</li>
            <li>Paying all applicable taxes on the funds you receive.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">3. Our Role</h2>
          <p>
            {siteSettings.siteName} acts solely as a platform to facilitate the connection between you, your donors, and Stripe. We are not responsible for any issues arising from your relationship with Stripe, including payout schedules, disputes, or account limitations.
          </p>
        </section>
        
        <section className="text-center mt-8">
            <p className="mb-4">
                You can review the full Stripe Connected Account Agreement on their official website:
            </p>
            <a 
                href="https://stripe.com/connect-account/legal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-dusty-blue hover:opacity-90 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            >
                View Stripe's Legal Agreement
            </a>
        </section>
      </div>
    </div>
  );
};

export default StripeAgreementPage;