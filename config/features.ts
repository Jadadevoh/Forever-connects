import { MemorialPlan } from '../types';

/**
 * Feature names available in the application
 */
export type FeatureName =
    | 'unlimited_photos'
    | 'video_upload'
    | 'audio_upload'
    | 'custom_themes'
    | 'ai_biography'
    | 'ai_theme_suggestions'
    | 'music_playlist'
    | 'priority_support'
    | 'permanent_hosting'
    | 'basic_memorial'
    | 'text_tributes';

/**
 * Feature configuration defining which plans have access to each feature
 */
export interface FeatureConfig {
    name: FeatureName;
    displayName: string;
    description: string;
    availableIn: MemorialPlan[];
    requiredPlan: MemorialPlan; // Minimum plan required
}

/**
 * Complete feature catalog with plan requirements
 */
export const FEATURES: Record<FeatureName, FeatureConfig> = {
    basic_memorial: {
        name: 'basic_memorial',
        displayName: 'Basic Memorial Page',
        description: 'Create a simple memorial page',
        availableIn: ['free', 'premium', 'eternal'],
        requiredPlan: 'free',
    },
    text_tributes: {
        name: 'text_tributes',
        displayName: 'Text Tributes',
        description: 'Allow visitors to leave written tributes',
        availableIn: ['free', 'premium', 'eternal'],
        requiredPlan: 'free',
    },
    unlimited_photos: {
        name: 'unlimited_photos',
        displayName: 'Unlimited Photos',
        description: 'Upload unlimited photos to the gallery',
        availableIn: ['premium', 'eternal'],
        requiredPlan: 'premium',
    },
    video_upload: {
        name: 'video_upload',
        displayName: 'Video Upload',
        description: 'Upload and share video memories',
        availableIn: ['premium', 'eternal'],
        requiredPlan: 'premium',
    },
    audio_upload: {
        name: 'audio_upload',
        displayName: 'Audio Upload',
        description: 'Upload audio recordings and voice messages',
        availableIn: ['premium', 'eternal'],
        requiredPlan: 'premium',
    },
    custom_themes: {
        name: 'custom_themes',
        displayName: 'Custom Themes',
        description: 'Choose from premium memorial themes',
        availableIn: ['premium', 'eternal'],
        requiredPlan: 'premium',
    },
    ai_biography: {
        name: 'ai_biography',
        displayName: 'AI Biography Generator',
        description: 'Generate beautiful biographies with AI assistance',
        availableIn: ['premium', 'eternal'],
        requiredPlan: 'premium',
    },
    ai_theme_suggestions: {
        name: 'ai_theme_suggestions',
        displayName: 'AI Theme Suggestions',
        description: 'Get personalized theme recommendations',
        availableIn: ['premium', 'eternal'],
        requiredPlan: 'premium',
    },
    music_playlist: {
        name: 'music_playlist',
        displayName: 'Music Playlist',
        description: 'Add a custom music playlist to the memorial',
        availableIn: ['premium', 'eternal'],
        requiredPlan: 'premium',
    },
    priority_support: {
        name: 'priority_support',
        displayName: 'Priority Support',
        description: 'Get priority customer support',
        availableIn: ['eternal'],
        requiredPlan: 'eternal',
    },
    permanent_hosting: {
        name: 'permanent_hosting',
        displayName: 'Permanent Hosting',
        description: 'Memorial hosted permanently with no renewal needed',
        availableIn: ['eternal'],
        requiredPlan: 'eternal',
    },
};

export const FEATURE_List = Object.values(FEATURES);

/**
 * Plan limits and restrictions
 */
export const PLAN_LIMITS = {
    free: {
        maxPhotos: 5,
        maxVideos: 0,
        maxAudio: 0,
        canUseAI: false,
        canUseCustomThemes: false,
    },
    premium: {
        maxPhotos: Infinity,
        maxVideos: Infinity,
        maxAudio: Infinity,
        canUseAI: true,
        canUseCustomThemes: true,
    },
    eternal: {
        maxPhotos: Infinity,
        maxVideos: Infinity,
        maxAudio: Infinity,
        canUseAI: true,
        canUseCustomThemes: true,
    },
} as const;

/**
 * Check if a plan has access to a specific feature
 */
export function hasFeatureAccess(userPlan: MemorialPlan, featureName: FeatureName): boolean {
    const feature = FEATURES[featureName];
    return feature.availableIn.includes(userPlan);
}

/**
 * Get the minimum plan required for a feature
 */
export function getRequiredPlan(featureName: FeatureName): MemorialPlan {
    return FEATURES[featureName].requiredPlan;
}

/**
 * Get all features available for a specific plan
 */
export function getFeaturesForPlan(plan: MemorialPlan): FeatureConfig[] {
    return Object.values(FEATURES).filter(feature => feature.availableIn.includes(plan));
}

/**
 * Check if a plan upgrade is required for a feature
 */
export function requiresUpgrade(userPlan: MemorialPlan, featureName: FeatureName): boolean {
    return !hasFeatureAccess(userPlan, featureName);
}

/**
 * Get plan limits for a specific plan
 */
export function getPlanLimits(plan: MemorialPlan) {
    return PLAN_LIMITS[plan];
}
