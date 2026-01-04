
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
    description?: string; // Purpose/Mood of the palette
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
        description: 'Reliable, serene, and respectful.',
        colors: {
            bg: '#F8FAFC', // Crisp white-blue tint
            primary: '#0F52BA', // Sapphire Blue (Rich & Trustworthy)
            secondary: '#E2E8F0',
            text: '#1E293B', // Slate 800 (High contrast)
            accent: '#3B82F6'
        }
    },
    {
        id: 'classic-rose',
        name: 'Classic Rose',
        description: 'Gentle, warm, and affectionate.',
        colors: {
            bg: '#FFF5F5',
            primary: '#C06C84', // Deep Rose (More sophisticated than pink)
            secondary: '#FDECEC',
            text: '#4A2C2C', // Deep Brown-Red for readability
            accent: '#E57373'
        }
    },
    {
        id: 'peaceful-green',
        name: 'Peaceful Green',
        description: 'Natural, healing, and calm.',
        colors: {
            bg: '#F1F5F2',
            primary: '#2E7D32', // Forest Green (Better contrast than bright green)
            secondary: '#E0E8E1',
            text: '#1B4332', // Dark Green-Black
            accent: '#81C784'
        }
    },
    {
        id: 'elegant-gold',
        name: 'Elegant Gold',
        description: 'Luxurious, dignified, and timeless.',
        colors: {
            bg: '#FFFCF9', // Very warm white
            primary: '#B8860B', // Dark Goldenrod (Readable against white)
            secondary: '#F5F1E6',
            text: '#3E3832', // Warm Charcoal
            accent: '#D4AF37' // Pure Gold highlights
        }
    },
    {
        id: 'modern-slate',
        name: 'Modern Slate',
        description: 'Contemporary, minimal, and strong.',
        colors: {
            bg: '#F8FAFC',
            primary: '#475569', // Slate 600
            secondary: '#E2E8F0',
            text: '#0F172A', // Slate 900
            accent: '#94A3B8'
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
