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
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { settings } = useSettings();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      const normalizedProducts = Array.isArray(data) ? data : [];
      const featuredFirst = [...normalizedProducts].sort((a, b) => {
        if (a.featured === b.featured) return 0;
        return a.featured ? -1 : 1;
      });
      setProducts(featuredFirst);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

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
              
              <a 
                href="https://wa.me/96569059697" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>{i18n.language === 'ar' ? 'تواصلي معنا' : 'Contact Us'}</span>
              </a>
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
                {products.slice(0, 3).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variants={itemVariants}
                    onClick={() => navigateToProduct(product.id)}
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

      {/* About Preview */}
      <motion.section
        className="section"
        style={{ 
          background: 'linear-gradient(180deg, #1a1410 0%, #0a0a0a 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: isMobile ? 0.01 : 0.2 }}
      >
        <div className="container">
          <div className="section-header" style={{ marginBottom: '4rem' }}>
            <span className="section-badge">{i18n.language === 'ar' ? 'قصتنا' : 'Our Story'}</span>
            <h2 className="section-title">{t('about.title')}</h2>
          </div>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '5rem',
            alignItems: 'center'
          }}>
            {/* Elegant Image Section */}
            {!isMobile && (
              <motion.div
                style={{
                  position: 'relative',
                  height: '400px',
                }}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                {/* Main Image */}
                <div style={{
                  position: 'relative',
                  height: '100%',
                  borderRadius: '0',
                  overflow: 'hidden',
                  boxShadow: '0 30px 90px rgba(0, 0, 0, 0.5)',
                }}>
                  <img 
                    src={settings.about_background_url || '/images/hero.jpg'} 
                    alt="Luna Caftan"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      filter: 'brightness(1) contrast(1.1)',
                    }} 
                  />
                  
                  {/* Elegant Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                  }} />
                  
                  {/* Golden Frame - Top */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, var(--color-gold) 50%, transparent 100%)',
                  }} />
                  
                  {/* Golden Frame - Bottom */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, var(--color-gold) 50%, transparent 100%)',
                  }} />
                  
                  {/* Golden Frame - Left */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: '1px',
                    background: 'linear-gradient(180deg, transparent 0%, var(--color-gold) 50%, transparent 100%)',
                  }} />
                  
                  {/* Golden Frame - Right */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: '1px',
                    background: 'linear-gradient(180deg, transparent 0%, var(--color-gold) 50%, transparent 100%)',
                  }} />
                </div>
                
                {/* Decorative Corner Accent */}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '-10px',
                  width: '80px',
                  height: '80px',
                  border: '2px solid var(--color-gold)',
                  borderRight: 'none',
                  borderBottom: 'none',
                  opacity: 0.6,
                }} />
                
                <div style={{
                  position: 'absolute',
                  bottom: '-10px',
                  right: '-10px',
                  width: '80px',
                  height: '80px',
                  border: '2px solid var(--color-gold)',
                  borderLeft: 'none',
                  borderTop: 'none',
                  opacity: 0.6,
                }} />
              </motion.div>
            )}
            
            {/* Mobile Image Section */}
            {isMobile && (
              <motion.div
                style={{
                  position: 'relative',
                  height: '250px',
                  marginBottom: '2rem',
                }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <div style={{
                  position: 'relative',
                  height: '100%',
                  borderRadius: '0',
                  overflow: 'hidden',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                }}>
                  <img 
                    src={settings.about_background_url || '/images/hero.jpg'} 
                    alt="Luna Caftan"
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      filter: 'brightness(1) contrast(1.1)',
                    }} 
                  />
                  
                  {/* Golden Frame - Mobile */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, var(--color-gold) 50%, transparent 100%)',
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, var(--color-gold) 50%, transparent 100%)',
                  }} />
                </div>
              </motion.div>
            )}
            
            <div style={{ 
              textAlign: isRTL ? 'right' : 'left',
              direction: isRTL ? 'rtl' : 'ltr',
              display: 'flex', 
              flexDirection: 'column',
              gap: '2rem'
            }}>
              {/* Elegant Quote */}
              <div style={{
                borderLeft: isRTL ? 'none' : '3px solid var(--color-gold)',
                borderRight: isRTL ? '3px solid var(--color-gold)' : 'none',
                paddingLeft: isRTL ? '0' : '2rem',
                paddingRight: isRTL ? '2rem' : '0',
                marginBottom: '1rem',
              }}>
                <p style={{ 
                  fontSize: '1.25rem', 
                  lineHeight: '1.9', 
                  color: 'var(--color-cream)',
                  fontWeight: '300',
                  fontStyle: 'italic',
                }}>
                  {i18n.language === 'ar'
                    ? 'منذ إطلاق بوتيك لونا أونلاين في أكتوبر 2025، أصبح كل قفطان قصيدة فاخرة تنسج في فاس خصيصاً لأذواق الجميع، مع عناية استثنائية بالتفاصيل وخامات لا تضاهى.'
                    : 'Since Luna Boutique launched online in October 2025, every caftan has become a luxurious ode woven in Fes for the refined taste of women in Kuwait, crafted with exceptional detail and unrivaled materials.'}
                </p>
              </div>

              {/* Founder Signature */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem 0',
                borderTop: '1px solid rgba(232, 199, 111, 0.2)',
                borderBottom: '1px solid rgba(232, 199, 111, 0.2)',
              }}>
                <div style={{
                  width: '4px',
                  height: '50px',
                  background: 'linear-gradient(180deg, var(--color-gold), transparent)',
                }} />
                <div>
                  <p style={{ 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'var(--color-gold)',
                    marginBottom: '0.3rem',
                    letterSpacing: '0.5px',
                  }}>
                    {i18n.language === 'ar' ? 'نعيمه لبرينيه · أم راكان' : 'Naima Labrinia · Om Rakan'}
                  </p>
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--color-light-gold)',
                    opacity: 0.8,
                  }}>
                    {i18n.language === 'ar' ? 'مؤسسة بوتيك لونا' : 'Founder of Luna Boutique'}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => navigateTo('about')} 
                className="btn btn-primary" 
                style={{ 
                  marginTop: '1rem',
                  alignSelf: isRTL ? 'flex-end' : 'flex-start',
                  display: 'inline-flex',
                  gap: '0.8rem',
                  flexDirection: isRTL ? 'row-reverse' : 'row'
                }}
              >
                <span>{i18n.language === 'ar' ? 'اعرف المزيد' : 'Learn More'}</span>
                {isRTL ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
