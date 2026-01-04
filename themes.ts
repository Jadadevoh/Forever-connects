import { Theme } from './types';

export const standardThemes: Theme[] = [
  // New Themes
  {
    name: 'timeless',
    title: 'Timeless (New Classic)',
    description: 'An elegant, centered layout with gradient backgrounds and a focus on essential memories.',
    colorTheme: 'classic-rose', // Fallback color theme if needed
    layout: 'timeless',
    colors: { bg: '#F6F6F8', primary: '#135bec', text: '#0d121b' },
  },
  {
    name: 'personal-touch',
    title: 'Personal Touch',
    description: 'A warm, scrapbook-style design with handwriting fonts and collage elements.',
    colorTheme: 'classic-rose',
    layout: 'personal-touch',
    colors: { bg: '#F6F6F8', primary: '#135bec', text: '#0d121b' },
  },
  {
    name: 'modern-minimal',
    title: 'Modern Minimal',
    description: 'A sleek, split-screen layout with a sticky sidebar and interactive features.',
    colorTheme: 'modern-blue',
    layout: 'modern-minimal',
    colors: { bg: '#FFFFFF', primary: '#f97316', text: '#111827' },
  },
  {
    name: 'serenity',
    title: 'Serenity',
    description: 'A peaceful, split-screen layout designed for storytelling and reflection.',
    colorTheme: 'modern-blue',
    layout: 'serenity',
    colors: { bg: '#F8FAFC', primary: '#475569', text: '#1e293b' },
  },
  {
    name: 'ultra-minimal',
    title: 'Ultra Minimal',
    description: 'A striking, artistic layout with large typography and bold visual elements.',
    colorTheme: 'modern-blue',
    layout: 'ultra-minimal',
    colors: { bg: '#FFFFFF', primary: '#000000', text: '#000000' },
  },

  // Classic Rose
  {
    name: 'classic-rose-classic',
    title: 'Classic Rose (Classic)',
    description: 'A gentle and warm design with soft pinks, perfect for a heartfelt tribute in a timeless, centered layout.',
    colorTheme: 'classic-rose',
    layout: 'classic',
    colors: { bg: '#FFF5F5', primary: '#D68C8C', text: '#5E3737' },
  },
  {
    name: 'classic-rose-story',
    title: 'Classic Rose (Story)',
    description: 'A gentle and warm design with soft pinks, presented in a personal, narrative-focused layout.',
    colorTheme: 'classic-rose',
    layout: 'story',
    colors: { bg: '#FFF5F5', primary: '#D68C8C', text: '#5E3737' },
  },
  // Modern Blue
  {
    name: 'modern-blue-classic',
    title: 'Modern Blue (Classic)',
    description: 'A clean, crisp theme with blues and grays in a respectful, traditional layout.',
    colorTheme: 'modern-blue',
    layout: 'classic',
    colors: { bg: '#F0F4F8', primary: '#3B82F6', text: '#1F2937' },
  },
  {
    name: 'modern-blue-story',
    title: 'Modern Blue (Story)',
    description: 'A clean, crisp theme with blues and grays, ideal for a feature story-style memorial.',
    colorTheme: 'modern-blue',
    layout: 'story',
    colors: { bg: '#F0F4F8', primary: '#3B82F6', text: '#1F2937' },
  },
  // Elegant Gold
  {
    name: 'elegant-gold-classic',
    title: 'Elegant Gold (Classic)',
    description: 'A luxurious and respectful theme with creams and golds in a timeless, centered format.',
    colorTheme: 'elegant-gold',
    layout: 'classic',
    colors: { bg: '#FCFBF8', primary: '#D4AF37', text: '#4A443A' },
  },
  {
    name: 'elegant-gold-story',
    title: 'Elegant Gold (Story)',
    description: 'A luxurious and respectful theme with creams and golds, presented in a personal, narrative layout.',
    colorTheme: 'elegant-gold',
    layout: 'story',
    colors: { bg: '#FCFBF8', primary: '#D4AF37', text: '#4A443A' },
  },
  // Peaceful Green
  {
    name: 'peaceful-green-classic',
    title: 'Peaceful Green (Classic)',
    description: 'A natural, calming theme with greens and earthy tones in a traditional, centered design.',
    colorTheme: 'peaceful-green',
    layout: 'classic',
    colors: { bg: '#F1F5F2', primary: '#6A994E', text: '#386641' },
  },
  {
    name: 'peaceful-green-story',
    title: 'Peaceful Green (Story)',
    description: 'A natural, calming theme with greens and earthy tones, perfect for a story-focused layout.',
    colorTheme: 'peaceful-green',
    layout: 'story',
    colors: { bg: '#F1F5F2', primary: '#6A994E', text: '#386641' },
  },
];
