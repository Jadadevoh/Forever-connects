export interface SiteSettings {
  siteName: string;
  logoUrl: string;
  heroImageUrl: string;
}

export type GalleryItemType = 'image' | 'video' | 'audio' | 'document' | 'link';
export type MemorialPlan = 'free' | 'premium' | 'eternal';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: MemorialPlan;
  role?: 'user' | 'admin';
  createdAt?: number; 
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
  message: string;
  createdAt: number;
  photo?: Photo;
  likes: number;
}

export interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  message: string;
  isAnonymous: boolean;
  date: number;
  type: 'one-time' | 'monthly';
  payoutStatus: 'pending' | 'paid';
}

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
  headerImageUrl: string;
  footerMessage: string;
}

export interface Memorial {
  id:string;
  userId?: string;
  slug: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  birthDate: string;
  deathDate: string;
  gender?: string;
  city: string;
  state?: string;
  country: string;
  causeOfDeath: string[];
  isCauseOfDeathPrivate: boolean;
  profileImage: Photo;
  biography: string;
  gallery: GalleryItem[];
  tributes: Tribute[];
  theme: string;
  plan: MemorialPlan;
  donationInfo: DonationInfo;
  donations: Donation[];
  emailSettings: EmailSettings;
  status: 'draft' | 'active' | 'blocked';
  createdAt?: number;
}

export interface MemorialCreationData {
  firstName: string;
  middleName: string;
  lastName: string;
  birthDate: string;
  deathDate: string;
  gender: string;
  city: string;
  state: string;
  country: string;
  causeOfDeath: string[];
  isCauseOfDeathPrivate: boolean;
  relationship: string;
  profileImage: Photo | null;
  biography: string;
  gallery: GalleryItem[];
  plan: MemorialPlan;
  donationInfo: DonationInfo;
  emailSettings: EmailSettings;
}

export interface Theme {
    name: string;
    title: string;
    description: string;
    colorTheme: string;
    layout: 'classic' | 'story';
    colors: {
        bg: string;
        primary: string;
        text: string;
    };
}