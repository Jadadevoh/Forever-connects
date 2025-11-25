

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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleManageClick = (action: 'edit' | 'url' | 'donations') => {
      setIsMenuOpen(false);
      switch(action) {
          case 'edit':
              navigate(`/edit/${memorial.id}`);
              break;
          case 'url':
              onEditUrlClick?.(memorial);
              break;
          case 'donations':
              navigate(`/edit/${memorial.id}`, { state: { defaultTab: 'donations' } });
              break;
      }
  }

  const fullName = [memorial.firstName, memorial.middleName, memorial.lastName].filter(Boolean).join(' ');
  const isDraft = memorial.status === 'draft';
  const linkPath = isDraft ? `/edit/${memorial.id}` : `/memorial/${memorial.slug}`;
  const buttonText = isDraft ? 'Complete & Publish' : 'View Memorial';

  return (
    <div className="relative bg-white rounded-lg shadow-sm overflow-hidden h-full flex flex-col transform hover:shadow-md transition-shadow duration-300 border border-silver">
      {isDraft && (
        <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full z-10">
          DRAFT
        </div>
      )}
      <Link to={linkPath} className="block group">
        <img
          className="w-full h-48 object-cover"
          src={memorial.profileImage.dataUrl}
          alt={fullName}
        />
      </Link>
      <div className="p-4 sm:p-6 flex-grow flex flex-col">
        <h3 className="text-2xl font-serif text-deep-navy font-bold mb-1">{fullName}</h3>
        <p className="text-soft-gray mb-4">{getYears(memorial.birthDate, memorial.deathDate)}</p>
        
        {showManagementOptions && !isDraft && (
            <div className="mb-4 bg-pale-sky p-2 rounded-md text-sm text-center">
                <span className="font-semibold text-deep-navy">${totalDonations.toLocaleString()}</span>
                <span className="text-soft-gray"> raised</span>
            </div>
        )}

        <p className="text-deep-navy/80 text-sm line-clamp-3 flex-grow">
          {memorial.biography}
        </p>

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