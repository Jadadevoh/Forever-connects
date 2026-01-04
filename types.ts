import { FeatureName } from './config/features';

export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  heroImageUrl: string;
  aboutHeroImageUrl?: string;
  featureOverrides?: Record<FeatureName, MemorialPlan[]>;
}

export type GalleryItemType = 'image' | 'video' | 'audio' | 'document' | 'link';
export type MemorialPlan = 'free' | 'premium' | 'eternal';

export interface DonationInfo {
  isEnabled: boolean;
  recipient: string;
  goal: number;
  description: string;
  showDonorWall: boolean;
  suggestedAmounts: number[];
  purpose: string;
}

export interface EmailSettings {
  senderName: string;
  replyToEmail: string;
  headerImageUrl?: string;
  footerMessage?: string;
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  name?: string; // Legacy/Convenience
  photoURL?: string;
  followedMemorials?: string[];
  role?: 'user' | 'admin';
  createdAt?: number;
  plan?: string;
}

interface BaseGalleryItem {
  id: string;
  type: GalleryItemType;
  caption?: string;
}

export interface MediaItem extends BaseGalleryItem {
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  fileName: string;
}

export interface LinkItem extends BaseGalleryItem {
  type: 'link';
  url: string;
  title: string;
}

export type GalleryItem = MediaItem | LinkItem;

export interface Photo {
  id: string;
  url: string;
  caption?: string;
}

export interface Tribute {
  id: string;
  author: string;
  message?: string; // Legacy support
  content: string; // New field
  createdAt?: number; // Legacy support
  date: string; // New field (ISO string)
  photo?: Photo;
  likes: number;
}

export interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  message?: string;
  date: number;
  isAnonymous: boolean;
  type: 'one-time' | 'monthly';
  payoutStatus: 'pending' | 'paid';
}

export interface Memorial {
  id: string;
  userId: string;
  slug: string;
  status: 'draft' | 'active';
  plan: MemorialPlan;
  firstName: string;
  middleName?: string;
  lastName: string;
  birthDate: string;
  deathDate: string;
  gender?: string;
  city: string;
  state?: string;
  country: string;
  restingPlace?: string;
  causeOfDeath: string[];
  isCauseOfDeathPrivate: boolean;
  profileImage: Photo;
  biography: string;
  gallery: GalleryItem[];
  tributes: Tribute[];
  theme: string;
  layout?: string;
  colorPalette?: string;
  emailSettings: EmailSettings;
  donationInfo: DonationInfo;
  donations: Donation[];
  followers?: string[];
  aiHighlights?: string[];
  createdAt: number;
}

export interface MemorialCreationData extends Omit<Memorial, 'id' | 'userId' | 'slug' | 'status' | 'tributes' | 'followers' | 'profileImage' | 'createdAt'> {
  relationship: string;
  profileImage: Photo | null;
  layout?: string;
  colorPalette?: string;
}

export interface Theme {
  name: string;
  title: string;
  description: string;
  colorTheme: string;
  layout: 'classic' | 'story' | 'personal-touch' | 'modern-minimal' | 'timeless' | 'serenity' | 'ultra-minimal';
  colors: {
    bg: string;
    primary: string;
    text: string;
  };
}