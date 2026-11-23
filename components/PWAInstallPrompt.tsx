'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Download, X } from 'lucide-react';
import Image from 'next/image';

const COMPACT_BREAKPOINT = 1024;
const DISMISS_KEY = 'pwa-install-dismissed';

interface DeferredPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
}

export default function PWAInstallPrompt() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const prefersReducedMotion = useReducedMotion();
  const [deferredPrompt, setDeferredPrompt] = useState<DeferredPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = window.matchMedia(`(max-width: ${COMPACT_BREAKPOINT}px)`);
    const legacyQuery = query as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };
    const syncViewport = () => {
      setIsCompact(query.matches);
    };

    syncViewport();
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', syncViewport);
    } else {
      legacyQuery.addListener?.(syncViewport);
    }

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      const promptEvent = event as DeferredPromptEvent;
      setDeferredPrompt(promptEvent);
      const isDismissed = localStorage.getItem(DISMISS_KEY);

      if (!isDismissed && query.matches) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistration('/sw.js')
        .then((existing) => {
          if (!existing) {
            return navigator.serviceWorker.register('/sw.js');
          }
          return existing;
        })
        .catch((error) => console.log('Service Worker registration failed:', error));
    }

    return () => {
      if (typeof query.removeEventListener === 'function') {
        query.removeEventListener('change', syncViewport);
      } else {
        legacyQuery.removeListener?.(syncViewport);
      }
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem(DISMISS_KEY, 'true');
  };

  if (!isCompact || !showPrompt || !deferredPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={prefersReducedMotion ? false : { y: 28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={prefersReducedMotion ? { opacity: 0 } : { y: 28, opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0.12 : 0.2, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 80px + 0.75rem)',
          left: '0.9rem',
          right: '0.9rem',
          zIndex: 40,
          direction: isRTL ? 'rtl' : 'ltr',
          contain: 'layout paint style',
          transform: 'translateZ(0)',
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(18, 14, 11, 0.97), rgba(14, 11, 9, 0.97))',
            borderRadius: '14px',
            padding: '1rem',
            border: '1px solid rgba(232, 199, 111, 0.3)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.32)',
          }}
        >
          <button
            onClick={handleDismiss}
            style={{
              position: 'absolute',
              top: '0.55rem',
              [isRTL ? 'left' : 'right']: '0.55rem',
              background: 'rgba(0, 0, 0, 0.35)',
              border: '1px solid rgba(232, 199, 111, 0.25)',
              borderRadius: '999px',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              touchAction: 'manipulation',
            }}
            aria-label={isRTL ? 'إغلاق' : 'Close'}
          >
            <X size={16} style={{ color: 'rgba(232, 199, 111, 0.75)' }} />
          </button>

          <div
            style={{
              display: 'flex',
              gap: '0.85rem',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #e8c76f, #d4af37)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(232, 199, 111, 0.25)',
              }}
            >
              <Image
                src="/logo-white.png"
                alt="Luna Caftan"
                width={30}
                height={30}
                sizes="30px"
                style={{
                  width: '30px',
                  height: '30px',
                  objectFit: 'contain',
                }}
              />
            </div>

            <div style={{ flex: 1, paddingRight: isRTL ? '0' : '1rem', paddingLeft: isRTL ? '1rem' : '0' }}>
              <h3
                style={{
                  color: 'var(--color-gold)',
                  fontSize: '0.95rem',
                  fontWeight: '700',
                  marginBottom: '0.3rem',
                  lineHeight: '1.3',
                }}
              >
                {isRTL ? 'ثبّت تطبيق لونا' : 'Install Luna App'}
              </h3>
              <p
                style={{
                  color: 'rgba(232, 199, 111, 0.7)',
                  fontSize: '0.82rem',
                  lineHeight: '1.35',
                  marginBottom: '0.75rem',
                }}
              >
                {isRTL ? 'وصول أسرع وتجربة أكثر سلاسة على جهازك' : 'Faster access and smoother browsing on your device'}
              </p>

              <button
                onClick={handleInstall}
                style={{
                  width: '100%',
                  padding: '0.68rem',
                  background: 'linear-gradient(135deg, #e8c76f, #d4af37)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#1a1410',
                  fontSize: '0.88rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.45rem',
                  touchAction: 'manipulation',
                }}
              >
                <Download size={17} />
                <span>{isRTL ? 'تثبيت الآن' : 'Install Now'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
