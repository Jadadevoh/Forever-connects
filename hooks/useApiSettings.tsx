

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
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
  stripeSecretKey: import.meta.env.VITE_STRIPE_SECRET_KEY || '',
  smtpHost: import.meta.env.VITE_SMTP_HOST || '',
  smtpPort: import.meta.env.VITE_SMTP_PORT || '',
  smtpUser: import.meta.env.VITE_SMTP_USER || '',
  smtpPass: import.meta.env.VITE_SMTP_PASS || '',
  paypalClientId: import.meta.env.VITE_PAYPAL_CLIENT_ID || '',
  enableApplePay: false,
  enableGooglePay: false,
  enableAch: false,
};

export const ApiSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [apiSettings, setApiSettings] = useState<ApiSettings>(() => {
    try {
      const storedSettings = window.localStorage.getItem(STORAGE_KEY);
      if (storedSettings) {
        const parsed = JSON.parse(storedSettings);
        // Merge: Use stored value, but if empty/falsy, fall back to initialSettings (env vars)
        return {
          ...initialSettings,
          ...parsed,
          stripePublicKey: parsed.stripePublicKey || initialSettings.stripePublicKey,
          stripeSecretKey: parsed.stripeSecretKey || initialSettings.stripeSecretKey,
          smtpHost: parsed.smtpHost || initialSettings.smtpHost,
          // Add other critical keys if needed, but these are the main ones
        };
      }
      return initialSettings;
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