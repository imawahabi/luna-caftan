'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { PageType } from '@/app/page';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';

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
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [isMobile, setIsMobile] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
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
          <img src="/images/hero.jpg" alt="Luna Caftan" />
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
                <MessageCircle size={20} />
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
        viewport={{ once: true, amount: 0.1 }}
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
            className="products-grid"
            variants={sectionVariants}
          >
            {loading ? (
              <div style={{ gridColumn: '1 / -1' }}>
                <LoadingSpinner message={i18n.language === 'ar' ? 'جاري تحميل القفاطين...' : 'Loading Caftans...'} />
              </div>
            ) : (
              <>
                {products.slice(0, 3).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variants={itemVariants}
                    onClick={() => navigateTo('product', product.id)}
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
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container">
          <div className="section-header" style={{ marginBottom: '4rem' }}>
            <span className="section-badge">{i18n.language === 'ar' ? 'قصتنا' : 'Our Story'}</span>
            <h2 className="section-title">{t('about.title')}</h2>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
            gap: '4rem', 
            alignItems: 'center' 
          }}>
            {!isMobile && (
              <div style={{ 
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              }}>
                <img 
                  src="/images/about.jpg" 
                  alt="About Luna Caftan"
                  style={{ 
                    width: '100%', 
                    height: '550px', 
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%)',
                  border: '2px solid rgba(232, 199, 111, 0.2)',
                  borderRadius: '20px',
                }}></div>
              </div>
            )}
            
            <div style={{ 
              textAlign: isRTL ? 'right' : 'left',
              direction: isRTL ? 'rtl' : 'ltr',
              display: 'flex', 
              flexDirection: 'column',
              gap: '2rem'
            }}>
              <p style={{ 
                fontSize: '1.15rem', 
                lineHeight: '2', 
                color: 'var(--color-light-gold)'
              }}>
                {i18n.language === 'ar'
                  ? 'منذ إطلاق بوتيك لونا أونلاين في أكتوبر 2025، أصبح كل قفطان قصيدة فاخرة تنسج في فاس خصيصاً لأذواق الجميع، مع عناية استثنائية بالتفاصيل وخامات لا تضاهى.'
                  : 'Since Luna Boutique launched online in October 2025, every caftan has become a luxurious ode woven in Fes for the refined taste of women in Kuwait, crafted with exceptional detail and unrivaled materials.'}
              </p>

              <div style={{
                padding: '2rem',
                background: 'rgba(232, 199, 111, 0.05)',
                border: '2px solid rgba(232, 199, 111, 0.2)',
                borderRadius: '15px',
                backdropFilter: 'blur(10px)',
              }}>
                <p style={{ 
                  fontSize: '1.3rem',
                  fontWeight: '600',
                  color: 'var(--color-gold)',
                  marginBottom: '0.5rem',
                  textAlign: 'center'
                }}>
                  {i18n.language === 'ar' ? 'نعيمه لبرينيه · أم راكان' : 'Naima Labrinia · Om Rakan'}
                </p>
                <p style={{
                  fontSize: '0.95rem',
                  color: 'var(--color-light-gold)',
                  textAlign: 'center',
                  opacity: 0.9
                }}>
                  {i18n.language === 'ar' ? 'مؤسسة بوتيك لونا' : 'Founder of Luna Boutique'}
                </p>
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
