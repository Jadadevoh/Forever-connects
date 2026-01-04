import React, { useState, useMemo } from 'react';
import { Memorial, Donation, User } from '../types';
import { useMemorials } from '../hooks/useMemorials';
import { useApiSettings } from '../hooks/useApiSettings';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { sendDonationReceipt, sendDonationNotification } from '../services/emailService';

// Stripe Imports
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { functions } from '../firebase';
import { httpsCallable } from 'firebase/functions';

// --- Types ---
interface DonationFormData {
    amount: number;
    name: string;
    email: string;
    message: string;
    isAnonymous: boolean;
    type: 'one-time' | 'monthly';
}

interface DonationFormUIProps {
    memorial: Memorial;
    isProcessing: boolean;
    error: string | null;
    onSubmit: (data: DonationFormData) => void;
    paymentElement?: React.ReactNode;
}

// --- Shared UI Component ---
const DonationFormUI: React.FC<DonationFormUIProps> = ({ memorial, isProcessing, error, onSubmit, paymentElement }) => {
    const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
    const [amount, setAmount] = useState(50);
    const [customAmount, setCustomAmount] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);

    // Derived state for display
    const totalDonations = memorial.donations.reduce((sum, d) => sum + d.amount, 0);
    const goalProgress = memorial.donationInfo.goal > 0 ? (totalDonations / memorial.donationInfo.goal) * 100 : 0;
    const presetAmounts = memorial.donationInfo.suggestedAmounts?.length > 0
        ? memorial.donationInfo.suggestedAmounts
        : [25, 50, 100, 250];

    const handleAmountClick = (value: number) => {
        setAmount(value);
        setCustomAmount('');
    };

    const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCustomAmount(e.target.value);
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) {
            setAmount(value);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalAmount = customAmount ? parseInt(customAmount, 10) : amount;
        if (!name.trim() || !email.trim() || !finalAmount || finalAmount <= 0) {
            alert("Please fill in your name, email, and a valid donation amount.");
            return;
        }

        onSubmit({
            amount: finalAmount,
            name: isAnonymous ? 'Anonymous' : name,
            email,
            message,
            isAnonymous,
            type: donationType
        });
    };

    const finalAmount = customAmount ? parseInt(customAmount, 10) : amount;
    const donationText = `$${finalAmount > 0 ? finalAmount : amount}${donationType === 'monthly' ? ' per month' : ''}`;

    return (
        <div className="bg-pale-sky/60 p-6 rounded-lg shadow-sm border border-silver grid md:grid-cols-2 gap-8">
            {/* Left Side: Info & Form */}
            <div>
                <div className="flex items-start space-x-4 mb-4">
                    {memorial.profileImage?.url && <img src={memorial.profileImage.url} alt="In memory of" className="w-16 h-16 object-cover rounded-full" />}
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-deep-navy">Support this Memorial</h2>
                        <p className="text-soft-gray text-sm">For: {memorial.donationInfo.recipient}</p>
                        {memorial.donationInfo.purpose && <p className="text-soft-gray text-sm mt-1">Purpose: <span className="font-medium text-deep-navy/90">{memorial.donationInfo.purpose}</span></p>}
                    </div>
                </div>
                <p className="text-deep-navy/90 mb-4">{memorial.donationInfo.description}</p>

                {memorial.donationInfo.goal > 0 && (
                    <div className="mb-4">
                        <div className="flex justify-between text-sm font-medium text-deep-navy mb-1">
                            <span>${totalDonations.toLocaleString()} raised</span>
                            <span>Goal: ${memorial.donationInfo.goal.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-silver rounded-full h-2.5">
                            <div className="bg-dusty-blue h-2.5 rounded-full" style={{ width: `${Math.min(goalProgress, 100)}%` }}></div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleFormSubmit} className="space-y-4">
                    {/* Donation Type */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-silver rounded-lg">
                        <button type="button" onClick={() => setDonationType('one-time')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${donationType === 'one-time' ? 'bg-white text-deep-navy shadow' : 'text-soft-gray'}`}>One-time</button>
                        <button type="button" onClick={() => setDonationType('monthly')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${donationType === 'monthly' ? 'bg-white text-deep-navy shadow' : 'text-soft-gray'}`}>Monthly</button>
                    </div>

                    {/* Amount */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {presetAmounts.map(pa => (
                            <button key={pa} type="button" onClick={() => handleAmountClick(pa)} className={`p-3 text-center font-semibold border rounded-lg transition-colors ${amount === pa && !customAmount ? 'bg-dusty-blue text-white border-dusty-blue' : 'bg-white border-silver hover:border-soft-gray'}`}>
                                ${pa}
                            </button>
                        ))}
                    </div>

                    <input type="number" value={customAmount} onChange={handleCustomAmountChange} placeholder="Custom amount" className="mt-1 block w-full rounded-md bg-white border-silver shadow-sm focus:border-dusty-blue focus:ring-dusty-blue sm:text-sm text-deep-navy px-3 py-2" />

                    {/* Donor Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required className="w-full rounded-md bg-white border border-silver shadow-sm focus:border-dusty-blue focus:ring-dusty-blue sm:text-sm text-deep-navy px-3 py-2" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email (for receipt)" required className="w-full rounded-md bg-white border border-silver shadow-sm focus:border-dusty-blue focus:ring-dusty-blue sm:text-sm text-deep-navy px-3 py-2" />
                    </div>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} placeholder="Leave a short message (optional)" className="w-full rounded-md bg-white border-silver" />

                    <div className="flex items-center">
                        <input id="isAnonymous" type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="h-4 w-4 rounded bg-white border-soft-gray text-dusty-blue focus:ring-dusty-blue" />
                        <label htmlFor="isAnonymous" className="ml-2 block text-sm text-deep-navy/90">Donate Anonymously</label>
                    </div>

                    {paymentElement && (
                        <div className="p-4 bg-white border border-silver rounded-lg">
                            <label className="block text-sm font-medium text-deep-navy mb-2">Card Details</label>
                            {paymentElement}
                        </div>
                    )}

                    <button type="submit" disabled={isProcessing} className="w-full bg-dusty-blue text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed">
                        {isProcessing ? 'Processing...' : `Donate ${donationText}`}
                    </button>
                    <p className="text-xs text-soft-gray text-center">All donations help preserve this memorial and support the family.</p>
                </form>
            </div>

            {/* Right Side: Donor Wall */}
            <div>
                {memorial.donationInfo.showDonorWall && (
                    <div>
                        <h3 className="text-xl font-serif text-deep-navy mb-4">Recent Donors</h3>
                        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                            {memorial.donations.length > 0 ? memorial.donations.map(d => (
                                <div key={d.id} className="p-3 bg-white border border-silver rounded-lg">
                                    <p className="font-semibold text-deep-navy">{d.name} <span className="text-soft-gray font-normal">- ${d.amount.toLocaleString()}</span></p>
                                    {d.message && !d.isAnonymous && <p className="text-sm text-deep-navy/80 italic mt-1">"{d.message}"</p>}
                                </div>
                            )) : (
                                <p className="text-sm text-soft-gray">Be the first to donate.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Stripe Implementation ---
const StripeDonationForm: React.FC<{ memorial: Memorial, onSuccess: () => void }> = ({ memorial, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { addDonation } = useMemorials();
    const { apiSettings } = useApiSettings();
    const { siteSettings } = useSiteSettings();
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (data: DonationFormData) => {
        if (!stripe || !elements) {
            setError("Payment system not ready. Please try again.");
            return;
        }
        setIsProcessing(true);
        setError(null);

        try {
            // 1. Create Payment Intent via Backend
            const createPaymentIntent = httpsCallable(functions, 'createPaymentIntent');
            const response = await createPaymentIntent({
                amount: data.amount * 100, // convert to cents
                currency: 'usd',
                metadata: {
                    memorialId: memorial.id,
                    memorialName: `${memorial.firstName} ${memorial.lastName}`,
                    donorName: data.name,
                    donorEmail: data.email,
                    type: 'donation'
                }
            });
            const { clientSecret } = response.data as { clientSecret: string };

            if (!clientSecret) throw new Error("Failed to initialize payment.");

            // 2. Confirm Card Payment via Stripe
            const cardElement = elements.getElement(CardElement);
            if (!cardElement) throw new Error("Card element not found");

            const paymentResult = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: data.name,
                        email: data.email,
                    },
                },
            });

            if (paymentResult.error) {
                throw new Error(paymentResult.error.message || "Payment failed");
            }

            if (paymentResult.paymentIntent?.status === 'succeeded') {
                // 3. Save Donation
                const donationData: Omit<Donation, 'id'> = {
                    ...data,
                    date: Date.now(),
                    payoutStatus: 'paid', // Confirmed paid by Stripe
                };
                addDonation(memorial.id, donationData);

                // Notifications
                const fullDonationData: Donation = { ...donationData, id: '', payoutStatus: 'paid' };
                sendDonationReceipt(data.email, fullDonationData, memorial, apiSettings, siteSettings.siteName);
                if (memorial.emailSettings.replyToEmail) {
                    const ownerMock: User = { id: memorial.userId || 'owner', displayName: 'Memorial Owner', email: memorial.emailSettings.replyToEmail };
                    sendDonationNotification(fullDonationData, memorial, ownerMock, apiSettings, siteSettings.siteName);
                }

                onSuccess();
            }
        } catch (err: any) {
            console.error("Donation processing error:", err);
            setError(err.message || "An error occurred while processing your donation.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <DonationFormUI
            memorial={memorial}
            isProcessing={isProcessing}
            error={error}
            onSubmit={handleSubmit}
            paymentElement={<CardElement options={{ style: { base: { fontSize: '16px', color: '#1D2D50', '::placeholder': { color: '#aab7c4' } } } }} />}
        />
    );
};

// --- Simulated Implementation (Fallback) ---
const SimulatedDonationForm: React.FC<{ memorial: Memorial, onSuccess: () => void }> = ({ memorial, onSuccess }) => {
    const { addDonation } = useMemorials();
    const { apiSettings } = useApiSettings();
    const { siteSettings } = useSiteSettings();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = (data: DonationFormData) => {
        setIsProcessing(true);
        // Simulate async
        setTimeout(() => {
            const donationData: Omit<Donation, 'id'> = {
                ...data,
                date: Date.now(),
                payoutStatus: 'pending',
            };
            addDonation(memorial.id, donationData);

            // Notifications
            const fullDonationData: Donation = { ...donationData, id: '', payoutStatus: 'pending' };
            sendDonationReceipt(data.email, fullDonationData, memorial, apiSettings, siteSettings.siteName);
            if (memorial.emailSettings.replyToEmail) {
                const ownerMock: User = { id: memorial.userId || 'owner', displayName: 'Memorial Owner', email: memorial.emailSettings.replyToEmail };
                sendDonationNotification(fullDonationData, memorial, ownerMock, apiSettings, siteSettings.siteName);
            }
            setIsProcessing(false);
            onSuccess();
        }, 1000);
    };

    return (
        <DonationFormUI
            memorial={memorial}
            isProcessing={isProcessing}
            error={null}
            onSubmit={handleSubmit}
        // No payment element for simulation implies standard button handling (as per UI logic)
        // But FormUI renders "Donate with Card" via button text logic.
        // We can pass a dummy note if we want.
        />
    );
}

// --- Main Module ---
interface DonationModuleProps {
    memorial: Memorial;
}

const DonationModule: React.FC<DonationModuleProps> = ({ memorial }) => {
    const { apiSettings } = useApiSettings();
    const [submitted, setSubmitted] = useState(false);

    // Initialize Stripe promise only if key exists
    const stripePromise = useMemo(() => {
        if (apiSettings.stripePublicKey) {
            return loadStripe(apiSettings.stripePublicKey);
        }
        return null;
    }, [apiSettings.stripePublicKey]);

    if (submitted) {
        return (
            <div className="bg-pale-sky p-8 rounded-lg shadow-sm border border-silver text-center">
                <h2 className="text-2xl font-serif text-deep-navy">Thank You!</h2>
                <p className="mt-2 text-deep-navy/90">Your generous donation is greatly appreciated.</p>
            </div>
        )
    }

    if (stripePromise) {
        return (
            <Elements stripe={stripePromise}>
                <StripeDonationForm memorial={memorial} onSuccess={() => setSubmitted(true)} />
            </Elements>
        );
    }

    return <SimulatedDonationForm memorial={memorial} onSuccess={() => setSubmitted(true)} />;
};

export default DonationModule;