import React, { useState } from 'react';
import FollowButton from './FollowButton';

interface FloatingActionMenuProps {
    isOwner: boolean;
    onManage: () => void;
    onShare: () => void;
    onQR: () => void;
    memorialId: string;
}

const FloatingActionMenu: React.FC<FloatingActionMenuProps> = ({ isOwner, onManage, onShare, onQR, memorialId }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Common Button Styles
    const btnBase = "backdrop-blur-md shadow-lg border border-white/20 transition-all duration-300 flex items-center justify-center";
    const desktopBtn = `${btnBase} bg-white/90 hover:bg-white text-deep-navy px-4 py-2 rounded-xl font-bold text-sm gap-2 hover:-translate-x-1`;

    return (
        <>
            {/* --- DESKTOP VIEW (md:flex) --- 
                Fixed on right side, below header (top-24)
            */}
            <div className="hidden md:flex flex-col gap-3 fixed top-24 right-6 z-40 items-end">
                <FollowButton memorialId={memorialId} className={desktopBtn} />

                <button onClick={onQR} className={desktopBtn}>
                    <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
                    <span>QR Code</span>
                </button>

                <button onClick={onShare} className={desktopBtn}>
                    <span className="material-symbols-outlined text-[20px]">share</span>
                    <span>Share</span>
                </button>

                {isOwner && (
                    <button onClick={onManage} className={`${desktopBtn} bg-dusty-blue/10 text-primary border-primary/20`}>
                        <span className="material-symbols-outlined text-[20px]">settings</span>
                        <span>Manage</span>
                    </button>
                )}
            </div>

            {/* --- MOBILE VIEW (md:hidden) --- 
                Floating FAB top-right, expand on tap
            */}
            <div className="md:hidden fixed top-20 right-4 z-50 flex flex-col items-end gap-3 pointer-events-none">
                {/* Expandable Items (Order: Top-down flow) */}
                <div className={`flex flex-col gap-3 transition-all duration-300 pointer-events-auto ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                    {isOwner && (
                        <button onClick={() => { onManage(); setIsOpen(false); }} className={`${desktopBtn} shadow-xl`}>
                            <span className="material-symbols-outlined">settings</span>
                            Manage
                        </button>
                    )}
                    <button onClick={() => { onShare(); setIsOpen(false); }} className={`${desktopBtn} shadow-xl`}>
                        <span className="material-symbols-outlined">share</span>
                        Share
                    </button>
                    <button onClick={() => { onQR(); setIsOpen(false); }} className={`${desktopBtn} shadow-xl`}>
                        <span className="material-symbols-outlined">qr_code_2</span>
                        QR Code
                    </button>
                    <div className="bg-white rounded-xl shadow-xl">
                        <FollowButton memorialId={memorialId} className="w-full justify-start px-4 py-2" />
                    </div>
                </div>

                {/* Main Trigger Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-12 h-12 bg-deep-navy text-white rounded-full shadow-xl flex items-center justify-center pointer-events-auto hover:scale-105 transition-transform"
                >
                    <span className={`material-symbols-outlined transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                        {isOpen ? 'close' : 'more_vert'}
                    </span>
                </button>
            </div>
        </>
    );
};

export default FloatingActionMenu;
