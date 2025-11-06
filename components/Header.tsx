'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/lib/language-context';
import { Menu, X } from 'lucide-react';
import { PageType } from '@/app/page';

interface HeaderProps {
  currentPage: PageType;
  navigateTo: (page: PageType) => void;
}

export default function Header({ currentPage, navigateTo }: HeaderProps) {
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
              }}
            >
              {t('nav.home')}
            </button>
            <button 
              onClick={() => handleNavClick('about')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 'about' ? 'var(--color-gold)' : 'var(--color-cream)',
                cursor: 'pointer',
              }}
            >
              {t('nav.about')}
            </button>
            <button 
              onClick={() => handleNavClick('collection')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 'collection' ? 'var(--color-gold)' : 'var(--color-cream)',
                cursor: 'pointer',
              }}
            >
              {t('nav.collection')}
            </button>
            <button 
              onClick={() => handleNavClick('contact')}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: currentPage === 'contact' ? 'var(--color-gold)' : 'var(--color-cream)',
                cursor: 'pointer',
              }}
            >
              {t('nav.contact')}
            </button>
            
            <button onClick={toggleLanguage} className="lang-toggle">
              {language === 'en' ? 'العربية' : 'EN'}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={toggleMobileMenu} className="mobile-menu-btn">
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
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
          <button onClick={() => handleNavClick('home')}>{t('nav.home')}</button>
          <button onClick={() => handleNavClick('about')}>{t('nav.about')}</button>
          <button onClick={() => handleNavClick('collection')}>{t('nav.collection')}</button>
          <button onClick={() => handleNavClick('contact')}>{t('nav.contact')}</button>
          
          <button onClick={() => { toggleLanguage(); closeMobileMenu(); }} className="lang-toggle" style={{ marginTop: '1rem' }}>
            {language === 'en' ? 'العربية' : 'EN'}
          </button>
        </nav>
      </div>
    </>
  );
}
