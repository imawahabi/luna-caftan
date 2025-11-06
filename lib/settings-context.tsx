'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type SettingsMap = Record<string, string>;

interface SettingsContextValue {
  settings: SettingsMap;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateLocal: (updates: SettingsMap) => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

const DEFAULT_SETTINGS: SettingsMap = {
  site_title_ar: 'Luna Caftan | قفاطين مغربية فاخرة',
  site_title_en: 'Luna Caftan | Luxury Moroccan Caftans',
  site_description_ar: 'قفاطين مغربية فاخرة مصنوعة يدوياً من فاس إلى الكويت',
  site_description_en: 'Luxurious handcrafted Moroccan caftans from Fes to Kuwait',
  whatsapp_number: '+965 69059697',
  instagram_url: 'https://instagram.com/luna.caftan.kw',
  email: 'contact@lunacaftan.com',
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SettingsMap>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/settings');
      if (!res.ok) {
        throw new Error('Failed to load settings');
      }
      const data: SettingsMap = await res.json();
      setSettings((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('تعذر تحميل الإعدادات');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateLocal = (updates: SettingsMap) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  };

  const value: SettingsContextValue = {
    settings,
    loading,
    error,
    refresh: fetchSettings,
    updateLocal,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
