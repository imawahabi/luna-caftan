'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageType } from '@/app/page';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import { useSettings } from '@/lib/settings-context';
import { useProducts } from '@/lib/products-context';

interface HomePageProps {
  navigateTo: (page: PageType, productId?: string) => void;
}

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

export default function HomePage({ navigateTo }: HomePageProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isMobile, setIsMobile] = useState(false);
  const { products, loading } = useProducts();
  const { settings } = useSettings();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Products are now loaded from context, no need for separate fetch

  // Generate URL slug for navigation (always use English name for consistency)
  const generateSlug = (nameEn: string) => {
    return nameEn
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Navigate to product with SEO-friendly URL (optimized for speed)
  const navigateToProduct = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const slug = generateSlug(product.nameEn);
      // Use prefetch for faster navigation
      router.prefetch(`/caftans/${slug}`);
      router.push(`/caftans/${slug}`);
    }
  };

  // Sort products to show featured first
  const featuredProducts = [...products].sort((a, b) => {
    if (a.featured === b.featured) return 0;
    return a.featured ? -1 : 1;
  });

  const sectionVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.9, 
        ease: [0.22, 0.61, 0.36, 1] as const,
        staggerChildren: 0.2 
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 0.61, 0.36, 1] as const },
    },
  };

  return (
    <div>
      {/* Hero Section */}
      <motion.section
        className="hero"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
      >
        <div className="hero-bg">
          <img
            src={settings.hero_background_url || '/images/hero.jpg'}
            alt="Luna Caftan"
          />
          <div className="hero-overlay"></div>
        </div>

        <div className="container">
          <div className="hero-content">  
            <img
              src="/logo-white.png"
              alt="Luna Caftan"
              className="logo-white logo-hero"
              style={{ marginBottom: '1.5rem' }}
            />
            <span className="hero-badge" data-dir={isRTL ? 'rtl' : 'ltr'}>
              {i18n.language === 'ar' ? 'Luxurious Moroccan caftans' : 'Handcrafted Elegance from Fes'}
            </span>
            
            <h1>
              <span className="gold">{t('home.hero.subtitle')}</span>
            </h1>

            <p>
              {i18n.language === 'ar' 
                ? 'قفاطين مغربية فاخرة مصنوعة يدوياً بأرقى الأقمشة والتطريز التقليدي من مدينة فاس العريقة'
                : 'Luxurious Moroccan caftans handcrafted with the finest fabrics and traditional embroidery from the ancient city of Fes'}
            </p>

            <div className="hero-buttons">
              <button onClick={() => navigateTo('collection')} className="btn btn-primary">
                <span>{t('collection.title')}</span>
                {i18n.language === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
              </button>
              
              <button 
                onClick={() => navigateTo('contact')}
                className="btn btn-outline"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>{i18n.language === 'ar' ? 'تواصلي معنا' : 'Contact Us'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Products Section */}
      <motion.section
        className="section"
        style={{ 
          background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1410 50%, #0a0a0a 100%)',
          position: 'relative'
        }}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: isMobile ? 0.01 : 0.1 }}
      >
        <div className="container">
          <div className="section-header">
            <span className="section-badge">{t('collection.subtitle')}</span>
            <h2 className="section-title">{t('collection.title')}</h2>
            <p className="section-description">
              {i18n.language === 'ar' 
                ? 'اكتشفي مجموعتنا المميزة من القفاطين المغربية الفاخرة'
                : 'Discover our exclusive collection of luxurious Moroccan caftans'}
            </p>
          </div>

          <motion.div 
            key={loading ? 'loading' : 'loaded'}
            className="products-grid"
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {loading ? (
              <>
                {[1, 2, 3].map((i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </>
            ) : products.length === 0 ? (
              <div style={{ 
                gridColumn: '1 / -1', 
                textAlign: 'center', 
                padding: '3rem',
                color: 'var(--color-light-gold)' 
              }}>
                <p>لا توجد قفاطين متاحة حالياً</p>
              </div>
            ) : (
              <>
                {featuredProducts.slice(0, 3).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variants={itemVariants}
                    onClick={() => navigateToProduct(product.id)}
                    showTags={false}
                  />
                ))}
              </>
            )}
          </motion.div>

          {/* زر عرض جميع القفاطين */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
            <button 
              onClick={() => navigateTo('collection')} 
              className="btn btn-outline"
              style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}
            >
              <span>{i18n.language === 'ar' ? 'عرض جميع القفاطين' : 'View All Caftans'}</span>
              {i18n.language === 'ar' ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
            </button>
          </div>
        </div>
      </motion.section>

      {/* About Preview - Professional & Minimal */}
      <motion.section
        className="section"
        style={{ 
          background: '#0a0a0a',
          position: 'relative',
          overflow: 'hidden',
          borderTop: '1px solid rgba(212, 175, 55, 0.1)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
        }}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: isMobile ? 0.01 : 0.2 }}
      >
        <div className="container">
          {/* Minimal Header */}
          <div style={{ 
            textAlign: 'center',
            maxWidth: '700px',
            margin: '0 auto',
            marginBottom: isMobile ? '3rem' : '5rem',
          }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              style={{
                display: 'inline-block',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{
                width: '60px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
                margin: '0 auto 1.5rem',
              }} />
              <h2 style={{
                fontSize: isMobile ? '2rem' : '2.5rem',
                fontWeight: '400',
                color: 'var(--color-cream)',
                letterSpacing: '2px',
                marginBottom: '1rem',
              }}>
                {t('about.title')}
              </h2>
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--color-light-gold)',
                opacity: 0.7,
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}>
                {i18n.language === 'ar' ? 'من فاس إلى الكويت' : 'From Fes to Kuwait'}
              </p>
            </motion.div>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: isMobile ? '3rem' : '5rem',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            {/* Professional Image Section with Elegant Frame */}
            <motion.div
              style={{
                position: 'relative',
                height: isMobile ? '350px' : '450px',
                order: isMobile ? 1 : (isRTL ? 2 : 1),
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
            >
              {/* Main Frame Container */}
              <div style={{
                position: 'relative',
                height: '100%',
                padding: '12px',
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(232, 199, 111, 0.05))',
                transition: 'all 0.4s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.15), rgba(232, 199, 111, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(232, 199, 111, 0.05)';
              }}>
                {/* Outer Border */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  transition: 'border-color 0.4s ease',
                }} className="frame-outer" />
                
                {/* Corner Accents */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '50px',
                  height: '50px',
                  borderTop: '2px solid var(--color-gold)',
                  borderLeft: '2px solid var(--color-gold)',
                  opacity: 0.6,
                  transition: 'opacity 0.4s ease',
                }} className="corner-accent" />
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '50px',
                  height: '50px',
                  borderTop: '2px solid var(--color-gold)',
                  borderRight: '2px solid var(--color-gold)',
                  opacity: 0.6,
                  transition: 'opacity 0.4s ease',
                }} className="corner-accent" />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '50px',
                  height: '50px',
                  borderBottom: '2px solid var(--color-gold)',
                  borderLeft: '2px solid var(--color-gold)',
                  opacity: 0.6,
                  transition: 'opacity 0.4s ease',
                }} className="corner-accent" />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '50px',
                  height: '50px',
                  borderBottom: '2px solid var(--color-gold)',
                  borderRight: '2px solid var(--color-gold)',
                  opacity: 0.6,
                  transition: 'opacity 0.4s ease',
                }} className="corner-accent" />
                
                {/* Image Container */}
                <div style={{
                  position: 'relative',
                  height: '100%',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                  transition: 'box-shadow 0.4s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 30px 80px rgba(212, 175, 55, 0.3)';
                  const corners = e.currentTarget.parentElement?.querySelectorAll('.corner-accent');
                  corners?.forEach(corner => (corner as HTMLElement).style.opacity = '1');
                  const outer = e.currentTarget.parentElement?.querySelector('.frame-outer') as HTMLElement;
                  if (outer) outer.style.borderColor = 'rgba(212, 175, 55, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
                  const corners = e.currentTarget.parentElement?.querySelectorAll('.corner-accent');
                  corners?.forEach(corner => (corner as HTMLElement).style.opacity = '0.6');
                  const outer = e.currentTarget.parentElement?.querySelector('.frame-outer') as HTMLElement;
                  if (outer) outer.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                }}>
                  <img 
                    src={settings.about_background_url || '/images/hero.jpg'} 
                    alt="Luna Caftan"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      filter: 'grayscale(0.15) contrast(1.1) brightness(0.95)',
                      transition: 'transform 0.6s ease, filter 0.4s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.filter = 'grayscale(0) contrast(1.1) brightness(1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.filter = 'grayscale(0.15) contrast(1.1) brightness(0.95)';
                    }}
                  />
                  
                  {/* Subtle Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, transparent 50%, rgba(10, 10, 10, 0.2) 100%)',
                    pointerEvents: 'none',
                  }} />
                </div>
              </div>
            </motion.div>
            
            {/* Professional Content Section */}
            <motion.div 
              style={{ 
                textAlign: isRTL ? 'right' : 'left',
                direction: isRTL ? 'rtl' : 'ltr',
                order: isMobile ? 2 : (isRTL ? 1 : 2),
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {/* Brand Name */}
              <div style={{
                marginBottom: '2rem',
                paddingBottom: '1.5rem',
                borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
              }}>
                <h3 style={{
                  fontSize: isMobile ? '1.5rem' : '1.8rem',
                  fontWeight: '300',
                  color: 'var(--color-gold)',
                  letterSpacing: '3px',
                  marginBottom: '0.5rem',
                }}>
                  {i18n.language === 'ar' ? 'بوتيك لونا' : 'LUNA CAFTAN'}
                </h3>
                <p style={{
                  fontSize: '0.9rem',
                  color: 'var(--color-light-gold)',
                  opacity: 0.7,
                  letterSpacing: '1px',
                }}>
                  {i18n.language === 'ar' ? 'قفاطين مغربية فاخرة - الكويت' : 'Luxury Moroccan Caftans - Kuwait'}
                </p>
              </div>

              {/* Main Description - Quoted from About Page */}
              <div>
                <p style={{ 
                  fontSize: isMobile ? '1.05rem' : '1.15rem', 
                  lineHeight: '2', 
                  color: 'var(--color-cream)',
                  fontWeight: '300',
                  marginBottom: '2rem',
                  opacity: 0.95,
                }}>
                  {i18n.language === 'ar'
                    ? 'بوتيك لونا متخصص في نقل تراث القفطان المغربي الأصيل من مدينة فاس العريقة إلى الكويت. نختار كل قطعة بعناية لتجمع بين الأصالة المغربية والذوق العصري، مع الحرص على جودة الصناعة اليدوية التي تميز كل قفطان.'
                    : 'Luna Boutique specializes in bringing authentic Moroccan caftan heritage from the historic city of Fes to Kuwait. We carefully select each piece to blend Moroccan authenticity with contemporary taste, while ensuring the quality of handcraftsmanship that distinguishes every caftan.'}
                </p>
                
                <p style={{ 
                  fontSize: isMobile ? '0.95rem' : '1.05rem', 
                  lineHeight: '1.9', 
                  color: 'rgba(232, 199, 111, 0.8)',
                  fontWeight: '300',
                  fontStyle: 'italic',
                  paddingLeft: isRTL ? '0' : '1.5rem',
                  paddingRight: isRTL ? '1.5rem' : '0',
                  borderLeft: isRTL ? 'none' : '2px solid rgba(212, 175, 55, 0.3)',
                  borderRight: isRTL ? '2px solid rgba(212, 175, 55, 0.3)' : 'none',
                }}>
                  {i18n.language === 'ar'
                    ? 'نؤمن بأن القفطان المغربي يحمل قصة وتراثاً عريقاً. لذلك نحرص على اختيار قطع تعكس جمال الصناعة اليدوية الفاسية.'
                    : 'We believe that the Moroccan caftan carries a story and rich heritage. Therefore, we carefully select pieces that reflect the beauty of Fassi craftsmanship.'}
                </p>
              </div>

              {/* Stats Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '2rem',
                marginBottom: '2.5rem',
                paddingTop: '2rem',
                borderTop: '1px solid rgba(212, 175, 55, 0.1)',
              }}>
                {[
                  { 
                    numberAr: '100%',
                    numberEn: '100%',
                    labelAr: 'صناعة يدوية',
                    labelEn: 'Handcrafted'
                  },
                  { 
                    numberAr: 'الكويت',
                    numberEn: 'Kuwait',
                    labelAr: 'المقر',
                    labelEn: 'Based in'
                  },
                  { 
                    numberAr: 'فاس',
                    numberEn: 'Fes',
                    labelAr: 'المصدر',
                    labelEn: 'From'
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    style={{
                      textAlign: 'center',
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                    viewport={{ once: true }}
                  >
                    <div style={{
                      fontSize: isMobile ? '1.3rem' : '1.5rem',
                      fontWeight: '300',
                      color: 'var(--color-gold)',
                      marginBottom: '0.5rem',
                      letterSpacing: '1px',
                    }}>
                      {i18n.language === 'ar' ? stat.numberAr : stat.numberEn}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--color-light-gold)',
                      opacity: 0.7,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}>
                      {i18n.language === 'ar' ? stat.labelAr : stat.labelEn}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Simple CTA */}
              <button 
                onClick={() => navigateTo('about')} 
                className="btn btn-outline"
                style={{ 
                  display: 'inline-flex',
                  gap: '0.8rem',
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  fontSize: '0.95rem',
                  padding: '0.9rem 2rem',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                <span>{i18n.language === 'ar' ? 'المزيد عنا' : 'Learn More'}</span>
                {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
