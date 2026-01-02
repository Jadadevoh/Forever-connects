import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMemorials } from '../hooks/useMemorials';
import AuthRequiredModal from './AuthRequiredModal';
import { useNavigate } from 'react-router-dom';

interface FollowButtonProps {
    memorialId: string;
    className?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({ memorialId, className = '' }) => {
    const { isLoggedIn, currentUser } = useAuth();
    const { followMemorial, unfollowMemorial, isUserFollowing, getMemorialById } = useMemorials();
    const navigate = useNavigate();

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const memorial = getMemorialById(memorialId);
    const followerCount = memorial?.followers?.length || 0;

    // We need the user ID to check status, if not logged in assume false
    const isFollowing = currentUser ? isUserFollowing(memorialId, currentUser.id) : false;

    const handleClick = () => {
        if (!isLoggedIn || !currentUser) {
            setIsAuthModalOpen(true);
            return;
        }

        if (isFollowing) {
            if (window.confirm("Are you sure you want to unfollow this memorial?")) {
                unfollowMemorial(memorialId, currentUser.id);
            }
        } else {
            followMemorial(memorialId, currentUser.id);
        }
    };

    const handleAuthRedirect = (path: '/login' | '/signup') => {
        navigate(path, { state: { returnTo: `/memorial/${memorial?.slug}` } });
    };

    return (
        <>
            <AuthRequiredModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onAuthRedirect={handleAuthRedirect}
                title="Sign in to Follow"
                message="Please sign in or create an account to follow this memorial and receive updates."
            />

            <button
                onClick={handleClick}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`flex items-center justify-center font-bold py-2 px-4 rounded-lg transition duration-300 shadow-md border ${className} ${isFollowing
                        ? 'bg-pale-sky text-dusty-blue border-dusty-blue'
                        : 'bg-white hover:bg-pale-sky text-deep-navy border-silver'
                    }`}
                title={isFollowing ? "Unfollow this memorial" : "Follow this memorial"}
            >
                {isFollowing ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 fill-current" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        {isHovered ? 'Unfollow' : 'Following'}
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        Follow
                    </>
                )}
                {followerCount > 0 && (
                    <span className={`ml-2 text-xs font-normal px-2 py-0.5 rounded-full ${isFollowing ? 'bg-white text-dusty-blue' : 'bg-silver text-deep-navy'}`}>
                        {followerCount}
                    </span>
                )}
            </button>
        </>
    );
};

export default FollowButton;
