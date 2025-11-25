

export type GalleryItemType = 'image' | 'video' | 'audio' | 'document' | 'link';
export type MemorialPlan = 'free' | 'premium' | 'eternal';

export interface User {
  id: string;
  name: string;
  email: string;
  plan: MemorialPlan;
  role?: 'user' | 'admin';
}

interface BaseGalleryItem {
  id: string;
  type: GalleryItemType;
  caption?: string;
}

export interface MediaItem extends BaseGalleryItem {
  type: 'image' | 'video' | 'audio' | 'document';
  dataUrl: string; // Base64 encoded file data
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
  dataUrl: string; // Base64 encoded image data
  caption?: string;
}

export interface Tribute {
  id: string;
  author: string;
  message: string;
  createdAt: string; // ISO date string
  photo?: Photo;
  likes: number;
}

export interface Donation {
  id: string;
  name: string; // 'Anonymous' if isAnonymous is true
  amount: number;
  message: string;
  isAnonymous: boolean;
  date: string; // ISO date string
}

export interface DonationInfo {
  isEnabled: boolean;
  recipient: string;
  goal: number; // 0 if not set
  description: string;
  showDonorWall: boolean;
  suggestedAmounts: number[];
  purpose: string;
}

export interface EmailSettings {
  senderName: string;
  replyToEmail: string;
  headerImageUrl: string; // dataUrl of the logo
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
  theme: string; // e.g., 'classic-rose-classic'
  plan: MemorialPlan;
  donationInfo: DonationInfo;
  donations: Donation[];
  emailSettings: EmailSettings;
  status: 'draft' | 'active' | 'blocked';
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
    name: string; // e.g., 'classic-rose-classic'
    title: string; // e.g., 'Classic Rose (Classic)'
    description: string;
    colorTheme: string; // 'classic-rose'
    layout: 'classic' | 'story';
    colors: {
        bg: string;
        primary: string;
        text: string;
    };
}