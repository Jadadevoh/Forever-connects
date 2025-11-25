

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Memorial } from '../types';

// FIX: Excluded 'slug' from the type as it is generated upon final memorial creation, not during guest progress saving.
type GuestMemorialData = Omit<Memorial, 'id' | 'userId' | 'tributes' | 'slug'> | null;

interface GuestMemorialContextType {
  guestMemorialData: GuestMemorialData;
  saveGuestMemorial: (data: Omit<Memorial, 'id' | 'userId' | 'tributes' | 'slug'>) => void;
  clearGuestMemorial: () => void;
}

const GuestMemorialContext = createContext<GuestMemorialContextType | undefined>(undefined);

const GUEST_STORAGE_KEY = 'guest_memorial_progress';

export const GuestMemorialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [guestMemorialData, setGuestMemorialData] = useState<GuestMemorialData>(() => {
    try {
      const storedData = window.sessionStorage.getItem(GUEST_STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.error("Error reading guest memorial data from sessionStorage", error);
      return null;
    }
  });

  const saveGuestMemorial = (data: Omit<Memorial, 'id' | 'userId' | 'tributes' | 'slug'>) => {
    try {
        setGuestMemorialData(data);
        window.sessionStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error("Error saving guest memorial data to sessionStorage", error);
    }
  };

  const clearGuestMemorial = () => {
    try {
        setGuestMemorialData(null);
        window.sessionStorage.removeItem(GUEST_STORAGE_KEY);
    } catch (error) {
        console.error("Error clearing guest memorial data from sessionStorage", error);
    }
  };

  return (
    <GuestMemorialContext.Provider value={{ guestMemorialData, saveGuestMemorial, clearGuestMemorial }}>
      {children}
    </GuestMemorialContext.Provider>
  );
};

export const useGuestMemorial = (): GuestMemorialContextType => {
  const context = useContext(GuestMemorialContext);
  if (context === undefined) {
    throw new Error('useGuestMemorial must be used within a GuestMemorialProvider');
  }
  return context;
};