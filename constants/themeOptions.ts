
export interface ColorPalette {
    id: string;
    name: string;
    colors: {
        bg: string;
        primary: string;
        secondary: string;
        text: string;
        accent: string;
    };
}

export interface LayoutOption {
    id: string;
    name: string;
    description: string;
    thumbnail?: string; // Could be a path to an image
    recommended?: boolean;
}

export const COLOR_PALETTES: ColorPalette[] = [
    {
        id: 'timeless-blue',
        name: 'Timeless Blue',
        colors: {
            bg: '#F6F6F8',
            primary: '#135bec',
            secondary: '#e7ebf3',
            text: '#0d121b',
            accent: '#3b82f6'
        }
    },
    {
        id: 'classic-rose',
        name: 'Classic Rose',
        colors: {
            bg: '#FFF5F5',
            primary: '#D68C8C',
            secondary: '#FDECEC',
            text: '#5E3737',
            accent: '#E57373'
        }
    },
    {
        id: 'peaceful-green',
        name: 'Peaceful Green',
        colors: {
            bg: '#F1F5F2',
            primary: '#6A994E',
            secondary: '#E0E8E1',
            text: '#386641',
            accent: '#A7C957'
        }
    },
    {
        id: 'elegant-gold',
        name: 'Elegant Gold',
        colors: {
            bg: '#FCFBF8',
            primary: '#D4AF37',
            secondary: '#F5F1E6',
            text: '#4A443A',
            accent: '#F4C430'
        }
    },
    {
        id: 'modern-slate',
        name: 'Modern Slate',
        colors: {
            bg: '#F8FAFC',
            primary: '#475569',
            secondary: '#E2E8F0',
            text: '#1E293B',
            accent: '#64748B'
        }
    }
];

export const LAYOUTS: LayoutOption[] = [
    {
        id: 'timeless',
        name: 'Timeless',
        description: 'An elegant, centered layout with a focus on essential memories and a clear timeline.',
        recommended: true
    },
    {
        id: 'serenity',
        name: 'Serenity',
        description: 'A modern design with a persistent sidebar and smooth scrolling sections.',
    },
    {
        id: 'modern-minimal',
        name: 'Modern Minimal',
        description: 'A clean, split-screen layout with interactive elements and a contemporary feel.',
    },
    {
        id: 'personal-touch',
        name: 'Personal Touch',
        description: 'A warm, scrapbook-style design with handwriting fonts and unique collage elements.',
    },
    {
        id: 'ultra-minimal',
        name: 'Ultra-Minimal',
        description: 'A refined, single-column design inspired by high-end typography and white space.',
    },
    {
        id: 'classic', // Keeping for legacy/preference
        name: 'Classic',
        description: 'A traditional, straightforward layout that presents the life story with dignity.',
    }
];
