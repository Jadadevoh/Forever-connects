import React from 'react';
import { Memorial, MemorialCreationData } from '../types';
import ClassicLayout from './layouts/ClassicLayout';
import StoryLayout from './layouts/StoryLayout';
import PersonalTouchLayout from './layouts/PersonalTouchLayout';
import ModernMinimalLayout from './layouts/ModernMinimalLayout';
import TimelessLayout from './layouts/TimelessLayout';
import SerenityLayout from './layouts/SerenityLayout';
import UltraMinimalLayout from './layouts/UltraMinimalLayout';

interface ThemePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    formData: MemorialCreationData;
    themeName: string;
}

const ThemePreviewModal: React.FC<ThemePreviewModalProps> = ({ isOpen, onClose, formData, themeName }) => {
    if (!isOpen) return null;

    // Construct a temporary Memorial object for the preview
    // Ensure all required fields for Memorial are present
    const fullName = [formData.firstName, formData.middleName, formData.lastName].filter(Boolean).join(' ');

    const previewMemorial: Memorial = {
        id: 'preview-id',
        userId: 'preview-user',
        slug: 'preview-slug',
        status: 'active',
        plan: formData.plan,
        firstName: formData.firstName,
        middleName: formData.middleName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        deathDate: formData.deathDate,
        gender: formData.gender,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        restingPlace: formData.restingPlace,
        causeOfDeath: formData.causeOfDeath,
        isCauseOfDeathPrivate: formData.isCauseOfDeathPrivate,
        profileImage: formData.profileImage || { id: 'default', url: 'https://via.placeholder.com/300?text=No+Image', caption: 'Default Image' },
        biography: formData.biography || "<p>This is a preview of the biography content.</p>",
        gallery: formData.gallery,
        tributes: [], // Preview starts with no tributes
        theme: themeName,
        emailSettings: formData.emailSettings || { senderName: '', replyToEmail: '' },
        donationInfo: formData.donationInfo!, // Assume it's there or handle it
        followers: [],
        donations: [],
        createdAt: Date.now(),
        aiHighlights: [] // Preview starts with no highlights
    };

    let LayoutComponent: React.ComponentType<{ memorial: Memorial, fullName: string }>;

    switch (themeName) {
        case 'personal-touch':
            LayoutComponent = PersonalTouchLayout;
            break;
        case 'modern-minimal':
            LayoutComponent = ModernMinimalLayout;
            break;
        case 'timeless':
            LayoutComponent = TimelessLayout;
            break;
        case 'serenity':
            LayoutComponent = SerenityLayout;
            break;
        case 'ultra-minimal':
            LayoutComponent = UltraMinimalLayout;
            break;
        case 'classic':
        default:
            if (themeName.endsWith('-story')) {
                LayoutComponent = StoryLayout;
            } else if (themeName.includes('classic') || themeName.includes('rose') || themeName.includes('blue') || themeName.includes('gold') || themeName.includes('green')) {
                LayoutComponent = ClassicLayout;
            } else {
                LayoutComponent = TimelessLayout;
            }
            break;
    }

    const themeParts = themeName.split('-');
    const colorTheme = themeParts.join('-');

    return (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-fade-in">
            {/* Control Bar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur shadow-md z-[110] flex items-center justify-between px-6 border-b border-gray-200">
                <div className="text-gray-900 font-semibold text-lg">Theme Preview: <span className="text-dusty-blue">{themeName}</span></div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 hidden sm:inline">This is how your memorial will look.</span>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                    >
                        Close Preview
                    </button>
                </div>
            </div>

            {/* Layout Container */}
            <div className={`pt-16 min-h-screen ${'theme-' + colorTheme}`}>
                <LayoutComponent memorial={previewMemorial} fullName={fullName} />
            </div>
        </div>
    );
};

export default ThemePreviewModal;
