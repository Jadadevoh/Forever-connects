import { MemorialPlan } from '../types';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

/**
 * Stripe service for handling payment processing
 */

export interface PlanPricing {
    plan: MemorialPlan;
    price: number;
    currency: string;
    interval: 'one-time' | 'month' | 'year';
    stripePriceId?: string;
}

/**
 * Plan pricing configuration
 */
export const PLAN_PRICING: Record<Exclude<MemorialPlan, 'free'>, PlanPricing> = {
    premium: {
        plan: 'premium',
        price: 4.99,
        currency: 'USD',
        interval: 'month',
        stripePriceId: import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID,
    },
    eternal: {
        plan: 'eternal',
        price: 99,
        currency: 'USD',
        interval: 'one-time',
        stripePriceId: import.meta.env.VITE_STRIPE_ETERNAL_PRICE_ID,
    },
};

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
    return !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
}

/**
 * Get pricing for a specific plan
 */
export function getPlanPricing(plan: Exclude<MemorialPlan, 'free'>): PlanPricing {
    return PLAN_PRICING[plan];
}

/**
 * Format price for display
 */
export function formatPrice(pricing: PlanPricing): string {
    const formattedAmount = pricing.price.toFixed(2);
    const intervalText = pricing.interval === 'one-time' ? 'one-time' : `/ ${pricing.interval}`;
    return `$${formattedAmount} ${intervalText}`;
}

/**
 * Create a checkout session
 * Writes to Firestore 'customers/{uid}/checkout_sessions' which triggers the Stripe extension
 */
export async function createCheckoutSession(
    plan: Exclude<MemorialPlan, 'free'>,
    userId: string
): Promise<{ sessionId: string; url: string }> {
    if (!userId) throw new Error('User ID is required');

    const priceId = PLAN_PRICING[plan].stripePriceId;

    if (!priceId) {
        throw new Error(`Price ID not configured for plan: ${plan}`);
    }

    try {
        const checkoutSessionsRef = collection(db, 'customers', userId, 'checkout_sessions');

        const docRef = await addDoc(checkoutSessionsRef, {
            price: priceId,
            success_url: window.location.origin + `/payment/success?plan=${plan}`,
            cancel_url: window.location.origin + '/payment/cancel',
        });

        // Wait for the checkout session to be created by the extension
        return new Promise((resolve, reject) => {
            const unsubscribe = onSnapshot(docRef, (snap) => {
                const data = snap.data();
                if (data?.error) {
                    unsubscribe();
                    reject(new Error(data.error.message));
                }
                if (data?.url) {
                    unsubscribe();
                    resolve({ sessionId: snap.id, url: data.url });
                }
            });
        });
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        throw new Error(error.message || 'Failed to create checkout session');
    }
}

