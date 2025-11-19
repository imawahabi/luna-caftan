'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import { useWishlist } from '@/lib/wishlist-context';
import { useProducts } from '@/lib/products-context';
import ProductCard from '@/components/ProductCard';
import { Bookmark, Trash2, Sparkles, Heart } from 'lucide-react';
import { generateProductSlug } from '@/lib/utils';
import { sortTagsByLanguage } from '@/lib/tags-config';
import { useNavigation } from '@/lib/navigation-context';

export default function WishlistPage() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const isRTL = i18n.language === 'ar';
  const { wishlist, clearWishlist, wishlistCount } = useWishlist();
  const { products } = useProducts();
  const { startNavigation } = useNavigation();

  // Filter products that are in wishlist
  const wishlistProducts = products.filter(product => wishlist.includes(product.id));

  const handleProductClick = (product: any) => {
    const slug = generateProductSlug(product);
    startNavigation();
    router.push(`/caftans/${slug}`);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div>
      {/* Enhanced Hero Section - Similar to Collection Page */}
      <section className="hero" style={{ 
        minHeight: '60vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        direction: isRTL ? 'rtl' : 'ltr',
      }}>
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/images/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }} />
        
        {/* Dark Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(10, 8, 8, 0.9) 0%, rgba(26, 20, 16, 0.85) 50%, rgba(10, 8, 8, 0.95) 100%)',
        }} />
        
        {/* Animated Background Pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(232, 199, 111, 0.03) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(212, 175, 55, 0.03) 0%, transparent 50%)',
          animation: 'pulse 8s ease-in-out infinite',
        }} />

        <div className="container" style={{ 
          position: 'relative', 
          zIndex: 1,
          padding: '4rem 1.5rem',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}
          >
            {/* Icon with Glow */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.15), rgba(212, 175, 55, 0.1))',
                border: '2px solid rgba(232, 199, 111, 0.3)',
                marginBottom: '2rem',
                position: 'relative',
              }}
            >
              <div style={{
                position: 'absolute',
                inset: '-10px',
                background: 'radial-gradient(circle, rgba(232, 199, 111, 0.2), transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(15px)',
                animation: 'pulse 3s ease-in-out infinite',
              }} />
              <Bookmark 
                size={36} 
                style={{ 
                  color: '#e8c76f',
                  fill: '#e8c76f',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 0 10px rgba(232, 199, 111, 0.5))'
                }} 
              />
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                fontWeight: '700',
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, #f5e6c8, #e8c76f, #d4af37)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1.2',
              }}
            >
              {isRTL ? 'المفضلة' : 'My Wishlist'}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              style={{
            color: 'rgba(232, 199, 111, 0.8)',
            fontSize: '1.1rem',
            margin: '0 0 1.5rem',
          }}>
              {isRTL 
                ? `لديكي ${wishlistCount} قفطان في قائمة المفضلة`
                : `You have ${wishlistCount} caftan${wishlistCount !== 1 ? 's' : ''} in your wishlist`
              }
            </motion.p>

            {/* Clear Wishlist Button */}
            {wishlistCount > 0 && (
              <motion.button
                onClick={clearWishlist}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease',
                }}
              >
                <Trash2 size={18} />
                <span>{isRTL ? 'مسح الكل' : 'Clear All'}</span>
              </motion.button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Wishlist Grid */}
      <section style={{ padding: '4rem 1.5rem', direction: isRTL ? 'rtl' : 'ltr' }}>
        {wishlistCount === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              maxWidth: '600px',
              margin: '0 auto',
            textAlign: 'center',
            padding: '3rem 2rem',
            background: 'rgba(26, 20, 16, 0.4)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(232, 199, 111, 0.15)',
          }}
        >
          <Bookmark 
            size={64} 
            style={{ 
              color: 'rgba(232, 199, 111, 0.3)',
              margin: '0 auto 1.5rem',
              display: 'block',
            }} 
          />
          <h2 style={{
            fontSize: '1.8rem',
            color: 'var(--color-cream)',
            marginBottom: '1rem',
          }}>
            {isRTL ? 'قائمة المفضلة فارغة' : 'Your Wishlist is Empty'}
          </h2>
          <p style={{
            color: 'rgba(232, 199, 111, 0.6)',
            fontSize: '1.1rem',
            marginBottom: '2rem',
            lineHeight: '1.6',
          }}>
            {isRTL 
              ? 'ابدأي بإضافة القفاطين التي تعجبكِ إلى قائمة المفضلة'
              : 'Start adding your favorite caftans to your wishlist'
            }
          </p>
          <motion.button
            onClick={() => {
              startNavigation();
              router.push('/collection');
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn btn-primary"
            style={{
              padding: '1rem 2rem',
              fontSize: '1rem',
            }}
          >
            {isRTL ? 'تصفح القفاطين' : 'Browse Caftans'}
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '2rem',
          }}
        >
          {wishlistProducts.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard
                product={product}
                onClick={() => handleProductClick(product)}
                showStats={true}
                showWishlist={true}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
      </section>
    </div>
  );
}
