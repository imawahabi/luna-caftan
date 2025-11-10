'use client';

import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function ScrollToTopButton() {
  const { i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when scrolled down more than 200px on all pages
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Check initial state
    toggleVisibility();
    
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8
      }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      onClick={scrollToTop}
      className="scroll-to-top-btn"
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: isMobile ? '1rem' : '2rem',
        right: isMobile ? '1rem' : '2rem',
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(16px) saturate(150%)',
        WebkitBackdropFilter: 'blur(16px) saturate(150%)',
        padding: isMobile ? '0.5rem' : (isHovered ? '0.5rem 1.1rem 0.5rem 0.5rem' : '0.5rem'),
        borderRadius: isMobile ? '50%' : (isHovered ? '50px' : '50%'),
        width: isMobile ? '44px' : (isHovered ? 'auto' : '40px'),
        height: isMobile ? '44px' : '40px',
        border: '1px solid rgba(232, 199, 111, 0.25)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(232, 199, 111, 0.1)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        transition: 'all 0.3s ease',
        minHeight: isMobile ? '44px' : 'auto',
        minWidth: isMobile ? '44px' : 'auto',
      }}
      aria-label="Scroll to top"
    >
      <ChevronUp 
        size={isMobile ? 20 : 18} 
        color="#e8c76f"
        strokeWidth={2.5}
        style={{
          flexShrink: 0,
          transition: 'all 0.3s ease',
        }}
      />
      
      {!isMobile && (
        <motion.span
          initial={{ width: 0, opacity: 0 }}
          animate={{ 
            width: isHovered ? 'auto' : 0,
            opacity: isHovered ? 1 : 0,
            margin: isHovered ? '0.5rem' : 0
          }}
          transition={{ 
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
          style={{
            color: '#e8c76f',
            fontSize: '0.8rem',
            fontWeight: '600',
            letterSpacing: '0.5px',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
          }}
        >
          {i18n.language === 'ar' ? 'الذهاب للأعلى' : 'Scroll to top'}
        </motion.span>
      )}
    </motion.button>
  );
}
