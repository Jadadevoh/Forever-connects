import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MemorialPlan } from '../types';
import { getFeaturesForPlan } from '../config/features';

const PaymentSuccessPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { currentUser } = useAuth();
    const plan = (searchParams.get('plan') || currentUser?.plan) as MemorialPlan;

    useEffect(() => {
        // Scroll to top on mount
        window.scrollTo(0, 0);
    }, []);

    const features = plan && plan !== 'free' ? getFeaturesForPlan(plan) : [];

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="bg-white p-8 sm:p-12 rounded-lg shadow-sm border border-silver text-center">
                {/* Success Icon */}
                <div className="mb-6">
                    <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                            className="h-10 w-10 text-green-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                </div>

                {/* Success Message */}
                <h1 className="text-4xl font-serif font-bold text-deep-navy mb-4">Payment Successful!</h1>
                <p className="text-lg text-soft-gray mb-8">
                    Thank you for upgrading to the <span className="font-semibold capitalize text-deep-navy">{plan}</span> plan.
                </p>

                {/* Plan Details */}
                {plan && plan !== 'free' && (
                    <div className="bg-pale-sky/40 p-6 rounded-lg border border-silver mb-8 text-left">
                        <h2 className="text-xl font-serif font-bold text-deep-navy mb-4 text-center">
                            Your New Features
                        </h2>
                        <ul className="space-y-3">
                            {features.map(feature => (
                                <li key={feature.name} className="flex items-start">
                                    <svg
                                        className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <span className="font-medium text-deep-navy">{feature.displayName}</span>
                                        <p className="text-sm text-soft-gray">{feature.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Confirmation Details */}
                <div className="bg-white border border-silver rounded-lg p-6 mb-8 text-left">
                    <h3 className="font-semibold text-deep-navy mb-3">Confirmation Details</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-soft-gray">Email:</span>
                            <span className="text-deep-navy font-medium">{currentUser?.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-soft-gray">Plan:</span>
                            <span className="text-deep-navy font-medium capitalize">{plan}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-soft-gray">Date:</span>
                            <span className="text-deep-navy font-medium">
                                {new Date().toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-soft-gray mt-4">
                        A confirmation email has been sent to your email address.
                    </p>
                </div>

                {/* Next Steps */}
                <div className="space-y-4">
                    <h3 className="font-semibold text-deep-navy mb-3">What's Next?</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Link
                            to="/create"
                            className="px-6 py-3 bg-dusty-blue text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                        >
                            Create Memorial
                        </Link>
                        <Link
                            to="/dashboard"
                            className="px-6 py-3 bg-white border-2 border-dusty-blue text-dusty-blue font-bold rounded-lg hover:bg-pale-sky transition-colors"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>

                {/* Support Link */}
                <div className="mt-8 pt-6 border-t border-silver">
                    <p className="text-sm text-soft-gray">
                        Need help?{' '}
                        <Link to="/contact" className="text-dusty-blue hover:underline font-medium">
                            Contact Support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccessPage;
