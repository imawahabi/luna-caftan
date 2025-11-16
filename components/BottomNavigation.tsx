'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Grid3X3, Bookmark, Phone, Info } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist-context';

export default function BottomNavigation() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const isRTL = i18n.language === 'ar';
  const { wishlistCount } = useWishlist();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { scrollY } = useScroll();

  // Always visible on mobile - removed hide on scroll logic
  useEffect(() => {
    // Keep bottom navigation always visible on mobile
    setIsVisible(true);
  }, []);

  // Only show on mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  const navItems = [
    { 
      icon: Home, 
      label: isRTL ? 'الرئيسية' : 'Home',
      path: '/'
    },
    { 
      icon: Grid3X3, 
      label: isRTL ? 'القفاطين' : 'Collection',
      path: '/collection'
    },
    { 
      icon: Bookmark, 
      label: isRTL ? 'المفضلة' : 'Wishlist',
      path: '/wishlist',
      badge: wishlistCount
    },
    { 
      icon: Phone, 
      label: isRTL ? 'تواصل' : 'Contact',
      path: '/contact'
    },
    { 
      icon: Info, 
      label: isRTL ? 'من نحن' : 'About',
      path: '/about'
    },
  ];

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        direction: isRTL ? 'rtl' : 'ltr',
        /* Ensure it sticks to the very bottom */
        marginBottom: 0,
        paddingBottom: 0,
      }}
    >
      <div style={{
        background: 'rgba(10, 10, 10, 0.95)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderTop: '1px solid rgba(232, 199, 111, 0.2)',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.3), 0 -2px 0 rgba(232, 199, 111, 0.1)',
        padding: '0.75rem 0.5rem calc(0.75rem + env(safe-area-inset-bottom, 0))',
        margin: 0,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <motion.button
                key={item.path}
                onClick={() => router.push(item.path)}
                whileTap={{ scale: 0.9 }}
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.5rem 0.75rem',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  minWidth: '60px',
                  transition: 'all 0.3s ease',
                }}
              >
                {/* Badge */}
                {item.badge !== undefined && item.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: 'absolute',
                      top: '0',
                      right: '10px',
                      background: 'linear-gradient(135deg, #e8c76f, #d4af37)',
                      color: '#1a1410',
                      fontSize: '0.65rem',
                      fontWeight: '700',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '10px',
                      minWidth: '18px',
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(232, 199, 111, 0.5)',
                      zIndex: 1,
                    }}
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </motion.div>
                )}

                {/* Icon Container */}
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon 
                    size={22} 
                    style={{ 
                      color: isActive ? '#e8c76f' : 'rgba(232, 199, 111, 0.5)',
                      filter: isActive 
                        ? 'drop-shadow(0 0 8px rgba(232, 199, 111, 0.5))'
                        : 'none',
                      transition: 'all 0.3s ease',
                      strokeWidth: isActive ? 2.5 : 2,
                    }} 
                  />
                  
                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="bottomNavIndicator"
                      style={{
                        position: 'absolute',
                        inset: '-8px',
                        background: 'radial-gradient(circle, rgba(232, 199, 111, 0.15), transparent 70%)',
                        borderRadius: '50%',
                        zIndex: -1,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </div>

                {/* Label */}
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: isActive ? '600' : '500',
                  color: isActive ? '#e8c76f' : 'rgba(232, 199, 111, 0.6)',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap',
                }}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}
