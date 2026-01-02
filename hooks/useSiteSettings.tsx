import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SiteSettings } from '../types';

interface SiteSettingsContextType {
  siteSettings: SiteSettings;
  saveSiteSettings: (settings: SiteSettings) => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'site_settings';

const initialSettings: SiteSettings = {
  siteName: "Remembered Flame",
  logoUrl: '',
  heroImageUrl: '',
  aboutHeroImageUrl: '',
};

export const SiteSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const storedSettings = window.localStorage.getItem(STORAGE_KEY);
      // Merge stored settings with defaults to ensure all keys are present
      const parsed = storedSettings ? JSON.parse(storedSettings) : {};
      return { ...initialSettings, ...parsed };
    } catch (error) {
      console.error("Error reading site settings from localStorage", error);
      return initialSettings;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(siteSettings));
    } catch (error) {
      console.error("Error writing site settings to localStorage", error);
    }
  }, [siteSettings]);

  const saveSiteSettings = (settings: SiteSettings) => {
    setSiteSettings(settings);
  };

  return (
    <SiteSettingsContext.Provider value={{ siteSettings, saveSiteSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = (): SiteSettingsContextType => {
  const context = useContext(SiteSettingsContext);
  if (context === undefined) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
};
