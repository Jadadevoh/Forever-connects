import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { MemorialPlan } from '../types';
import {
    getPlanPricing,
    createCheckoutSession,
    isStripeConfigured,
} from '../services/stripeService';
import { getFeaturesForPlan } from '../config/features';

const CheckoutPage: React.FC = () => {
    const { plan } = useParams<{ plan: string }>();
    const navigate = useNavigate();
    const { currentUser, isLoggedIn } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const location = useLocation();
    const memorialId = location.state?.memorialId;

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login', { state: { from: `/checkout/${plan}` } });
        }
    }, [isLoggedIn, navigate, plan]);

    if (!plan || (plan !== 'premium' && plan !== 'eternal')) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <h1 className="text-3xl font-serif font-bold text-deep-navy mb-4">Invalid Plan</h1>
                <p className="text-soft-gray mb-6">The selected plan is not valid.</p>
                <Link
                    to="/pricing"
                    className="px-6 py-3 bg-dusty-blue text-white font-bold rounded-lg hover:opacity-90"
                >
                    View Pricing Plans
                </Link>
            </div>
        );
    }

    const selectedPlan = plan as Exclude<MemorialPlan, 'free'>;
    const pricing = getPlanPricing(selectedPlan);
    const features = getFeaturesForPlan(selectedPlan);
    const stripeConfigured = isStripeConfigured();

    const handleCheckout = async () => {
        if (!currentUser) return;

        setIsProcessing(true);
        setError('');

        try {
            const { url } = await createCheckoutSession(selectedPlan, currentUser.id, memorialId);
            // Redirect to Stripe Checkout
            window.location.assign(url);
        } catch (err: any) {
            console.error('Checkout error:', err);
            setError(err.message || 'An error occurred initializing checkout.');
            setIsProcessing(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-serif font-bold text-deep-navy mb-2">Complete Your Purchase</h1>
                <p className="text-lg text-soft-gray">
                    Review your order and proceed to secure payment
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div className="bg-white p-8 rounded-lg shadow-sm border border-silver">
                    <h2 className="text-2xl font-serif font-bold text-deep-navy mb-6">Order Summary</h2>

                    <div className="mb-6 pb-6 border-b border-silver">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-semibold text-deep-navy capitalize">{selectedPlan} Plan</span>
                            <span className="text-2xl font-bold text-deep-navy">${pricing.price}</span>
                        </div>
                        <p className="text-sm text-soft-gray">
                            {pricing.interval === 'one-time' ? 'One-time payment' : `Billed ${pricing.interval}ly`}
                        </p>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-semibold text-deep-navy mb-3">Included Features:</h3>
                        <ul className="space-y-2">
                            {features.map(feature => (
                                <li key={feature.name} className="flex items-start">
                                    <svg
                                        className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span className="text-deep-navy/90 text-sm">{feature.displayName}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-6 border-t border-silver">
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span className="text-deep-navy">Total</span>
                            <span className="text-deep-navy">${pricing.price.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-soft-gray mt-1">
                            {pricing.interval === 'one-time' ? 'Lifetime access' : 'Cancel anytime'}
                        </p>
                    </div>
                </div>

                {/* Payment Action */}
                <div className="bg-white p-8 rounded-lg shadow-sm border border-silver flex flex-col justify-center">
                    <h2 className="text-2xl font-serif font-bold text-deep-navy mb-6">Payment Method</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {!stripeConfigured && (
                        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800">
                                <strong>Warning:</strong> Stripe keys are not configured in your environment variables. Checkout will fail.
                            </p>
                        </div>
                    )}

                    <div className="mb-8 text-center text-soft-gray">
                        <p className="mb-4">You will be redirected to Stripe to securely complete your payment.</p>
                        <div className="flex justify-center space-x-2">
                            {/* Simple card icons/placeholders */}
                            <div className="h-8 w-12 bg-gray-100 rounded border border-gray-200"></div>
                            <div className="h-8 w-12 bg-gray-100 rounded border border-gray-200"></div>
                            <div className="h-8 w-12 bg-gray-100 rounded border border-gray-200"></div>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="w-full py-4 bg-dusty-blue text-white font-bold rounded-lg hover:opacity-90 disabled:bg-soft-gray disabled:cursor-not-allowed transition-opacity shadow-lg transform hover:-translate-y-0.5"
                    >
                        {isProcessing ? 'Redirecting...' : 'Proceed to Checkout'}
                    </button>

                    <p className="text-xs text-soft-gray text-center mt-6">
                        By continuing, you agree to our{' '}
                        <Link to="/terms" className="text-dusty-blue hover:underline">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-dusty-blue hover:underline">
                            Privacy Policy
                        </Link>
                        .
                    </p>

                    <div className="mt-8 pt-6 border-t border-silver text-center">
                        <Link to="/pricing" className="text-sm text-soft-gray hover:text-deep-navy">
                            ← Back to Pricing
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;

