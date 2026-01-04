import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteSettings } from '../hooks/useSiteSettings';

const TermsAndConditionsPage: React.FC = () => {
    const { siteSettings } = useSiteSettings();

    return (
        <div className="animate-fade-in bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-silver max-w-4xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-deep-navy text-center mb-6">Terms and Conditions</h1>

            <div className="space-y-6 text-deep-navy/90 leading-relaxed">
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <section>
                    <h2 className="text-2xl font-serif text-deep-navy mb-2">1. Agreement to Terms</h2>
                    <p>
                        By accessing or using {siteSettings.siteName}, you agree to be bound by these Terms and Conditions. If you do not agree to all the terms and conditions, then you may not access the service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-navy mb-2">2. Use of Service</h2>
                    <p>
                        You agree to use the website only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our website.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-navy mb-2">3. User Content</h2>
                    <p>
                        Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the service, including its legality, reliability, and appropriateness.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-navy mb-2">4. Accounts</h2>
                    <p>
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-navy mb-2">5. Intellectual Property</h2>
                    <p>
                        The service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of {siteSettings.siteName} and its licensors.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-navy mb-2">6. Termination</h2>
                    <p>
                        We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-serif text-deep-navy mb-2">7. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us through our <Link to="/contact?subject=Terms%20and%20Conditions" className="text-dusty-blue hover:underline">Contact Page</Link>.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsAndConditionsPage;
