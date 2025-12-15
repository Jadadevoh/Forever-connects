import React, { useState } from 'react';
import { Memorial, Donation, User } from '../types';
import { useMemorials } from '../hooks/useMemorials';
import { useApiSettings } from '../hooks/useApiSettings';
import { sendDonationReceipt, sendDonationNotification } from '../services/emailService';
import { useSiteSettings } from '../hooks/useSiteSettings';

interface DonationModuleProps {
    memorial: Memorial;
}

const DonationModule: React.FC<DonationModuleProps> = ({ memorial }) => {
    const { addDonation } = useMemorials();
    const { apiSettings } = useApiSettings();
    const { siteSettings } = useSiteSettings();

    const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time');
    const [amount, setAmount] = useState(50);
    const [customAmount, setCustomAmount] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [submitted, setSubmitted] = useState(false);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalAmount = customAmount ? parseInt(customAmount, 10) : amount;
        if (!name.trim() || !email.trim() || !finalAmount || finalAmount <= 0) {
            alert("Please fill in your name, email, and a valid donation amount.");
            return;
        }

        const donationData: Omit<Donation, 'id'> = {
            name: isAnonymous ? 'Anonymous' : name,
            email: email,
            amount: finalAmount,
            message: message,
            isAnonymous: isAnonymous,
            date: Date.now(),
            type: donationType,
            payoutStatus: 'pending',
        };

        addDonation(memorial.id, donationData);

        // --- Email Notifications ---
        const fullDonationData: Donation = { ...donationData, id: '', payoutStatus: 'pending' }; // for receipt
        sendDonationReceipt(email, fullDonationData, memorial, apiSettings, siteSettings.siteName);
        
        if (memorial.emailSettings.replyToEmail) {
             const ownerMock: User = {
                id: memorial.userId || 'owner',
                name: memorial.emailSettings.senderName || 'Memorial Owner',
                email: memorial.emailSettings.replyToEmail,
                plan: 'free',
                role: 'user'
             };
            sendDonationNotification(fullDonationData, memorial, ownerMock, apiSettings, siteSettings.siteName);
        }
        // --- End Notifications ---

        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="bg-pale-sky p-8 rounded-lg shadow-sm border border-silver text-center">
                 <h2 className="text-2xl font-serif text-deep-navy">Thank You!</h2>
                 <p className="mt-2 text-deep-navy/90">Your generous donation is greatly appreciated.</p>
            </div>
        )
    }

    const finalAmount = customAmount ? parseInt(customAmount, 10) : amount;
    const donationText = `$${finalAmount > 0 ? finalAmount : amount}${donationType === 'monthly' ? ' per month' : ''}`;

    return (
        <div className="bg-pale-sky/60 p-6 rounded-lg shadow-sm border border-silver grid md:grid-cols-2 gap-8">
            {/* Left Side: Info & Form */}
            <div>
                 <div className="flex items-start space-x-4 mb-4">
                    <img src={memorial.profileImage.url} alt="In memory of" className="w-16 h-16 object-cover rounded-full" />
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
                
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your Name" required className="w-full rounded-md bg-white border-silver" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Email (for receipt)" required className="w-full rounded-md bg-white border-silver" />
                    </div>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={2} placeholder="Leave a short message (optional)" className="w-full rounded-md bg-white border-silver" />
                    
                    <div className="flex items-center">
                        <input id="isAnonymous" type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="h-4 w-4 rounded bg-white border-soft-gray text-dusty-blue focus:ring-dusty-blue" />
                        <label htmlFor="isAnonymous" className="ml-2 block text-sm text-deep-navy/90">Donate Anonymously</label>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-silver">
                        <button type="submit" className="w-full bg-dusty-blue text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                            Donate {donationText} with Card
                        </button>

                        {apiSettings.paypalClientId && (
                            <button type="submit" className="w-full bg-[#00457C] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                                Donate {donationText} with PayPal
                            </button>
                        )}
                        {apiSettings.enableGooglePay && (
                             <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                                Donate {donationText} with Google Pay
                            </button>
                        )}
                        {apiSettings.enableApplePay && (
                             <button type="submit" className="w-full bg-black text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                                Donate {donationText} with Apple Pay
                            </button>
                        )}
                        {apiSettings.enableAch && (
                             <button type="submit" className="w-full bg-white text-deep-navy border border-silver font-bold py-3 rounded-lg hover:bg-silver transition-colors">
                                Donate {donationText} with Bank (ACH)
                            </button>
                        )}
                    </div>
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

export default DonationModule;