

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Memorial, Tribute, Donation } from '../types';

interface MemorialsContextType {
  memorials: Memorial[];
  addMemorial: (memorial: Omit<Memorial, 'id' | 'slug'>) => Memorial;
  getMemorialById: (id: string) => Memorial | undefined;
  getMemorialBySlug: (slug: string) => Memorial | undefined;
  addTribute: (memorialId: string, tribute: Omit<Tribute, 'id' | 'createdAt' | 'likes'>) => void;
  addLike: (memorialId: string, tributeId: string) => void;
  deleteMemorial: (memorialId: string) => void;
  updateMemorial: (id: string, updatedData: Memorial) => void;
  updateMemorialSlug: (id: string, newSlug: string) => { success: boolean, message: string };
  addDonation: (memorialId: string, donation: Omit<Donation, 'id' | 'date'>) => void;
}

const MemorialsContext = createContext<MemorialsContextType | undefined>(undefined);

const STORAGE_KEY = 'memorials';
const DRAFT_STORAGE_KEY = 'memorial_draft';

const generateSlug = (firstName: string, lastName: string, deathDate: string, existingSlugs: string[]): string => {
    const deathYear = new Date(deathDate).getFullYear();
    let baseSlug = `${firstName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${lastName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    if (deathYear && !isNaN(deathYear)) {
        baseSlug += `-${deathYear}`;
    }

    let finalSlug = baseSlug;
    let counter = 2;
    while (existingSlugs.includes(finalSlug)) {
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
    }
    return finalSlug;
};

export const MemorialsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [memorials, setMemorials] = useState<Memorial[]>(() => {
    try {
      const storedMemorials = window.localStorage.getItem(STORAGE_KEY);
      const parsed = storedMemorials ? JSON.parse(storedMemorials) : [];
      // One-time migration for slugs
      if (Array.isArray(parsed) && parsed.length > 0 && !parsed[0].slug) {
          const existingSlugs: string[] = [];
          return parsed.map((m: Omit<Memorial, 'slug'>) => {
              const newSlug = generateSlug(m.firstName, m.lastName, m.deathDate, existingSlugs);
              existingSlugs.push(newSlug);
              return { ...m, slug: newSlug };
          });
      }
      return parsed;
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memorials));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [memorials]);

  const addMemorial = (memorialData: Omit<Memorial, 'id' | 'slug'>): Memorial => {
    const fullName = [memorialData.firstName, memorialData.middleName, memorialData.lastName].filter(Boolean).join(' ');
    const newSlug = generateSlug(memorialData.firstName, memorialData.lastName, memorialData.deathDate, memorials.map(m => m.slug));
    
    const newMemorial: Memorial = {
      ...memorialData,
      id: Date.now().toString(),
      slug: newSlug,
      plan: memorialData.plan || 'free',
      userId: memorialData.userId,
      donations: [],
      donationInfo: memorialData.donationInfo || {
        isEnabled: false,
        recipient: '',
        goal: 0,
        description: '',
        showDonorWall: true,
        suggestedAmounts: [25, 50, 100, 250],
        purpose: 'General Support for the Family',
      },
      emailSettings: memorialData.emailSettings || {
        senderName: `${fullName} Tribute Team`,
        replyToEmail: '',
        headerImageUrl: memorialData.profileImage?.dataUrl || '',
        footerMessage: `In loving memory of ${fullName}.`
      },
      status: memorialData.status || 'active',
    };
    setMemorials(prev => [...prev, newMemorial]);

    try {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch (error) {
        console.error("Error clearing memorial draft from localStorage", error);
    }

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
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      likes: 0,
    };
    setMemorials(prev =>
      prev.map(m =>
        m.id === memorialId
          ? { ...m, tributes: [newTribute, ...m.tributes] }
          : m
      )
    );
  };

  const addLike = (memorialId: string, tributeId: string) => {
    setMemorials(prev =>
      prev.map(m =>
        m.id === memorialId
          ? {
              ...m,
              tributes: m.tributes.map(t =>
                t.id === tributeId ? { ...t, likes: t.likes + 1 } : t
              ),
            }
          : m
      )
    );
  };

  const deleteMemorial = (memorialId: string) => {
    setMemorials(prev => prev.filter(m => m.id !== memorialId));
  };

  const updateMemorial = (id: string, updatedData: Memorial) => {
    setMemorials(prev => prev.map(m => (m.id === id ? updatedData : m)));
  };

  const updateMemorialSlug = (id: string, newSlug: string): { success: boolean; message: string } => {
    const formattedSlug = newSlug.toLowerCase().replace(/[^a-z0-9-]+/g, '');
    if (!formattedSlug) {
        return { success: false, message: "Web address cannot be empty and must contain letters, numbers, or hyphens." };
    }
    const isTaken = memorials.some(m => m.slug === formattedSlug && m.id !== id);
    if (isTaken) {
        return { success: false, message: "This web address is already in use. Please choose another." };
    }

    setMemorials(prev => prev.map(m => (m.id === id ? { ...m, slug: formattedSlug } : m)));
    return { success: true, message: "Web address updated successfully!" };
  };

  const addDonation = (memorialId: string, donation: Omit<Donation, 'id' | 'date'>) => {
    const newDonation: Donation = {
        ...donation,
        id: Date.now().toString(),
        date: new Date().toISOString(),
    };
    setMemorials(prev =>
        prev.map(m =>
            m.id === memorialId
                ? { ...m, donations: [newDonation, ...m.donations] }
                : m
        )
    );
  };

  return (
    <MemorialsContext.Provider value={{ memorials, addMemorial, getMemorialById, getMemorialBySlug, addTribute, addLike, deleteMemorial, updateMemorial, updateMemorialSlug, addDonation }}>
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