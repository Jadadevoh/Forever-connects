

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// FIX: Exported ApiSettings interface and added SMTP fields to match usage in emailService.ts.
export interface ApiSettings {
  stripePublicKey: string;
  stripeSecretKey: string;
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  paypalClientId: string;
  enableApplePay: boolean;
  enableGooglePay: boolean;
  enableAch: boolean;
}

interface ApiSettingsContextType {
  apiSettings: ApiSettings;
  saveApiSettings: (settings: ApiSettings) => void;
}

const ApiSettingsContext = createContext<ApiSettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'api_settings';

const initialSettings: ApiSettings = {
  stripePublicKey: '',
  stripeSecretKey: '',
  smtpHost: '',
  smtpPort: '',
  smtpUser: '',
  smtpPass: '',
  paypalClientId: '',
  enableApplePay: false,
  enableGooglePay: false,
  enableAch: false,
};

export const ApiSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiSettings, setApiSettings] = useState<ApiSettings>(() => {
    try {
      const storedSettings = window.localStorage.getItem(STORAGE_KEY);
      return storedSettings ? JSON.parse(storedSettings) : initialSettings;
    } catch (error) {
      console.error("Error reading API settings from localStorage", error);
      return initialSettings;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(apiSettings));
    } catch (error) {
      console.error("Error writing API settings to localStorage", error);
    }
  }, [apiSettings]);

  const saveApiSettings = (settings: ApiSettings) => {
    setApiSettings(settings);
  };

  return (
    <ApiSettingsContext.Provider value={{ apiSettings, saveApiSettings }}>
      {children}
    </ApiSettingsContext.Provider>
  );
};

export const useApiSettings = (): ApiSettingsContextType => {
  const context = useContext(ApiSettingsContext);
  if (context === undefined) {
    throw new Error('useApiSettings must be used within an ApiSettingsProvider');
  }
  return context;
};