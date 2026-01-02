import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MemorialPlan } from '../types';
import { useAuth } from '../hooks/useAuth';

interface CheckoutButtonProps {
    plan: MemorialPlan;
    memorialId?: string; // New: Optional because PricingPage might not have it yet
    currentPlan?: MemorialPlan; // New: To check if already upgraded
    className?: string;
    children: React.ReactNode;
    disabled?: boolean;
}

/**
 * Button component that initiates the checkout flow for a specific plan and memorial
 */
const CheckoutButton: React.FC<CheckoutButtonProps> = ({
    plan,
    memorialId,
    currentPlan,
    className = '',
    children,
    disabled = false,
}) => {
    const navigate = useNavigate();
    const { isLoggedIn } = useAuth();

    const handleClick = () => {
        if (!isLoggedIn) {
            // Redirect to signup
            navigate('/signup', { state: { selectedPlan: plan, fromPricing: true } });
            return;
        }

        if (!memorialId) {
            // If from generic Pricing page, redirect to dashboard to select a memorial
            navigate(`/dashboard?upgrade=true&plan=${plan}`, {
                state: { message: `Please select a memorial to upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)}.` }
            });
            return;
        }

        if (currentPlan === plan) {
            alert(`This memorial is already on the ${plan} plan.`);
            return;
        }

        // Navigate to checkout page with memorialId
        navigate(`/checkout/${plan}`, { state: { memorialId } });
    };

    return (
        <button
            onClick={handleClick}
            disabled={disabled}
            className={className}
        >
            {children}
        </button>
    );
};

export default CheckoutButton;
