import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApiSettings } from '../hooks/useApiSettings';
import { sendPlanUpgradeNotification } from '../services/emailService';
import { MemorialPlan } from '../types';
import { useSiteSettings } from '../hooks/useSiteSettings';


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
    const { isLoggedIn, currentUser, updateCurrentUser } = useAuth();
    const { apiSettings } = useApiSettings();
    const { siteSettings } = useSiteSettings();

    const handleUpgrade = (plan: MemorialPlan) => {
        if (!isLoggedIn || !currentUser) {
            alert('Please log in or sign up to upgrade your plan.');
            return;
        }

        if (currentUser.plan === plan) {
            alert(`You are already on the ${plan} plan.`);
            return;
        }

        // In a real app, this would trigger a Stripe Checkout flow.
        // Here, we just update the user's state and send a notification.
        updateCurrentUser({ plan });
        sendPlanUpgradeNotification(currentUser, plan, apiSettings, siteSettings.siteName);
        alert(`Congratulations! You have been upgraded to the ${plan} plan. A confirmation email has been simulated (check your browser's developer console).`);
    };

    const plans = [
        {
            name: 'Free',
            price: '$0',
            frequency: 'forever',
            description: 'A beautiful, simple memorial to share with close family and friends.',
            features: [
                { text: 'Basic memorial page', included: true },
                { text: '5 photos max', included: true },
                { text: 'Text tributes', included: true },
                { text: 'Basic theme', included: true },
                { text: 'Videos & audio', included: false },
                { text: 'AI search results', included: false },
                { text: 'Music playlist', included: false },
            ],
            cta: 'Get Started',
            isFeatured: false,
        },
        {
            name: 'Premium',
            price: '$4.99',
            frequency: '/ month',
            description: 'Unlock powerful features to create a rich, interactive memorial.',
            features: [
                { text: 'Unlimited photos', included: true },
                { text: 'Videos & audio', included: true },
                { text: 'Custom theme', included: true },
                { text: 'AI search results', included: true },
                { text: 'Music playlist', included: true },
                { text: 'Text tributes', included: true },
                { text: 'Basic memorial page', included: true },
            ],
            cta: 'Choose Premium',
            isFeatured: true,
        },
        {
            name: 'Eternal',
            price: '$99',
            frequency: 'one-time',
            description: 'A permanent, lasting tribute with all features included, forever.',
            features: [
                { text: 'All Premium features', included: true },
                { text: 'No renewal', included: true },
                { text: 'Permanent hosting', included: true },
                { text: 'Priority support', included: true },
                { text: 'Unlimited photos', included: true },
                { text: 'Videos & audio', included: true },
                { text: 'Custom theme', included: true },
            ],
            cta: 'Choose Eternal',
            isFeatured: false,
        },
    ];

    return (
        <div className="animate-fade-in">
            <div className="text-center bg-white p-8 rounded-lg shadow-sm mb-8 border border-silver">
                <h1 className="text-4xl font-serif font-bold text-deep-navy mb-2">Our Plans</h1>
                <p className="text-lg text-soft-gray max-w-2xl mx-auto">
                    Choose the plan that best fits your needs to honor and celebrate the life of your loved one.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
                {plans.map((plan) => (
                    <div key={plan.name} className={`bg-white rounded-lg shadow-sm border ${plan.isFeatured ? 'border-dusty-blue' : 'border-silver'} p-8 flex flex-col`}>
                        {plan.isFeatured && (
                            <div className="text-center mb-4">
                                <span className="bg-dusty-blue text-white text-sm font-bold px-4 py-1 rounded-full">Most Popular</span>
                            </div>
                        )}
                        <h2 className="text-2xl font-serif text-deep-navy font-bold text-center">{plan.name}</h2>
                        <div className="text-center my-4">
                            <span className="text-4xl font-bold text-deep-navy">{plan.price}</span>
                            <span className="text-soft-gray">{plan.frequency}</span>
                        </div>
                        <p className="text-center text-soft-gray mb-6 flex-grow">{plan.description}</p>
                        
                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature) => (
                                <li key={feature.text} className="flex items-center space-x-3">
                                    {feature.included ? <CheckIcon /> : <XIcon />}
                                    <span className="text-deep-navy/90">{feature.text}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-auto">
                           {plan.name === 'Free' ? (
                                <Link
                                    to="/create"
                                    className={`w-full text-center block font-bold py-3 px-4 rounded-lg transition duration-300 bg-silver text-deep-navy hover:bg-soft-gray/80`}
                                >
                                    {plan.cta}
                                </Link>
                            ) : (
                                <button
                                    onClick={() => handleUpgrade(plan.name.toLowerCase() as MemorialPlan)}
                                    className={`w-full text-center block font-bold py-3 px-4 rounded-lg transition duration-300 ${plan.isFeatured ? 'bg-dusty-blue text-white hover:opacity-90' : 'bg-silver text-deep-navy hover:bg-soft-gray/80'}`}
                                >
                                    {plan.cta}
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <PaymentMethods />
            <p className="text-center text-sm text-soft-gray mt-2">
                For Stripe integration, these buttons would link to a Stripe Checkout session.
            </p>
        </div>
    );
};

export default PricingPage;