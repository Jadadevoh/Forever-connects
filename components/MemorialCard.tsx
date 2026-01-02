import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Memorial } from '../types';

interface MemorialCardProps {
  memorial: Memorial;
  showManagementOptions?: boolean;
  onEditUrlClick?: (memorial: Memorial) => void;
}

const MemorialCard: React.FC<MemorialCardProps> = ({ memorial, showManagementOptions = false, onEditUrlClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const getYears = (birthDate: string, deathDate: string) => {
    const birthYear = new Date(birthDate).getFullYear();
    const deathYear = new Date(deathDate).getFullYear();
    if (!birthYear || !deathYear || isNaN(birthYear) || isNaN(deathYear)) return '';
    return `${birthYear} - ${deathYear}`;
  };

  const totalDonations = memorial.donations?.reduce((sum, d) => sum + d.amount, 0) || 0;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleManageClick = (action: 'edit' | 'url' | 'donations') => {
    setIsMenuOpen(false);
    switch (action) {
      case 'edit': navigate(`/edit/${memorial.id}`); break;
      case 'url': onEditUrlClick?.(memorial); break;
      case 'donations': navigate(`/edit/${memorial.id}`, { state: { defaultTab: 'donations' } }); break;
    }
  }

  const fullName = [memorial.firstName, memorial.middleName, memorial.lastName].filter(Boolean).join(' ');
  const isDraft = memorial.status === 'draft';
  const linkPath = isDraft ? `/edit/${memorial.id}` : `/memorial/${memorial.slug}`;
  const buttonText = isDraft ? 'Complete & Publish' : 'View Memorial';

  // Safely create a plain text preview of the biography
  const biographyPreview = memorial.biography.replace(/<[^>]+>/g, '').substring(0, 150) + '...';

  return (
    <div className="relative bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col transform hover:shadow-md transition-shadow duration-300 border border-silver">
      {isDraft && <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full z-10">DRAFT</div>}
      <Link to={linkPath} className="block group">
        <img
          className="w-full h-48 object-cover"
          // FIX: Changed dataUrl to url to match Photo type.
          src={memorial.profileImage.url}
          alt={fullName}
        />
      </Link>
      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        <Link to={linkPath} className="block mb-4 flex-grow text-inherit hover:text-current">
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-2xl font-serif text-deep-navy font-bold">{fullName}</h3>
            {memorial.plan && memorial.plan !== 'free' && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${memorial.plan === 'eternal' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-dusty-blue/10 text-dusty-blue border border-dusty-blue/20'}`}>
                {memorial.plan}
              </span>
            )}
          </div>
          <p className="text-soft-gray mb-4">{getYears(memorial.birthDate, memorial.deathDate)}</p>

          {showManagementOptions && !isDraft && (
            <div
              onClick={(e) => {
                e.preventDefault(); // Prevent navigating to memorial page
                handleManageClick('donations');
              }}
              className="mb-4 bg-pale-sky p-2 rounded-md text-sm text-center cursor-pointer hover:bg-pale-sky/80 transition-colors"
              title="View Donation Details"
            >
              <span className="font-semibold text-deep-navy">${totalDonations.toLocaleString()}</span>
              <span className="text-soft-gray"> raised</span>
            </div>
          )}

          <p className="text-deep-navy/80 text-sm line-clamp-3">{biographyPreview}</p>
        </Link>

        <div className="mt-4 flex justify-between items-center">
          <Link to={linkPath} className="text-dusty-blue hover:text-deep-navy font-semibold transition-colors duration-300">
            {buttonText} &rarr;
          </Link>

          {showManagementOptions && !isDraft && (
            <div ref={menuRef} className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-sm bg-silver hover:bg-soft-gray/80 text-deep-navy font-medium py-1 px-3 rounded-lg transition-colors flex items-center">
                Manage
                <svg className={`w-4 h-4 ml-1 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-md shadow-lg border border-silver z-20">
                  <button onClick={() => handleManageClick('edit')} className="block w-full text-left px-4 py-2 text-sm text-deep-navy hover:bg-pale-sky">Edit Memorial</button>
                  <button onClick={() => handleManageClick('url')} className="block w-full text-left px-4 py-2 text-sm text-deep-navy hover:bg-pale-sky">Edit Web Address</button>
                  <button onClick={() => handleManageClick('donations')} className="block w-full text-left px-4 py-2 text-sm text-deep-navy hover:bg-pale-sky">Manage Donations</button>
                  {memorial.plan !== 'eternal' && (
                    <button onClick={() => navigate(`/checkout/eternal`, { state: { memorialId: memorial.id } })} className="block w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 font-medium">✨ Upgrade to Eternal</button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemorialCard;