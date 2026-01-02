import { useAuth } from './useAuth';
import { MemorialPlan } from '../types';
import {
    FeatureName,
    hasFeatureAccess as checkFeatureAccess,
    getRequiredPlan,
    requiresUpgrade as checkRequiresUpgrade,
    getPlanLimits,
    FEATURES,
} from '../config/features';
import { useSiteSettings } from './useSiteSettings';

/**
 * Hook for checking feature access based on user's plan
 */
export function useFeatureAccess() {
    const { currentUser } = useAuth();
    const { siteSettings } = useSiteSettings();
    const userPlan: MemorialPlan = 'free'; // User-level plans are deprecated, default to free for legacy calls

    /**
     * Check if the current user has access to a feature
     */
    const hasFeature = (featureName: FeatureName, planToCheck?: MemorialPlan): boolean => {
        // Use provided plan, or fallback to 'free' since user-level plans are deprecated
        const plan = planToCheck || 'free';

        // Check for overrides in site settings first
        const overrides = siteSettings.featureOverrides?.[featureName];
        if (overrides) {
            return overrides.includes(plan);
        }
        // Fallback to static config
        return checkFeatureAccess(plan, featureName);
    };

    /**
     * Check if the user needs to upgrade to access a feature
     */
    const requiresUpgrade = (featureName: FeatureName): boolean => {
        return checkRequiresUpgrade(userPlan, featureName);
    };

    /**
     * Get the minimum plan required for a feature
     */
    const getMinimumPlan = (featureName: FeatureName): MemorialPlan => {
        return getRequiredPlan(featureName);
    };

    /**
     * Get the current plan limits
     */
    const planLimits = getPlanLimits(userPlan);

    /**
     * Get feature details
     */
    const getFeature = (featureName: FeatureName) => {
        return FEATURES[featureName];
    };

    /**
     * Check if user can upload more photos
     */
    const canUploadPhotos = (currentCount: number): boolean => {
        return currentCount < planLimits.maxPhotos;
    };

    /**
     * Check if user can upload videos
     */
    const canUploadVideos = (): boolean => {
        return planLimits.maxVideos > 0;
    };

    /**
     * Check if user can upload audio
     */
    const canUploadAudio = (): boolean => {
        return planLimits.maxAudio > 0;
    };

    /**
     * Get remaining photo upload slots
     */
    const getRemainingPhotoSlots = (currentCount: number): number => {
        if (planLimits.maxPhotos === Infinity) return Infinity;
        return Math.max(0, planLimits.maxPhotos - currentCount);
    };

    return {
        userPlan,
        hasFeature,
        requiresUpgrade,
        getMinimumPlan,
        getFeature,
        planLimits,
        canUploadPhotos,
        canUploadVideos,
        canUploadAudio,
        getRemainingPhotoSlots,
    };
}
