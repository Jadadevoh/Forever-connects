import React, { ReactNode, useState } from 'react';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { FeatureName } from '../config/features';
import UpgradeModal from './UpgradeModal';

interface FeatureGateProps {
    feature: FeatureName;
    children: ReactNode;
    fallback?: ReactNode;
    showUpgradePrompt?: boolean;
    onUpgradeClick?: () => void;
}

/**
 * Component that conditionally renders content based on feature access
 * Shows upgrade prompt if user doesn't have access
 */
const FeatureGate: React.FC<FeatureGateProps> = ({
    feature,
    children,
    fallback,
    showUpgradePrompt = true,
    onUpgradeClick,
}) => {
    const { hasFeature, getFeature, getMinimumPlan } = useFeatureAccess();
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

    const hasAccess = hasFeature(feature);

    if (hasAccess) {
        return <>{children}</>;
    }

    // User doesn't have access
    if (fallback) {
        return <>{fallback}</>;
    }

    if (showUpgradePrompt) {
        const featureDetails = getFeature(feature);
        const requiredPlan = getMinimumPlan(feature);

        return (
            <>
                <div className="bg-pale-sky/40 border border-silver rounded-lg p-6 text-center">
                    <div className="mb-4">
                        <svg
                            className="mx-auto h-12 w-12 text-dusty-blue"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-deep-navy mb-2">
                        {featureDetails.displayName} - Premium Feature
                    </h3>
                    <p className="text-soft-gray mb-4">{featureDetails.description}</p>
                    <p className="text-sm text-deep-navy/80 mb-4">
                        Upgrade to <span className="font-bold capitalize">{requiredPlan}</span> to unlock this
                        feature.
                    </p>
                    <button
                        onClick={() => {
                            if (onUpgradeClick) {
                                onUpgradeClick();
                            } else {
                                setIsUpgradeModalOpen(true);
                            }
                        }}
                        className="px-6 py-2 bg-dusty-blue text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Upgrade Now
                    </button>
                </div>
                <UpgradeModal
                    isOpen={isUpgradeModalOpen}
                    onClose={() => setIsUpgradeModalOpen(false)}
                    reason={`to access ${featureDetails.displayName}`}
                />
            </>
        );
    }

    return null;
};

export default FeatureGate;
