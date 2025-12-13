import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Memorial, Tribute, Donation, Photo } from '../types';

interface MemorialsContextType {
  memorials: Memorial[];
  addMemorial: (memorialData: Omit<Memorial, 'id' | 'slug' | 'tributes'>) => Memorial;
  getMemorialById: (id: string) => Memorial | undefined;
  getMemorialBySlug: (slug: string) => Memorial | undefined;
  addTribute: (memorialId: string, tributeData: Omit<Tribute, 'id' | 'createdAt' | 'likes'>) => void;
  toggleLike: (memorialId: string, tributeId: string) => void;
  deleteMemorial: (memorialId: string) => void;
  updateMemorial: (id: string, updatedData: Partial<Memorial>) => void;
  updateMemorialSlug: (id: string, newSlug: string) => { success: boolean, message: string };
  addDonation: (memorialId: string, donation: Omit<Donation, 'id'>) => void;
  updateDonationsStatusForOwner: (ownerId: string, newStatus: 'paid') => void;
}

const MemorialsContext = createContext<MemorialsContextType | undefined>(undefined);

const MEMORIALS_STORAGE_KEY = 'memorials_data';

const generateSlug = (firstName: string, lastName: string, deathDate: string, existingMemorials: Memorial[]): string => {
    const deathYear = new Date(deathDate).getFullYear();
    let baseSlug = `${firstName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${lastName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    if (deathYear && !isNaN(deathYear)) {
        baseSlug += `-${deathYear}`;
    }

    let finalSlug = baseSlug;
    let counter = 2;
    while (existingMemorials.some(m => m.slug === finalSlug)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
    }
    return finalSlug;
};

export const MemorialsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [memorials, setMemorials] = useState<Memorial[]>(() => {
    try {
      const storedMemorials = window.localStorage.getItem(MEMORIALS_STORAGE_KEY);
      return storedMemorials ? JSON.parse(storedMemorials) : [];
    } catch (error) {
      console.error("Error reading memorials from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(MEMORIALS_STORAGE_KEY, JSON.stringify(memorials));
    } catch (error) {
      console.error("Error writing memorials to localStorage", error);
    }
  }, [memorials]);


  const addMemorial = (memorialData: Omit<Memorial, 'id' | 'slug' | 'tributes'>): Memorial => {
    const newSlug = generateSlug(memorialData.firstName, memorialData.lastName, memorialData.deathDate, memorials);
    const fullName = [memorialData.firstName, memorialData.middleName, memorialData.lastName].filter(Boolean).join(' ');
    
    const newMemorial: Memorial = {
      ...memorialData,
      id: `mem_${Date.now()}`,
      slug: newSlug,
      tributes: [],
      plan: memorialData.plan || 'free',
      donations: [],
      donationInfo: memorialData.donationInfo || {
        isEnabled: false, recipient: '', goal: 0, description: '', showDonorWall: true,
        suggestedAmounts: [25, 50, 100, 250], purpose: 'General Support for the Family',
      },
      emailSettings: memorialData.emailSettings || {
        senderName: `${fullName} Tribute Team`, replyToEmail: '',
        headerImageUrl: memorialData.profileImage?.url || '', footerMessage: `In loving memory of ${fullName}.`
      },
      status: memorialData.status || 'active',
      createdAt: Date.now(),
    };
    setMemorials(prev => [...prev, newMemorial]);
    return newMemorial;
  };

  const getMemorialById = useCallback((id: string) => {
    return memorials.find(m => m.id === id);
  }, [memorials]);
  
  const getMemorialBySlug = useCallback((slug: string) => {
    return memorials.find(m => m.slug === slug);
  }, [memorials]);

  const addTribute = (memorialId: string, tributeData: Omit<Tribute, 'id' | 'createdAt' | 'likes'>) => {
    const newTribute: Tribute = {
      ...tributeData,
      id: `trib_${Date.now()}`,
      createdAt: Date.now(),
      likes: 0,
    };
    setMemorials(prev => prev.map(m => m.id === memorialId ? { ...m, tributes: [newTribute, ...m.tributes] } : m));
  };

  const toggleLike = (memorialId: string, tributeId: string) => {
    setMemorials(prev => prev.map(m => {
        if (m.id === memorialId) {
            const updatedTributes = m.tributes.map(t => t.id === tributeId ? { ...t, likes: t.likes + 1 } : t);
            return { ...m, tributes: updatedTributes };
        }
        return m;
    }));
  };

  const deleteMemorial = (memorialId: string) => {
    setMemorials(prev => prev.filter(m => m.id !== memorialId));
  };

  const updateMemorial = (id: string, updatedData: Partial<Memorial>) => {
    setMemorials(prev => prev.map(m => m.id === id ? { ...m, ...updatedData } : m));
  };

  const updateMemorialSlug = (id: string, newSlug: string): { success: boolean; message: string } => {
    const formattedSlug = newSlug.toLowerCase().replace(/[^a-z0-9-]+/g, '');
    if (!formattedSlug) {
        return { success: false, message: "Web address cannot be empty and must contain letters, numbers, or hyphens." };
    }
    if (memorials.some(m => m.slug === formattedSlug && m.id !== id)) {
        return { success: false, message: "This web address is already in use. Please choose another." };
    }
    updateMemorial(id, { slug: formattedSlug });
    return { success: true, message: "Web address updated successfully!" };
  };

  const addDonation = (memorialId: string, donation: Omit<Donation, 'id'>) => {
    const newDonation = { ...donation, id: `don_${Date.now()}`};
    setMemorials(prev => prev.map(m => m.id === memorialId ? { ...m, donations: [...m.donations, newDonation] } : m));
  };

  const updateDonationsStatusForOwner = (ownerId: string, newStatus: 'paid') => {
      setMemorials(prev => prev.map(m => {
          if (m.userId === ownerId) {
              const updatedDonations = m.donations.map(d => 
                  d.payoutStatus === 'pending' ? { ...d, payoutStatus: newStatus } : d
              );
              return { ...m, donations: updatedDonations };
          }
          return m;
      }));
  };

  const value = { 
    memorials, addMemorial, getMemorialById, getMemorialBySlug, addTribute, 
    toggleLike, deleteMemorial, updateMemorial, updateMemorialSlug, addDonation,
    updateDonationsStatusForOwner
  };

  return (
    <MemorialsContext.Provider value={value}>
      {children}
    </MemorialsContext.Provider>
  );
};

export const useMemorials = (): MemorialsContextType => {
  const context = useContext(MemorialsContext);
  if (context === undefined) {
    throw new Error('useMemorials must be used within a MemorialsProvider');
  }
  return context;
};