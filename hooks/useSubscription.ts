import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { MemorialPlan } from '../types';

interface SubscriptionState {
    plan: MemorialPlan;
    isActive: boolean;
    loading: boolean;
    error: string | null;
}

export function useSubscription() {
    const { currentUser } = useAuth();
    const [subscription, setSubscription] = useState<SubscriptionState>({
        plan: 'free',
        isActive: false,
        loading: true,
        error: null,
    });

    useEffect(() => {
        if (!currentUser) {
            setSubscription(prev => ({ ...prev, loading: false }));
            return;
        }

        const subscriptionsRef = collection(db, 'customers', currentUser.id, 'subscriptions');
        const q = query(subscriptionsRef, where('status', 'in', ['active', 'trialing']));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                setSubscription({
                    plan: 'free',
                    isActive: false,
                    loading: false,
                    error: null,
                });
                return;
            }

            // Assume the first active subscription is the relevant one
            const subDoc = snapshot.docs[0];
            const subData = subDoc.data();

            // Map Stripe role/metadata to local plan name
            // Note: You need to set 'firebaseRole' metadata on your Stripe Products/Prices
            // providing values like 'premium' or 'eternal'
            const role = subData.role || subData.metadata?.firebaseRole;

            let plan: MemorialPlan = 'free';
            if (role === 'premium') plan = 'premium';
            if (role === 'eternal') plan = 'eternal';

            setSubscription({
                plan,
                isActive: true,
                loading: false,
                error: null,
            });
        }, (error) => {
            console.error('Error fetching subscription:', error);
            setSubscription(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to load subscription status',
            }));
        });

        return () => unsubscribe();
    }, [currentUser]);

    return subscription;
}
