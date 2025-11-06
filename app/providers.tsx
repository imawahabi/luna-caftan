'use client';

import { SessionProvider } from 'next-auth/react';
import { LanguageProvider } from '@/lib/language-context';
import { I18nProvider } from '@/lib/i18n-provider';
import { SettingsProvider } from '@/lib/settings-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <I18nProvider>
        <LanguageProvider>
          <SettingsProvider>
            {children}
          </SettingsProvider>
        </LanguageProvider>
      </I18nProvider>
    </SessionProvider>
  );
}
