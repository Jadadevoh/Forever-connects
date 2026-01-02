import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useMemorials } from '../hooks/useMemorials';
import { Memorial, Tribute } from '../types';
import TributeList from '../components/TributeList';
import TributeForm from '../components/TributeForm';
import { useAuth } from '../hooks/useAuth';
import DonationModule from '../components/DonationModule';
import ShareModal from '../components/ShareModal';
import EditUrlModal from '../components/EditUrlModal';
import QRCodeModal from '../components/QRCodeModal';
import FloatingActionMenu from '../components/FloatingActionMenu';
import ClassicLayout from '../components/layouts/ClassicLayout';
import StoryLayout from '../components/layouts/StoryLayout';
import { renderGalleryItem } from '../components/GalleryHelpers';

import PersonalTouchLayout from '../components/layouts/PersonalTouchLayout';
import ModernMinimalLayout from '../components/layouts/ModernMinimalLayout';
import TimelessLayout from '../components/layouts/TimelessLayout';
import SerenityLayout from '../components/layouts/SerenityLayout';
import UltraMinimalLayout from '../components/layouts/UltraMinimalLayout';
import { COLOR_PALETTES } from '../constants/themeOptions';

// ... (keep existing imports and helpers)

const MemorialPage: React.FC = () => {
    // ... (keep existing setup code up to LayoutComponent definition)
    const { slug } = useParams<{ slug: string }>();
    const { getMemorialBySlug, updateMemorialSlug } = useMemorials();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const memorial = slug ? getMemorialBySlug(slug) : null;
    const tributes = memorial ? memorial.tributes : [];

    const [activeTab, setActiveTab] = useState<'story' | 'tribute' | 'support' | 'gallery'>('story');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [isEditUrlModalOpen, setIsEditUrlModalOpen] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);

    const isOwner = currentUser && memorial && currentUser.id === memorial.userId;

    if (!memorial || memorial.status !== 'active') { return <div className="text-center text-xl text-soft-gray p-12">Memorial not found or is not public.</div>; }

    const handleSaveSlug = (newSlug: string) => {
        const result = updateMemorialSlug(memorial.id, newSlug);
        if (result.success) {
            navigate(`/memorial/${newSlug}`, { replace: true });
        }
        return result;
    };

    const fullName = [memorial.firstName, memorial.middleName, memorial.lastName].filter(Boolean).join(' ');
    // Theme logic Update
    // Determined Layout and Colors
    const themeName = memorial.theme; // Keep themeName for legacy fallbacks
    let LayoutComponent: React.ComponentType<{ memorial: Memorial, fullName: string }>;

    const layoutId = memorial.layout ||
        (themeName === 'modern-minimal' ? 'modern-minimal' :
            themeName === 'personal-touch' ? 'personal-touch' :
                themeName === 'serenity' ? 'serenity' :
                    themeName === 'ultra-minimal' ? 'ultra-minimal' :
                        'timeless');
    const paletteId = memorial.colorPalette || 'timeless-blue';
    const palette = COLOR_PALETTES.find(p => p.id === paletteId) || COLOR_PALETTES[0];

    // Map layout ID to Component
    switch (layoutId) {
        case 'serenity': LayoutComponent = SerenityLayout; break;
        case 'timeless': LayoutComponent = TimelessLayout; break;
        case 'modern-minimal': LayoutComponent = ModernMinimalLayout; break;
        case 'personal-touch': LayoutComponent = PersonalTouchLayout; break;
        case 'ultra-minimal': LayoutComponent = UltraMinimalLayout; break;
        default:
            // Fallbacks for legacy theme strings if no explicit layout
            if (themeName.endsWith('-story')) {
                LayoutComponent = StoryLayout;
            } else if (themeName.includes('classic') || themeName.includes('rose') || themeName.includes('blue') || themeName.includes('gold') || themeName.includes('green')) {
                LayoutComponent = ClassicLayout;
            } else {
                LayoutComponent = TimelessLayout;
            }
            break;
    }

    const cssVars = {
        '--primary-color': palette.colors.primary,
        '--secondary-color': palette.colors.secondary,
        '--bg-color': palette.colors.bg,
        '--text-color': palette.colors.text,
        '--accent-color': palette.colors.accent,
    } as React.CSSProperties;

    // Check if it's one of the new full-page layouts
    if (['serenity', 'timeless', 'modern-minimal', 'personal-touch', 'ultra-minimal'].includes(layoutId)) {
        return (
            <div style={cssVars}> {/* Apply variables globally to this page instance */}
                {/* Modals are still needed globally? Yes */}
                <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} url={window.location.href} title={`In memory of ${fullName}`} />
                {isOwner && (
                    <EditUrlModal
                        isOpen={isEditUrlModalOpen}
                        onClose={() => setIsEditUrlModalOpen(false)}
                        currentSlug={memorial.slug}
                        onSave={handleSaveSlug}
                    />
                )}
                <QRCodeModal
                    isOpen={isQRModalOpen}
                    onClose={() => setIsQRModalOpen(false)}
                    memorialName={fullName}
                    url={window.location.href}
                    profileImageUrl={memorial.profileImage?.url}
                />

                {/* Floating Action Menu (New Layouts) */}
                <FloatingActionMenu
                    isOwner={!!isOwner}
                    onManage={() => navigate(`/edit/${memorial.id}`)}
                    onShare={() => setIsShareModalOpen(true)}
                    onQR={() => setIsQRModalOpen(true)}
                    memorialId={memorial.id}
                />

                <LayoutComponent memorial={memorial} fullName={fullName} />
            </div>
        );
    }

    // Fallback for Legacy Themes (Classic/Story) which need the wrapper
    const themeParts = memorial.theme.split('-');
    const colorTheme = themeParts.join('-');

    return <>
        <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} url={window.location.href} title={`In memory of ${fullName}`} />
        {isOwner && (
            <EditUrlModal
                isOpen={isEditUrlModalOpen}
                onClose={() => setIsEditUrlModalOpen(false)}
                currentSlug={memorial.slug}
                onSave={handleSaveSlug}
            />
        )}
        <QRCodeModal
            isOpen={isQRModalOpen}
            onClose={() => setIsQRModalOpen(false)}
            memorialName={fullName}
            url={window.location.href}
            profileImageUrl={memorial.profileImage?.url}
        />
        <div className={`relative max-w-5xl mx-auto ${'theme-' + colorTheme}`}>
            {/* Floating Action Menu (Legacy Layouts) */}
            <FloatingActionMenu
                isOwner={!!isOwner}
                onManage={() => navigate(`/edit/${memorial.id}`)}
                onShare={() => setIsShareModalOpen(true)}
                onQR={() => setIsQRModalOpen(true)}
                memorialId={memorial.id}
            />
            <div className="bg-white border border-silver rounded-xl shadow-sm">
                <div className="border-b border-silver flex flex-wrap">
                    <button onClick={() => setActiveTab('story')} className={`flex-grow sm:flex-grow-0 px-4 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${activeTab === 'story' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Life Story</button>
                    <button onClick={() => setActiveTab('tribute')} className={`flex-grow sm:flex-grow-0 px-4 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${activeTab === 'tribute' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Leave a Tribute</button>
                    {memorial.donationInfo.isEnabled && <button onClick={() => setActiveTab('support')} className={`flex-grow sm:flex-grow-0 px-4 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${activeTab === 'support' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Support Memorial</button>}
                    {memorial.gallery.length > 0 && <button onClick={() => setActiveTab('gallery')} className={`flex-grow sm:flex-grow-0 px-4 py-3 font-semibold text-sm sm:text-base transition-colors duration-200 text-center ${activeTab === 'gallery' ? 'text-deep-navy border-b-2 border-dusty-blue' : 'text-soft-gray hover:text-deep-navy'}`}>Gallery</button>}
                </div>
                <div>
                    {activeTab === 'story' && <div><LayoutComponent memorial={memorial} fullName={fullName} /><div className="p-8 border-t border-silver"><h2 className="text-3xl font-serif text-deep-navy mb-4">Shared Tributes</h2><TributeList tributes={tributes} memorialId={memorial.id} /></div></div>}
                    {activeTab === 'tribute' && <div className="p-4 sm:p-8"><TributeForm memorialId={memorial.id} fullName={fullName} /></div>}
                    {activeTab === 'support' && memorial.donationInfo.isEnabled && <div className="p-4 sm:p-8"><DonationModule memorial={memorial} /></div>}
                    {activeTab === 'gallery' && memorial.gallery.length > 0 && <div className="p-4 sm:p-8"><h2 className="text-3xl font-serif text-deep-navy mb-4">Media Gallery</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{memorial.gallery.map(item => <div key={item.id}>{renderGalleryItem(item)}</div>)}</div></div>}
                </div>
            </div>
        </div>
    </>;
};

export default MemorialPage;