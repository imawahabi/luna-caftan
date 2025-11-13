'use client';

import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Globe, User, Heart, ShoppingBag, Search, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '../lib/language-context';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useWishlist } from '@/lib/wishlist-context';
import { PageType } from '@/app/page';

interface HeaderProps {
  currentPage: PageType;
  navigateTo: (page: PageType) => void;
}

export default function Header({ currentPage, navigateTo }: HeaderProps) {
  const { language, changeLanguage, isChangingLanguage, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [isLangHovered, setIsLangHovered] = useState(false);
  const { wishlistCount } = useWishlist();
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleNavClick = (page: PageType) => {
    navigateTo(page);
    closeMobileMenu();
  };

  return (
    <>
      <header>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <button
              onClick={() => handleNavClick('home')}
              className="logo"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              aria-label="Luna Caftan Home"
            >
              <img 
                src="/logo-white.png" 
                alt="Luna Caftan" 
                className="logo-white logo-header"
              />
            </button>
            
            <div
              className="brand-info"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                borderInlineStart: '2px solid rgba(232, 199, 111, 0.3)',
                paddingInlineStart: '1.5rem',
                textAlign: language === 'ar' ? 'right' : 'left',
              }}
            >
              <div style={{ 
                fontSize: '1.3rem', 
                fontWeight: '600',
                color: 'var(--color-gold)',
                letterSpacing: '1px',
                lineHeight: '1.2',
              }}>
                {language === 'ar' ? 'بوتيك لونا' : 'Luna Caftan'}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: 'var(--color-light-gold)',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                opacity: 0.9,
              }}>
                {language === 'ar' ? 'أنوثة كويتية بفخامة مغربية' : 'Feminine Moroccan Luxury'}
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav>
            <button 
              onClick={() => handleNavClick('home')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 'home' ? 'var(--color-gold)' : 'var(--color-cream)',
                cursor: 'pointer',
                fontWeight: currentPage === 'home' ? 700 : 500,
              }}
            >
              {t('nav.home')}
            </button>
            <button 
              onClick={() => handleNavClick('collection')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 'collection' ? 'var(--color-gold)' : 'var(--color-cream)',
                cursor: 'pointer',
                fontWeight: currentPage === 'collection' ? 700 : 500,
              }}
            >
              {t('nav.collection')}
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 'about' ? 'var(--color-gold)' : 'var(--color-cream)',
                cursor: 'pointer',
                fontWeight: currentPage === 'about' ? 700 : 500,
              }}
            >
              {t('nav.about')}
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 'contact' ? 'var(--color-gold)' : 'var(--color-cream)',
                cursor: 'pointer',
                fontWeight: currentPage === 'contact' ? 700 : 500,
              }}
            >
              {t('nav.contact')}
            </button>
            
            {/* Wishlist Button - Desktop (after Contact) */}
            <button
              onClick={() => {
                router.push('/wishlist');
              }}
              className="desktop-wishlist-btn"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-cream)',
                cursor: 'pointer',
                fontWeight: 500,
                position: 'relative',
                alignItems: 'center',
                padding: '0.5rem',
              }}
            >
              <Bookmark size={20} />
              {wishlistCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '0',
                  right: '-2px',
                  background: 'linear-gradient(135deg, #e8c76f, #d4af37)',
                  color: '#1a1410',
                  fontSize: '0.65rem',
                  fontWeight: '700',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '10px',
                  minWidth: '18px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(232, 199, 111, 0.4)',
                  lineHeight: '1',
                }}>
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </button>
          </nav>

          {/* Mobile Wishlist Button */}
          <button
            onClick={() => {
              router.push('/wishlist');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-cream)',
              cursor: 'pointer',
              position: 'relative',
              alignItems: 'center',
              padding: '0.5rem',
            }}
            className="mobile-wishlist-btn"
          >
            <Bookmark size={20} />
            {wishlistCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '3px',
                right: '6px',
                background: 'linear-gradient(135deg, #e8c76f, #d4af37)',
                color: '#1a1410',
                fontSize: '0.65rem',
                fontWeight: '700',
                padding: '0.15rem 0.3rem',
                borderRadius: '10px',
                minWidth: '18px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(232, 199, 111, 0.4)',
                lineHeight: '1',
              }}>
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </button>

          {/* Language Toggle - Desktop & Mobile */}
          <motion.button 
            onClick={changeLanguage}
            className="lang-toggle-modern"
            disabled={isChangingLanguage}
            title={language === 'en' ? 'التبديل إلى العربية' : 'Switch to English'}
            onHoverStart={() => !isMobile && setIsLangHovered(true)}
            onHoverEnd={() => !isMobile && setIsLangHovered(false)}
          >
            <motion.div 
              className="lang-toggle-container"
              animate={{
                borderRadius: isLangHovered && !isMobile ? '30px' : '50%',
                width: isLangHovered && !isMobile ? 'auto' : '48px',
                minWidth: isLangHovered && !isMobile ? '120px' : '48px',
              }}
              transition={{
                duration: 0.35,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              {isChangingLanguage ? (
                <div className="lang-loading">
                  <span className="spinner" />
                </div>
              ) : (
                <>
                  {/* Active Language Flag */}
                  <div className="lang-current">
                    <motion.div
                      animate={{
                        scale: isLangHovered && !isMobile ? 1.05 : 1,
                      }}
                      transition={{
                        duration: 0.3,
                        ease: [0.4, 0, 0.2, 1],
                      }}
                      className="lang-flag-wrapper"
                    >
                      <span className={`fi ${language === 'en' ? 'fi-sa' : 'fi-gb'} fis lang-flag`}></span>
                    </motion.div>
                    <motion.span 
                      className="lang-text"
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ 
                        opacity: isLangHovered && !isMobile ? 1 : 0,
                        width: isLangHovered && !isMobile ? 'auto' : 0,
                        marginLeft: isLangHovered && !isMobile ? '0.5rem' : 0,
                      }}
                      transition={{ 
                        duration: 0.35,
                        ease: [0.4, 0, 0.2, 1],
                        opacity: { delay: isLangHovered && !isMobile ? 0.1 : 0 }
                      }}
                    >
                      {language === 'en' ? 'العربية' : 'English'}
                    </motion.span>
                  </div>
                </>
              )}
            </motion.div>
          </motion.button>

          {/* Mobile Menu Button */}
          <button onClick={toggleMobileMenu} className="mobile-menu-btn">
            {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div 
        className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}
        dir={language === 'ar' ? 'rtl' : 'ltr'}
        style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
      >
        <nav>
          <button
            onClick={() => handleNavClick('home')}
            style={{ fontWeight: currentPage === 'home' ? 700 : 500 }}
          >
            {t('nav.home')}
          </button>
          <button
            onClick={() => handleNavClick('collection')}
            style={{ fontWeight: currentPage === 'collection' ? 700 : 500 }}
          >
            {t('nav.collection')}
          </button>
          <button
            onClick={() => handleNavClick('about')}
            style={{ fontWeight: currentPage === 'about' ? 700 : 500 }}
          >
            {t('nav.about')}
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            style={{ fontWeight: currentPage === 'contact' ? 700 : 500 }}
          >
            {t('nav.contact')}
          </button>
        </nav>
      </div>
    </>
  );
}
