'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Download, X } from 'lucide-react';

export default function PWAInstallPrompt() {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Check if user has dismissed the prompt before
    const isDismissed = localStorage.getItem('pwa-install-dismissed');
    
    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Only show on mobile and if not dismissed
      if (!isDismissed && window.innerWidth < 768) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Only show on mobile
  if (!isMobile || !showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            bottom: '80px', // Above bottom navigation
            left: '1rem',
            right: '1rem',
            zIndex: 40,
            direction: isRTL ? 'rtl' : 'ltr',
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(26, 20, 16, 0.98), rgba(20, 15, 12, 0.98))',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '20px',
            padding: '1.25rem',
            border: '1px solid rgba(232, 199, 111, 0.3)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(232, 199, 111, 0.1)',
          }}>
            {/* Close Button */}
            <button
              onClick={handleDismiss}
              style={{
                position: 'absolute',
                top: '0.75rem',
                [isRTL ? 'left' : 'right']: '0.75rem',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(232, 199, 111, 0.2)',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            >
              <X size={16} style={{ color: 'rgba(232, 199, 111, 0.7)' }} />
            </button>

            <div style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'start',
            }}>
              {/* Icon */}
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #e8c76f, #d4af37)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(232, 199, 111, 0.3)',
              }}>
                <img 
                  src="/logo-white.png" 
                  alt="Luna Caftan" 
                  style={{
                    width: '32px',
                    height: '32px',
                    objectFit: 'contain',
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingRight: isRTL ? '0' : '1rem', paddingLeft: isRTL ? '1rem' : '0' }}>
                <h3 style={{
                  color: 'var(--color-gold)',
                  fontSize: '1rem',
                  fontWeight: '700',
                  marginBottom: '0.375rem',
                  lineHeight: '1.3',
                }}>
                  {isRTL ? 'ثبّت تطبيق لونا' : 'Install Luna App'}
                </h3>
                <p style={{
                  color: 'rgba(232, 199, 111, 0.7)',
                  fontSize: '0.85rem',
                  lineHeight: '1.4',
                  marginBottom: '0.875rem',
                }}>
                  {isRTL 
                    ? 'استمتع بتجربة أسرع وأسهل للوصول إلى قفاطيننا'
                    : 'Get faster access and a better experience'
                  }
                </p>

                {/* Install Button */}
                <button
                  onClick={handleInstall}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #e8c76f, #d4af37)',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#1a1410',
                    fontSize: '0.9rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 12px rgba(232, 199, 111, 0.3)',
                    transition: 'all 0.3s',
                  }}
                >
                  <Download size={18} />
                  <span>{isRTL ? 'تثبيت الآن' : 'Install Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
