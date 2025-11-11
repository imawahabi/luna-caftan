'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist-context';
import { useTranslation } from 'react-i18next';

interface WishlistButtonProps {
  productId: string;
  isHovered?: boolean;
  size?: number;
}

export default function WishlistButton({ productId, isHovered = false, size = 40 }: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const inWishlist = isInWishlist(productId);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    toggleWishlist(productId);
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1,
        scale: 1
      }}
      transition={{ 
        duration: 0.5, 
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      style={{
        position: 'absolute',
        top: '20px',
        [isRTL ? 'right' : 'left']: '20px',
        background: inWishlist 
          ? 'rgba(232, 199, 111, 0.3)'
          : 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(16px) saturate(150%)',
        WebkitBackdropFilter: 'blur(16px) saturate(150%)',
        padding: isHovered ? '0.5rem 1.1rem 0.5rem 0.5rem' : '0.5rem',
        borderRadius: isHovered ? '50px' : '50%',
        width: isHovered ? 'auto' : `${size}px`,
        height: `${size}px`,
        border: inWishlist 
          ? '1px solid rgba(232, 199, 111, 0.5)'
          : '1px solid rgba(232, 199, 111, 0.25)',
        boxShadow: inWishlist
          ? '0 8px 32px rgba(232, 199, 111, 0.4), inset 0 1px 0 rgba(232, 199, 111, 0.2)'
          : '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(232, 199, 111, 0.1)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isHovered ? '0.5rem' : '0',
        zIndex: 10,
        overflow: 'hidden',
        whiteSpace: 'nowrap' as const,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
      }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: inWishlist
          ? '0 12px 40px rgba(232, 199, 111, 0.5), inset 0 1px 0 rgba(232, 199, 111, 0.3)'
          : '0 12px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(232, 199, 111, 0.15)'
      }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Subtle Glow */}
      <motion.div 
        animate={{
          opacity: isHovered ? (inWishlist ? 0.5 : 0.3) : 0.2,
        }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          inset: '-1px',
          background: inWishlist
            ? 'radial-gradient(circle at center, rgba(232, 199, 111, 0.3), transparent 70%)'
            : 'radial-gradient(circle at center, rgba(232, 199, 111, 0.2), transparent 70%)',
          borderRadius: '50px',
          pointerEvents: 'none',
          zIndex: -1,
        }} 
      />
      
      {/* Icon */}
      <motion.div
        animate={{ 
          rotate: isHovered ? [0, -10, 10, -10, 0] : 0,
        }}
        transition={{ 
          duration: 0.6,
          ease: 'easeInOut'
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Bookmark 
          size={16} 
          style={{ 
            color: '#e8c76f',
            fill: inWishlist ? '#e8c76f' : 'none',
            filter: 'drop-shadow(0 0 6px rgba(232, 199, 111, 0.4))',
            strokeWidth: 2,
          }} 
        />
      </motion.div>
      
      {/* Text */}
      <motion.span 
        initial={{ opacity: 0, width: 0, marginLeft: 0 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          width: isHovered ? 'auto' : 0,
          marginLeft: isHovered ? '0.25rem' : 0,
        }}
        transition={{ 
          duration: 0.35,
          ease: [0.4, 0, 0.2, 1],
          opacity: { delay: isHovered ? 0.1 : 0 }
        }}
        style={{
          color: '#e8c76f',
          fontSize: '0.8rem',
          fontWeight: '600',
          letterSpacing: '0.5px',
          textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
        }}
      >
        {inWishlist 
          ? (isRTL ? 'إلغاء من المفضلة' : 'Remove from Wishlist')
          : (isRTL ? 'إضافة للمفضلة' : 'Add to Wishlist')
        }
      </motion.span>
    </motion.button>
  );
}
