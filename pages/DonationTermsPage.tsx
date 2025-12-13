import React from 'react';
import { useSiteSettings } from '../hooks/useSiteSettings';

const DonationTermsPage: React.FC = () => {
  const { siteSettings } = useSiteSettings();

  return (
    <div className="animate-fade-in bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-silver max-w-4xl mx-auto">
      <h1 className="text-4xl font-serif font-bold text-deep-navy text-center mb-6">Donation Terms of Service</h1>

      <div className="space-y-6 text-deep-navy/90 leading-relaxed">
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">1. General</h2>
          <p>
            This page outlines the terms and conditions for making a donation through the {siteSettings.siteName} platform. By making a donation, you agree to these terms.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">2. Use of Donations</h2>
          <p>
            Donations are made to the individual or cause specified by the memorial creator (the "Recipient"). {siteSettings.siteName} acts as a platform to facilitate these transactions. While memorial creators specify a purpose for the funds (e.g., funeral expenses, charity), we do not guarantee that the funds will be used for that specific purpose. It is the donor's responsibility to ensure they are comfortable with the Recipient.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">3. Payment Processing</h2>
          <p>
            All donations are processed through our third-party payment processor, Stripe. A standard processing fee is deducted from each donation by Stripe. This fee is subject to Stripe's terms and is not controlled by {siteSettings.siteName}. The net amount (donation minus processing fee) is what the Recipient will receive.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">4. Tax Deductibility</h2>
          <p>
            Donations made to individuals or families are typically considered personal gifts and are not tax-deductible. If a memorial's designated recipient is a registered charity (e.g., a 501(c)(3) organization), your donation may be tax-deductible. Please consult with a tax professional for advice. {siteSettings.siteName} does not provide tax receipts unless the Recipient is a registered charity that has made such arrangements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">5. Refunds</h2>
          <p>
            Please see our <a href="#/refund-policy" className="text-dusty-blue hover:underline">Refund Policy</a> for information on donation refunds. In general, donations are non-refundable.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-serif text-deep-navy mb-2">6. Contact</h2>
          <p>
            If you have any questions about these terms, please contact us through our <a href="#/contact" className="text-dusty-blue hover:underline">Contact Page</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default DonationTermsPage;