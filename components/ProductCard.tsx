'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, Sparkles, Heart, Images } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: string;
  priceEn: string;
  images: string[];
  featured: boolean;
  likes?: number;
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  variants?: any;
  showStats?: boolean;
}

export default function ProductCard({ product, onClick, variants, showStats = false }: ProductCardProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const hasPrice = product.price && product.price.trim() !== '';
  const [isHovered, setIsHovered] = React.useState(false);
  
  // Ensure images is always an array
  const images = Array.isArray(product.images) ? product.images : [];
  const firstImage = images[0] || '/images/hero.jpg'; // Fallback to hero image
  
  // Debug log
  if (!images[0]) {
    console.warn('Product missing image:', product.name, product.images);
  }

  return (
    <motion.button
      variants={variants}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: 'linear-gradient(145deg, rgba(26, 20, 16, 0.6), rgba(20, 15, 12, 0.8))',
        backdropFilter: 'blur(30px)',
        border: '3px solid transparent',
        backgroundImage: 'linear-gradient(145deg, rgba(26, 20, 16, 0.6), rgba(20, 15, 12, 0.8)), linear-gradient(135deg, #f5e6c8, #e8c76f, #d4af37, #c9a961, #e8c76f)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        borderRadius: '28px',
        overflow: 'hidden',
        cursor: 'pointer',
        textAlign: isRTL ? 'right' : 'left',
        direction: isRTL ? 'rtl' : 'ltr',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        boxShadow: '0 10px 40px rgba(232, 199, 111, 0.3), inset 0 0 60px rgba(232, 199, 111, 0.05)',
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
      whileHover={{ 
        y: -16, 
        scale: 1.02, 
        boxShadow: '0 24px 60px rgba(232, 199, 111, 0.5), inset 0 0 80px rgba(232, 199, 111, 0.08)',
        transition: { duration: 0.3, ease: 'easeOut' }
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Container */}
      <div style={{ 
        height: '450px', 
        position: 'relative', 
        overflow: 'hidden',
        borderRadius: '24px 24px 0 0',
      }}>
        <motion.img 
          src={firstImage} 
          alt={i18n.language === 'ar' ? product.name : product.nameEn} 
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.95)',
          }}
          whileHover={{ scale: 1.1, rotate: 1, filter: 'brightness(1)' }}
          transition={{ duration: 0.7 }}
        />
        
        {/* Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.3) 40%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        
        {/* Featured Badge - Elegant Glass Design */}
        {product.featured && (
          <motion.div 
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
              [isRTL ? 'left' : 'right']: '20px',
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(16px) saturate(150%)',
              WebkitBackdropFilter: 'blur(16px) saturate(150%)',
              padding: isHovered ? '0.5rem 1.1rem 0.5rem 0.5rem' : '0.5rem',
              borderRadius: isHovered ? '50px' : '50%',
              width: isHovered ? 'auto' : '40px',
              height: '40px',
              border: '1px solid rgba(232, 199, 111, 0.25)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(232, 199, 111, 0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: isHovered ? '0.5rem' : '0',
              zIndex: 10,
              overflow: 'hidden',
              whiteSpace: 'nowrap' as const,
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {/* Subtle Glow */}
            <motion.div 
              animate={{
                opacity: isHovered ? 0.4 : 0.2,
              }}
              transition={{ duration: 0.4 }}
              style={{
                position: 'absolute',
                inset: '-1px',
                background: 'radial-gradient(circle at center, rgba(232, 199, 111, 0.2), transparent 70%)',
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
              <Sparkles 
                size={16} 
                style={{ 
                  color: '#e8c76f',
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
              {isRTL ? 'قطعة مميزة' : 'Featured'}
            </motion.span>
          </motion.div>
        )}
        
        {/* Info Badges Container */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          right: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          {/* Left Side - Image Count & Likes */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          }}>
            {/* Image Count Badge */}
            {showStats && images.length > 0 && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(12px)',
                padding: '0.4rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid rgba(232, 199, 111, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}>
                <Images size={14} style={{ color: '#e8c76f' }} />
                <span style={{
                  color: '#e8c76f',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                }}>
                  {images.length}
                </span>
              </div>
            )}
            
            {/* Likes Badge */}
            {showStats && product.likes && product.likes > 0 && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(12px)',
                padding: '0.4rem 0.65rem',
                borderRadius: '8px',
                border: '1px solid rgba(232, 199, 111, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}>
                <Heart size={14} style={{ color: '#e8c76f', fill: '#e8c76f' }} />
                <span style={{
                  color: '#e8c76f',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                }}>
                  {product.likes}
                </span>
              </div>
            )}
          </div>
          
          {/* Right Side - Price Badge */}
          {hasPrice && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(10px)',
              padding: '0.5rem 0.9rem',
              borderRadius: '8px',
              border: '1px solid rgba(232, 199, 111, 0.2)',
            }}>
              <span style={{
                color: '#e8c76f',
                fontSize: '0.85rem',
                fontWeight: '600',
              }}>
                {i18n.language === 'ar' ? product.price : product.priceEn}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ 
        padding: '2rem',
        direction: isRTL ? 'rtl' : 'ltr',
        background: 'linear-gradient(to bottom, rgba(26, 20, 16, 0.8), rgba(20, 15, 12, 0.9))',
      }}>
        {/* Product Name */}
        <h3 style={{ 
          fontSize: '1.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #e8c76f, #d4af37)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '0.75rem',
          lineHeight: '1.3',
          letterSpacing: '0.3px',
        }}>
          {i18n.language === 'ar' ? product.name : product.nameEn}
        </h3>
        
        {/* Description */}
        <p style={{ 
          fontSize: '0.95rem',
          color: 'rgba(232, 199, 111, 0.7)',
          marginBottom: '1.5rem',
          lineHeight: '1.6',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {i18n.language === 'ar' ? product.description : product.descriptionEn}
        </p>
        
        {/* View Details - Minimal Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 0',
          borderTop: '1px solid rgba(232, 199, 111, 0.15)',
          color: 'rgba(232, 199, 111, 0.7)',
          fontSize: '0.85rem',
          fontWeight: '500',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--color-gold)';
          const icon = e.currentTarget.querySelector('svg') as SVGElement;
          if (icon) icon.style.transform = isRTL ? 'translateX(-4px)' : 'translateX(4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'rgba(232, 199, 111, 0.7)';
          const icon = e.currentTarget.querySelector('svg') as SVGElement;
          if (icon) icon.style.transform = 'translateX(0)';
        }}
        >
          <span>{i18n.language === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
          <Eye 
            size={16} 
            style={{ 
              transition: 'transform 0.3s ease',
              transform: isRTL ? 'rotate(180deg)' : 'rotate(0deg)'
            }} 
          />
        </div>
      </div>
    </motion.button>
  );
}
