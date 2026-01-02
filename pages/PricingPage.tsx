import React from 'react';
import { Link } from 'react-router-dom';
import { useApiSettings } from '../hooks/useApiSettings';
import { MemorialPlan } from '../types';
import CheckoutButton from '../components/CheckoutButton';


const CheckIcon = () => (
    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
);

const XIcon = () => (
    <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
)

const PaymentMethods: React.FC = () => {
    const { apiSettings } = useApiSettings();
    const methods = ['All major credit cards'];
    if (apiSettings.enableApplePay) methods.push('Apple Pay');
    if (apiSettings.enableGooglePay) methods.push('Google Pay');
    if (apiSettings.paypalClientId) methods.push('PayPal');
    if (apiSettings.enableAch) methods.push('Bank Transfer (ACH)');

    if (methods.length === 1) return null; // Only show if more than just cards are enabled

    return (
        <p className="text-center text-sm text-soft-gray mt-8">
            We accept: {methods.join(', ')}.
        </p>
    );
};

const PricingPage: React.FC = () => {

    const plans = [
        {
            id: 'free',
            name: 'Remembrance Memorial',
            price: 'Free',
            frequency: 'One memorial',
            description: 'A simple, beautiful place to honor a loved one and share memories with close family and friends.',
            features: [
                { text: 'Memorial page', included: true },
                { text: 'Up to 5 photos', included: true },
                { text: 'Written tributes', included: true },
                { text: 'Calm, classic theme', included: true },
                { text: 'Private sharing link', included: true },
            ],
            bestFor: [
                'Immediate remembrance',
                'Small, private circles',
                'Short-term or simple memorials'
            ],
            cta: 'Create This Memorial',
            isFeatured: false,
        },
        {
            id: 'premium',
            name: 'Living Memorial',
            price: '$4.99',
            frequency: 'per memorial / month',
            description: 'A richer memorial that grows as memories are added and shared over time.',
            features: [
                { text: 'Everything in Remembrance', included: true },
                { text: 'Unlimited photos', included: true },
                { text: 'Videos & audio recordings', included: true },
                { text: 'Music playlist', included: true },
                { text: 'Custom themes', included: true },
                { text: 'AI-powered search across memories', included: true },
                { text: 'Ongoing updates and additions for this memorial', included: true },
            ],
            bestFor: [
                'Families actively contributing memories',
                'Multimedia storytelling',
                'Annual remembrance and reflection'
            ],
            cta: 'Upgrade This Memorial',
            isFeatured: true,
        },
        {
            id: 'eternal',
            name: 'Eternal Memorial',
            price: '$99',
            frequency: 'per memorial - one-time',
            description: 'A permanent tribute, preserved with care and hosted forever.',
            features: [
                { text: 'Everything in Living Memorial', included: true },
                { text: 'No renewals or subscriptions', included: true },
                { text: 'Permanent hosting for this memorial', included: true },
                { text: 'Priority support', included: true },
                { text: 'Long-term preservation guarantee', included: true },
                { text: 'Peace of mind for future generations', included: true },
            ],
            bestFor: [
                'Long-term legacy',
                'Estate and family preservation',
                'Families who want permanence'
            ],
            cta: 'Preserve This Memorial Forever',
            isFeatured: false,
        },
    ];

    return (
        <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-deep-navy mb-4">Memorial Plans</h1>
                <p className="text-lg text-soft-gray max-w-2xl mx-auto">
                    Each memorial is created and cared for individually. Choose the level of permanence that feels right for this life being honored.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {plans.map((plan) => (
                    <div key={plan.name} className={`bg-white rounded-xl shadow-lg border relative ${plan.isFeatured ? 'border-dusty-blue ring-1 ring-dusty-blue' : 'border-silver'} p-8 flex flex-col transition-transform duration-300 hover:-translate-y-1`}>
                        {plan.isFeatured && (
                            <div className="absolute -top-3 left-0 right-0 text-center">
                                <span className="bg-dusty-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Most Popular</span>
                            </div>
                        )}
                        <h2 className="text-2xl font-serif text-deep-navy font-bold text-center mb-2 h-16 flex items-end justify-center pb-2">{plan.name}</h2>
                        <div className="text-center mb-4 h-16 flex flex-col justify-center">
                            <span className="text-4xl font-bold text-deep-navy block mb-1">{plan.price}</span>
                            <span className="text-sm font-medium text-soft-gray bg-pale-sky px-3 py-1 rounded-full inline-block">{plan.frequency}</span>
                        </div>
                        <p className="text-center text-soft-gray mb-6 text-sm h-14 flex items-center justify-center">{plan.description}</p>

                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-deep-navy uppercase tracking-wider mb-3">Includes</h3>
                            <ul className="space-y-3 min-h-[240px]">
                                {plan.features.map((feature) => (
                                    <li key={feature.text} className="flex items-start space-x-3">
                                        {feature.included ? (
                                            <CheckIcon />
                                        ) : (
                                            <XIcon />
                                        )}
                                        <span className="text-sm text-deep-navy/80 leading-tight">{feature.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="mb-8 p-4 bg-pale-sky/30 rounded-lg min-h-[140px]">
                            <h3 className="text-xs font-bold text-deep-navy uppercase tracking-wider mb-2">Best For</h3>
                            <ul className="list-disc list-inside space-y-1">
                                {plan.bestFor.map((item, idx) => (
                                    <li key={idx} className="text-xs text-soft-gray">{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="mt-auto">
                            {plan.id === 'free' ? (
                                <Link
                                    to="/create"
                                    className={`w-full text-center block font-bold py-3 px-4 rounded-lg transition duration-300 bg-silver text-deep-navy hover:bg-soft-gray/80`}
                                >
                                    {plan.cta}
                                </Link>
                            ) : (
                                <CheckoutButton
                                    plan={plan.id as MemorialPlan}
                                    className={`w-full text-center block font-bold py-3 px-4 rounded-lg transition duration-300 ${plan.isFeatured ? 'bg-dusty-blue text-white hover:opacity-90 shadow-md' : 'bg-deep-navy text-white hover:bg-deep-navy/90'}`}
                                >
                                    {plan.cta}
                                </CheckoutButton>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <PaymentMethods />

            <div className="mt-16 text-center max-w-3xl mx-auto border-t border-silver pt-8">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <svg className="h-8 w-8 text-dusty-blue mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="text-lg font-serif font-bold text-deep-navy">Our Promise to You</h3>
                    <p className="text-soft-gray text-sm">
                        Each memorial is treated with dignity, privacy, and respect.
                        You may upgrade a memorial at any time. No memorial is ever deleted without your consent.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PricingPage;