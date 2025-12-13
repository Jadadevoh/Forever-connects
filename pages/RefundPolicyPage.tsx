import React from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';

const RefundPolicyPage: React.FC = () => {
  const { siteSettings } = useSiteSettings();

  return (
    <div className="animate-fade-in bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-silver max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif font-bold text-deep-navy text-center mb-6">Refund Policy</h1>

      <div className="space-y-6 text-deep-navy/90 leading-relaxed">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">1. Donations</h2>
          <p>
            Once you make a donation on the {siteSettings.siteName} platform, it is final and non-refundable. Donations are considered personal gifts or contributions to the designated recipient (the memorial owner or a specified cause). As we facilitate the transfer of funds directly to the recipient via our payment processor, we are unable to reverse the transaction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">2. Exceptions</h2>
          <p>
            We will only consider a refund in cases of a clear technical error on our platform or a verified unauthorized transaction. If you believe your card was used without your permission or a technical glitch caused an incorrect charge, please contact us immediately.
          </p>
          <p className="mt-2">
            To request a refund review, you must contact us within 48 hours of the transaction and provide sufficient evidence of the error or unauthorized use. We will investigate the claim and, if it is validated, we will process a refund for the affected amount.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">3. Subscription Plans</h2>
          <p>
            For our Premium and Eternal subscription plans, payments are also non-refundable. You can cancel a recurring subscription at any time, and you will retain access to the features until the end of your current billing period. No refunds will be issued for partial billing periods.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">4. Contact Us</h2>
          <p>
            For any questions about our refund policy or to report an issue with a transaction, please visit our <a href="#/contact" className="text-dusty-blue hover:underline">Contact Page</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicyPage;