'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, Sparkles } from 'lucide-react';

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
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  variants?: any;
}

export default function ProductCard({ product, onClick, variants }: ProductCardProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const hasPrice = product.price && product.price.trim() !== '';
  
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
        
        {/* Featured Badge - Minimal & Elegant */}
        {product.featured && (
          <div style={{
            position: 'absolute',
            top: '20px',
            [isRTL ? 'left' : 'right']: '20px',
            width: '8px',
            height: '8px',
            background: '#e8c76f',
            borderRadius: '50%',
            boxShadow: '0 0 0 3px rgba(232, 199, 111, 0.2), 0 0 12px rgba(232, 199, 111, 0.6)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
        )}
        
        {/* Price Badge - Minimal & Clean */}
        {hasPrice && (
          <div style={{
            position: 'absolute',
            bottom: '20px',
            [isRTL ? 'right' : 'left']: '20px',
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
