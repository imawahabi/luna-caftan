'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useProducts } from '@/lib/products-context';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, Star, Filter, Grid, List, Search, Eye, Heart, ImageIcon, Tag } from 'lucide-react';
import { PageType } from '@/app/page';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import WishlistButton from '@/components/WishlistButton';
import { getProductTags } from '@/lib/tags-config';
import { useNavigation } from '@/lib/navigation-context';
import { useSettings } from '@/lib/settings-context';
import { canOptimizeImageSrc, sanitizeImageSrc } from '@/lib/image-utils';
import { 
  StatsSkeleton, 
  SearchSkeleton, 
  FilterSkeleton 
} from '@/components/LoadingStates';

interface CollectionPageProps {
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
  /** Campaign fields, set by lib/campaign.ts via the products provider */
  listPrice?: string;
  listPriceEn?: string;
  onSale?: boolean;
  images: string[];
  featured: boolean;
  likes?: number;
  details?: string[];
  tags?: string[];
  views?: number;
}

export default function CollectionPage({ navigateTo }: CollectionPageProps) {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { products, loading } = useProducts();
  const { settings } = useSettings();
  const { startNavigation } = useNavigation();
  const [filterType, setFilterType] = useState<'all' | 'featured'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [canHoverCards, setCanHoverCards] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const collectionHeroSrc = sanitizeImageSrc(
    settings.collection_hero_background_url || settings.hero_background_url,
    '/images/admin-bg.png'
  );
  const canOptimizeCollectionHeroImage = canOptimizeImageSrc(collectionHeroSrc);

  useEffect(() => {
    const checkMobile = () => {
      const currentWidth = window.innerWidth;
      const compact = window.innerWidth <= 1024;
      setViewportWidth(currentWidth);
      setIsMobile(compact);
      setCanHoverCards(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const gridColumns = useMemo(() => {
    if (viewMode !== 'grid') return 1;
    if (viewportWidth <= 370) return 1;
    if (viewportWidth <= 900) return 2;
    return 3;
  }, [viewMode, viewportWidth]);

  const gridGap = useMemo(() => {
    if (viewMode !== 'grid') {
      return isMobile ? '1rem' : '2rem';
    }

    if (viewportWidth <= 600) return '0.75rem';
    if (viewportWidth <= 1024) return '1rem';
    if (viewportWidth <= 1440) return '1.5rem';
    return '2rem';
  }, [isMobile, viewMode, viewportWidth]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (filterType === 'featured') {
      filtered = filtered.filter(p => p.featured);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        const nameMatch = (i18n.language === 'ar' ? p.name : p.nameEn)
          .toLowerCase()
          .includes(query);
        const tagsMatch = p.tags && p.tags.some(tag => 
          tag.toLowerCase().includes(query)
        );
        return nameMatch || tagsMatch;
      });
    }

    return filtered;
  }, [filterType, products, searchQuery, i18n.language]);

  // Memoize featured count to avoid recalculation
  const featuredCount = useMemo(() => 
    products.filter(p => p.featured).length,
    [products]
  );

  // Generate URL slug for navigation (always use English name for consistency)
  const generateSlug = useCallback((nameEn: string) => {
    return nameEn
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  }, []);

  // Navigate to product with SEO-friendly URL (optimized for speed)
  const navigateToProduct = useCallback((productId: string) => {
    startNavigation();
    const product = products.find(p => p.id === productId);
    if (product) {
      const slug = generateSlug(product.nameEn);
      // Use prefetch for faster navigation
      router.prefetch(`/caftans/${slug}`);
      router.push(`/caftans/${slug}`);
    }
  }, [generateSlug, products, router, startNavigation]);

  return (
    <div>
      {/* Enhanced Hero Section */}
      <section className="hero" style={{ 
        minHeight: isMobile ? '44vh' : '60vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(10, 8, 8, 0.9) 0%, rgba(26, 20, 16, 0.8) 50%, rgba(10, 8, 8, 0.95) 100%)',
        overflow: 'hidden',
      }}>
        <div className="hero-bg">
          {canOptimizeCollectionHeroImage ? (
            <Image
              src={collectionHeroSrc}
              alt="Collection"
              fill
              priority
              sizes="100vw"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={collectionHeroSrc}
              alt="Collection"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          )}
          <div className="hero-overlay"></div>
        </div>

        {!isMobile && (
          <>
            {/* Animated Background Elements */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{
                position: 'absolute',
                top: '10%',
                left: '5%',
                width: '300px',
                height: '300px',
                background: 'radial-gradient(circle, rgba(232, 199, 111, 0.15) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(80px)',
                zIndex: 1,
              }}
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
              style={{
                position: 'absolute',
                bottom: '15%',
                right: '8%',
                width: '400px',
                height: '400px',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
                borderRadius: '50%',
                filter: 'blur(100px)',
                zIndex: 1,
              }}
            />
          </>
        )}

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="hero-content" 
            style={{ maxWidth: '700px' }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: isMobile ? '0.5rem 0.9rem' : '0.6rem 1.2rem',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: isMobile ? 'none' : 'blur(16px)',
                border: '1px solid rgba(232, 199, 111, 0.3)',
                borderRadius: '50px',
                marginBottom: isMobile ? '0.9rem' : '1.5rem',
              }}
            >
              <Sparkles size={16} color="#e8c76f" />
              <span style={{ color: '#e8c76f', fontSize: isMobile ? '0.8rem' : '0.9rem', fontWeight: '600', letterSpacing: '0.5px' }}>
                {t('collection.subtitle')}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ 
                fontSize: isMobile ? 'clamp(2rem, 8vw, 2.6rem)' : 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #f5e6c8, #e8c76f, #d4af37)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 4px 12px rgba(232, 199, 111, 0.3)',
                letterSpacing: isMobile ? '0.2px' : '1px',
                lineHeight: isMobile ? '1.25' : '1.2',
                maxWidth: '900px',
                margin: isMobile ? '0.8rem auto 0.5rem' : '1.5rem auto',
              }}
            >
              {t('collection.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                fontSize: isMobile ? '0.95rem' : '1.15rem',
                color: 'rgba(232, 199, 111, 0.8)',
                lineHeight: isMobile ? '1.6' : '1.8',
                maxWidth: isMobile ? '34ch' : '600px',
              }}
            >
              {i18n.language === 'ar'
                ? 'اكتشفي تشكيلتنا الفاخرة من القفاطين المغربية المصنوعة يدوياً بعناية فائقة'
                : 'Discover our luxurious collection of handcrafted Moroccan caftans made with exceptional care'}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: isMobile ? '1.8rem 0' : '3rem 0',
        borderBottom: '1px solid rgba(232, 199, 111, 0.1)',
      }}>
        <div className="container">
          {loading ? (
            <StatsSkeleton />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? 'repeat(3, minmax(0, 1fr))' : 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: isMobile ? '0.6rem' : '2rem',
                textAlign: 'center',
              }}
            >
              <div style={{
                padding: isMobile ? '0.65rem 0.45rem' : '0',
                borderRadius: isMobile ? '12px' : '0',
                border: isMobile ? '1px solid rgba(232, 199, 111, 0.18)' : 'none',
                background: isMobile ? 'rgba(14, 10, 8, 0.65)' : 'transparent',
              }}>
                <div style={{
                  fontSize: isMobile ? '1.4rem' : '2.5rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #f5e6c8, #e8c76f)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: isMobile ? '0.2rem' : '0.5rem',
                }}>
                  {products.length}
                </div>
                <div style={{ color: 'rgba(232, 199, 111, 0.75)', fontSize: isMobile ? '0.7rem' : '1rem' }}>
                  {i18n.language === 'ar' ? 'قفطان متاح' : 'Available Caftans'}
                </div>
              </div>

              <div style={{
                padding: isMobile ? '0.65rem 0.45rem' : '0',
                borderRadius: isMobile ? '12px' : '0',
                border: isMobile ? '1px solid rgba(232, 199, 111, 0.18)' : 'none',
                background: isMobile ? 'rgba(14, 10, 8, 0.65)' : 'transparent',
              }}>
                <div style={{
                  fontSize: isMobile ? '1.4rem' : '2.5rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #f5e6c8, #e8c76f)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: isMobile ? '0.2rem' : '0.5rem',
                }}>
                  {featuredCount}
                </div>
                <div style={{ color: 'rgba(232, 199, 111, 0.75)', fontSize: isMobile ? '0.7rem' : '1rem' }}>
                  {i18n.language === 'ar' ? 'قفطان مميز' : 'Featured Caftans'}
                </div>
              </div>

              <div style={{
                padding: isMobile ? '0.65rem 0.45rem' : '0',
                borderRadius: isMobile ? '12px' : '0',
                border: isMobile ? '1px solid rgba(232, 199, 111, 0.18)' : 'none',
                background: isMobile ? 'rgba(14, 10, 8, 0.65)' : 'transparent',
              }}>
                <div style={{
                  fontSize: isMobile ? '1.4rem' : '2.5rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #f5e6c8, #e8c76f)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: isMobile ? '0.2rem' : '0.5rem',
                }}>
                  100%
                </div>
                <div style={{ color: 'rgba(232, 199, 111, 0.75)', fontSize: isMobile ? '0.7rem' : '1rem' }}>
                  {i18n.language === 'ar' ? 'صناعة يدوية' : 'Handcrafted'}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Search Section */}
      <section style={{
        padding: isMobile ? '1.15rem 0 1rem' : '2rem 0',
        borderBottom: '1px solid rgba(232, 199, 111, 0.1)',
        position: isMobile ? 'sticky' : 'static',
        top: isMobile ? '70px' : 'auto',
        zIndex: isMobile ? 25 : 'auto',
        background: isMobile ? 'rgba(5, 5, 5, 0.96)' : 'transparent',
        backdropFilter: isMobile ? 'blur(6px)' : 'none',
      }}>
        <div className="container">
          {loading ? (
            <SearchSkeleton />
          ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              maxWidth: isMobile ? '100%' : '600px',
              margin: isMobile ? '0 auto 1rem' : '0 auto 2rem',
            }}
          >
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
            }}>
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#e8c76f',
                  pointerEvents: 'none',
                  zIndex: 1,
                  [isRTL ? 'right' : 'left']: '1.5rem',
                }}
                aria-hidden="true"
              >
                <Search size={20} strokeWidth={2.2} />
              </div>
              <input
                type="text"
                placeholder={i18n.language === 'ar' ? 'ابحثي عن قفطان...' : 'Search for a caftan...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  paddingBlock: isMobile ? '0.85rem' : '1rem',
                  paddingInlineStart: isMobile ? '3rem' : '3.4rem',
                  paddingInlineEnd: isMobile ? '1rem' : '1.2rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: isMobile ? 'none' : 'blur(16px)',
                  border: '1px solid rgba(232, 199, 111, 0.2)',
                  borderRadius: isMobile ? '14px' : '50px',
                  color: '#f5e6c8',
                  fontSize: isMobile ? '0.92rem' : '1rem',
                  outline: 'none',
                  transition: 'all 0.3s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.5)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.2)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)';
                }}
              />
            </div>
          </motion.div>
          )}

          {/* Filter & View Controls */}
          {loading ? (
            <FilterSkeleton />
          ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              display: 'flex',
              justifyContent: isMobile ? 'center' : 'space-between',
              alignItems: isMobile ? 'stretch' : 'center',
              flexDirection: isMobile ? 'column' : 'row',
              flexWrap: 'wrap',
              gap: isMobile ? '0.9rem' : '1.5rem',
              marginBottom: isMobile ? '0.4rem' : '2rem',
              padding: isMobile ? '0.75rem' : '0',
              borderRadius: isMobile ? '14px' : '0',
              border: isMobile ? '1px solid rgba(232, 199, 111, 0.16)' : 'none',
              background: isMobile ? 'rgba(14, 10, 8, 0.7)' : 'transparent',
            }}
          >
            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: isMobile ? '0.55rem' : '1rem', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto' }}>
              <button
                onClick={() => setFilterType('all')}
                style={{
                  padding: isMobile ? '0.62rem 0.85rem' : '0.75rem 1.5rem',
                  flex: isMobile ? 1 : 'initial',
                  background: filterType === 'all' 
                    ? 'linear-gradient(135deg, rgba(232, 199, 111, 0.2), rgba(212, 175, 55, 0.15))'
                    : 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${filterType === 'all' ? 'rgba(232, 199, 111, 0.5)' : 'rgba(232, 199, 111, 0.2)'}`,
                  borderRadius: isMobile ? '12px' : '50px',
                  color: filterType === 'all' ? '#e8c76f' : 'rgba(232, 199, 111, 0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: isMobile ? '0.8rem' : '0.95rem',
                  fontWeight: '500',
                  backdropFilter: isMobile ? 'none' : 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  if (filterType !== 'all') {
                    e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filterType !== 'all') {
                    e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.2)';
                  }
                }}
              >
                {i18n.language === 'ar' ? `جميع القفاطين (${products.length})` : `All Caftans (${products.length})`}
              </button>

              <button
                onClick={() => setFilterType('featured')}
                style={{
                  padding: isMobile ? '0.62rem 0.85rem' : '0.75rem 1.5rem',
                  flex: isMobile ? 1 : 'initial',
                  background: filterType === 'featured'
                    ? 'linear-gradient(135deg, rgba(232, 199, 111, 0.2), rgba(212, 175, 55, 0.15))'
                    : 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${filterType === 'featured' ? 'rgba(232, 199, 111, 0.5)' : 'rgba(232, 199, 111, 0.2)'}`,
                  borderRadius: isMobile ? '12px' : '50px',
                  color: filterType === 'featured' ? '#e8c76f' : 'rgba(232, 199, 111, 0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: isMobile ? '0.8rem' : '0.95rem',
                  fontWeight: '500',
                  backdropFilter: isMobile ? 'none' : 'blur(10px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: isMobile ? '0.35rem' : '0.5rem',
                }}
                onMouseEnter={(e) => {
                  if (filterType !== 'featured') {
                    e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (filterType !== 'featured') {
                    e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.2)';
                  }
                }}
              >
                <Star size={16} fill={filterType === 'featured' ? '#e8c76f' : 'none'} />
                {i18n.language === 'ar' ? `المميزة (${featuredCount})` : `Featured (${featuredCount})`}
              </button>
            </div>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'center' : 'flex-start' }}>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.4rem',
                borderRadius: isMobile ? '12px' : '50px',
                border: '1px solid rgba(232, 199, 111, 0.2)',
                backdropFilter: isMobile ? 'none' : 'blur(10px)',
              }}>
              <button
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '0.6rem 1rem',
                  background: viewMode === 'grid' ? 'rgba(232, 199, 111, 0.2)' : 'transparent',
                  border: 'none',
                  borderRadius: '50px',
                  color: viewMode === 'grid' ? '#e8c76f' : 'rgba(232, 199, 111, 0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                style={{
                  padding: '0.6rem 1rem',
                  background: viewMode === 'list' ? 'rgba(232, 199, 111, 0.2)' : 'transparent',
                  border: 'none',
                  borderRadius: '50px',
                  color: viewMode === 'list' ? '#e8c76f' : 'rgba(232, 199, 111, 0.6)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <List size={18} />
              </button>
              </div>
            </div>
          </motion.div>
          )}

          {/* Results Count */}
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                color: 'rgba(232, 199, 111, 0.7)',
                fontSize: '0.95rem',
                marginTop: '1rem',
              }}
            >
              {i18n.language === 'ar' 
                ? `تم العثور على ${filteredProducts.length} قفطان`
                : `Found ${filteredProducts.length} caftan${filteredProducts.length !== 1 ? 's' : ''}`}
            </motion.div>
          )}
        </div>
      </section>

      {/* Products */}
      <section className="section" style={{ paddingTop: '3rem', paddingBottom: '4rem' }}>
        <div className="container">
          <AnimatePresence mode="wait">
            <motion.div 
              key={filterType}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              style={{
                display: 'grid',
                gridTemplateColumns: viewMode === 'grid' ? `repeat(${gridColumns}, minmax(0, 1fr))` : '1fr',
                gap: gridGap,
              }}
            >
              {loading ? (
                <>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </>
              ) : filteredProducts.length > 0 ? (
                <>
                  {filteredProducts.map((product: Product, index: number) => {
                    const isHovered = hoveredProductId === product.id;
                    const listImageSrc = sanitizeImageSrc(product.images[0], '/images/hero.jpg');
                    const canOptimizeListImage = canOptimizeImageSrc(listImageSrc);
                    const productTags = getProductTags(product, i18n.language as 'ar' | 'en');
                    const productPrice = (product.price && product.price.trim() !== '')
                      ? (i18n.language === 'ar' ? product.price : product.priceEn)
                      : (isRTL ? 'عند الطلب' : 'On request');
                    const priceLabel = isRTL ? 'السعر' : 'Price';
                    const productListPrice = product.onSale
                      ? (i18n.language === 'ar' ? product.listPrice : product.listPriceEn)
                      : undefined;

                    if (viewMode === 'grid') {
                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <ProductCard
                            product={product}
                            onClick={() => navigateToProduct(product.id)}
                            showStats={true}
                            showWishlist={true}
                            showDescription={!isMobile}
                            showTags={!isMobile}
                            titleSize="compact"
                          />
                        </motion.div>
                      );
                    }

                    if (isMobile) {
                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 18 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          whileHover={
                            canHoverCards
                              ? {
                                  y: -3,
                                  scale: 1.01,
                                  boxShadow: '0 14px 30px rgba(0, 0, 0, 0.34)',
                                  transition: { duration: 0.2, ease: 'easeOut' },
                                }
                              : undefined
                          }
                          onClick={() => navigateToProduct(product.id)}
                          onMouseEnter={() => {
                            if (!canHoverCards) return;
                            setHoveredProductId(product.id);
                          }}
                          onMouseLeave={() => {
                            if (!canHoverCards) return;
                            setHoveredProductId(null);
                          }}
                          style={{
                            position: 'relative',
                            borderRadius: '16px',
                            border: '1px solid rgba(232, 199, 111, 0.22)',
                            background: 'linear-gradient(135deg, rgba(16, 12, 10, 0.95), rgba(22, 16, 12, 0.97))',
                            boxShadow: '0 12px 28px rgba(0, 0, 0, 0.26)',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            direction: isRTL ? 'rtl' : 'ltr',
                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                          }}
                        >
                          <div
                            style={{
                              position: 'relative',
                              height: 'auto',
                              aspectRatio: '4 / 5',
                              overflow: 'hidden',
                            }}
                          >
                            {canOptimizeListImage ? (
                              <Image
                                src={listImageSrc}
                                alt={i18n.language === 'ar' ? product.name : product.nameEn}
                                fill
                                sizes="(max-width: 1024px) 100vw, 420px"
                                style={{
                                  objectFit: 'cover',
                                  objectPosition: 'center',
                                  transition: 'transform 0.3s ease',
                                  transform: canHoverCards && isHovered ? 'scale(1.035)' : 'scale(1)',
                                }}
                              />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={listImageSrc}
                                alt={i18n.language === 'ar' ? product.name : product.nameEn}
                                loading="lazy"
                                decoding="async"
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  objectPosition: 'center',
                                  transition: 'transform 0.3s ease',
                                  transform: canHoverCards && isHovered ? 'scale(1.035)' : 'scale(1)',
                                }}
                              />
                            )}

                            <div
                              style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(8, 8, 8, 0.78) 0%, rgba(8, 8, 8, 0.18) 55%, rgba(8,8,8,0.04) 100%)',
                                pointerEvents: 'none',
                              }}
                            />

                            {product.featured && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '0.7rem',
                                  [isRTL ? 'left' : 'right']: '0.7rem',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '0.3rem 0.5rem',
                                  borderRadius: '999px',
                                  background: 'rgba(0, 0, 0, 0.56)',
                                  border: '1px solid rgba(232, 199, 111, 0.3)',
                                  color: '#e8c76f',
                                  fontSize: '0.66rem',
                                  fontWeight: 700,
                                }}
                              >
                                <Sparkles size={11} />
                                <span>{isRTL ? 'مميز' : 'Featured'}</span>
                              </div>
                            )}

                            {product.onSale && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '0.7rem',
                                  [isRTL ? 'right' : 'left']: '0.7rem',
                                  background: 'linear-gradient(135deg, #e8c76f, #d4af37)',
                                  color: '#1a1410',
                                  padding: '0.32rem 0.65rem',
                                  borderRadius: '999px',
                                  border: '1px solid rgba(245, 230, 200, 0.55)',
                                  fontSize: '0.68rem',
                                  fontWeight: 800,
                                  lineHeight: 1.2,
                                  zIndex: 10,
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {isRTL ? 'خصم 20%' : '-20%'}
                              </div>
                            )}

                            <div
                              onClick={(e) => e.stopPropagation()}
                              style={{
                                position: 'absolute',
                                bottom: '0.6rem',
                                [isRTL ? 'left' : 'right']: '0.6rem',
                                zIndex: 10,
                              }}
                            >
                              <WishlistButton productId={product.id} isHovered={false} size={34} />
                            </div>
                          </div>

                          <div
                            style={{
                              padding: '0.95rem 1rem 1rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.6rem',
                            }}
                          >
                            <div style={{ minWidth: 0 }}>
                              <h3
                                style={{
                                  fontSize: '1rem',
                                  fontWeight: 700,
                                  color: '#f5e6c8',
                                  lineHeight: 1.35,
                                  marginBottom: '0.35rem',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {i18n.language === 'ar' ? product.name : product.nameEn}
                              </h3>
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.5rem',
                                marginTop: '0.15rem',
                              }}
                            >
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  gap: '0.3rem',
                                  maxWidth: productListPrice ? '218px' : '180px',
                                  padding: '0.35rem 0.62rem',
                                  borderRadius: '12px',
                                  border: '1px solid rgba(232, 199, 111, 0.32)',
                                  background: 'rgba(0, 0, 0, 0.62)',
                                  backdropFilter: 'blur(10px)',
                                  boxShadow: '0 5px 14px rgba(0, 0, 0, 0.28)',
                                }}
                              >
                                {isRTL ? (
                                  <>
                                    <Tag
                                      size={11}
                                      style={{
                                        color: '#e8c76f',
                                        flexShrink: 0,
                                      }}
                                    />
                                    <span
                                      style={{
                                        color: 'rgba(232, 199, 111, 0.78)',
                                        fontSize: '0.64rem',
                                        fontWeight: 600,
                                        lineHeight: 1.1,
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      {priceLabel}
                                    </span>
                                    <span
                                      style={{
                                        color: '#f5e6c8',
                                        fontSize: '0.86rem',
                                        fontWeight: 700,
                                        lineHeight: 1.15,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {productPrice}
                                    </span>
{productListPrice && (
  <span style={{ color: 'rgba(232, 199, 111, 0.55)', fontSize: '0.7rem', fontWeight: 600, lineHeight: 1.15, whiteSpace: 'nowrap', textDecoration: 'line-through' }}>
    {productListPrice}
  </span>
)}
                                  </>
                                ) : (
                                  <>
                                    <Tag
                                      size={11}
                                      style={{
                                        color: '#e8c76f',
                                        flexShrink: 0,
                                      }}
                                    />
                                    <span
                                      style={{
                                        color: 'rgba(232, 199, 111, 0.78)',
                                        fontSize: '0.64rem',
                                        fontWeight: 600,
                                        lineHeight: 1.1,
                                        whiteSpace: 'nowrap',
                                      }}
                                    >
                                      {priceLabel}
                                    </span>
                                    <span
                                      style={{
                                        color: '#f5e6c8',
                                        fontSize: '0.86rem',
                                        fontWeight: 700,
                                        lineHeight: 1.15,
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                      }}
                                    >
                                      {productPrice}
                                    </span>
{productListPrice && (
  <span style={{ color: 'rgba(232, 199, 111, 0.55)', fontSize: '0.7rem', fontWeight: 600, lineHeight: 1.15, whiteSpace: 'nowrap', textDecoration: 'line-through' }}>
    {productListPrice}
  </span>
)}
                                  </>
                                )}
                              </div>

                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  padding: '0.38rem 0.72rem',
                                  borderRadius: '999px',
                                  border: '1px solid rgba(232, 199, 111, 0.28)',
                                  background: 'rgba(232, 199, 111, 0.11)',
                                  color: '#e8c76f',
                                  fontSize: '0.74rem',
                                  fontWeight: 600,
                                }}
                              >
                                <Eye size={13} />
                                <span>{i18n.language === 'ar' ? 'عرض' : 'View'}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        onClick={() => navigateToProduct(product.id)}
                        style={{
                          display: isMobile ? 'flex' : 'grid',
                          flexDirection: isMobile ? 'column' : undefined,
                          gridTemplateColumns: isMobile ? undefined : '280px 1fr',
                          gap: isMobile ? '0' : '2rem',
                          background: isMobile
                            ? 'linear-gradient(135deg, rgba(20, 15, 12, 0.95), rgba(12, 9, 7, 0.95))'
                            : 'linear-gradient(135deg, rgba(26, 20, 16, 0.6), rgba(10, 8, 8, 0.8))',
                          backdropFilter: isMobile ? 'none' : 'blur(20px)',
                          borderRadius: isMobile ? '16px' : '20px',
                          overflow: 'hidden',
                          border: '1px solid rgba(232, 199, 111, 0.15)',
                          cursor: 'pointer',
                          transition: 'transform 0.24s ease, box-shadow 0.24s ease, border-color 0.24s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!canHoverCards) return;
                          setHoveredProductId(product.id);
                          e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.32)';
                          e.currentTarget.style.transform = 'translateY(-3px)';
                          e.currentTarget.style.boxShadow = '0 14px 30px rgba(0, 0, 0, 0.28)';
                        }}
                        onMouseLeave={(e) => {
                          if (!canHoverCards) return;
                          setHoveredProductId(null);
                          e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.15)';
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        {/* Image Section */}
                        <div style={{
                          position: 'relative',
                          width: isMobile ? '100%' : '280px',
                          height: 'auto',
                          aspectRatio: '4 / 5',
                          overflow: 'hidden',
                        }}>
                          {canOptimizeListImage ? (
                            <Image
                              src={listImageSrc}
                              alt={i18n.language === 'ar' ? product.name : product.nameEn}
                              fill
                              sizes="(max-width: 1024px) 100vw, 280px"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.35s ease',
                                transform: canHoverCards && isHovered ? 'scale(1.04)' : 'scale(1)',
                              }}
                            />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={listImageSrc}
                              alt={i18n.language === 'ar' ? product.name : product.nameEn}
                              loading="lazy"
                              decoding="async"
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.35s ease',
                                transform: canHoverCards && isHovered ? 'scale(1.04)' : 'scale(1)',
                              }}
                            />
                          )}
                          
                          {/* Wishlist Button on Image - List View */}
                          <div 
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              position: 'absolute',
                              top: '1rem',
                              [isRTL ? 'right' : 'left']: '1rem',
                              zIndex: 20,
                            }}
                          >
                            <WishlistButton 
                              productId={product.id}
                              isHovered={false}
                              size={40}
                            />
                          </div>
                          
                          {product.onSale && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '68px',
                                [isRTL ? 'right' : 'left']: '1rem',
                                background: 'linear-gradient(135deg, #e8c76f, #d4af37)',
                                color: '#1a1410',
                                padding: '0.32rem 0.65rem',
                                borderRadius: '999px',
                                border: '1px solid rgba(245, 230, 200, 0.55)',
                                fontSize: '0.68rem',
                                fontWeight: 800,
                                lineHeight: 1.2,
                                zIndex: 20,
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {isRTL ? 'خصم 20%' : '-20%'}
                            </div>
                          )}

                          {product.featured && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                              style={{
                                position: 'absolute',
                                top: isMobile ? '0.8rem' : '1rem',
                                [isRTL ? 'left' : 'right']: isMobile ? '0.8rem' : '1rem',
                                background: isMobile ? 'rgba(0, 0, 0, 0.55)' : 'rgba(0, 0, 0, 0.4)',
                                backdropFilter: isMobile ? 'none' : 'blur(16px) saturate(150%)',
                                WebkitBackdropFilter: isMobile ? 'none' : 'blur(16px) saturate(150%)',
                                padding: isHovered ? '0.5rem 1.1rem 0.5rem 0.5rem' : '0.5rem',
                                borderRadius: isMobile ? '12px' : (isHovered ? '50px' : '50%'),
                                width: isMobile ? 'auto' : (isHovered ? 'auto' : '40px'),
                                height: isMobile ? '34px' : '40px',
                                border: '1px solid rgba(232, 199, 111, 0.25)',
                                boxShadow: isMobile ? 'none' : '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(232, 199, 111, 0.1)',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: isMobile ? '0.35rem' : (isHovered ? '0.5rem' : '0'),
                                zIndex: 10,
                                overflow: 'hidden',
                                whiteSpace: 'nowrap' as const,
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                              }}
                            >
                              <motion.div
                                animate={{ opacity: isHovered ? 0.4 : 0.2 }}
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
                              <motion.div
                                animate={{ rotate: isHovered ? [0, -10, 10, -10, 0] : 0 }}
                                transition={{ duration: 0.6, ease: 'easeInOut' }}
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
                              <motion.span
                                initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                                animate={{
                                  width: isMobile ? 'auto' : (isHovered ? 'auto' : 0),
                                  opacity: isMobile ? 1 : (isHovered ? 1 : 0),
                                  marginLeft: isMobile ? '0.15rem' : (isHovered ? '0.25rem' : 0),
                                }}
                                transition={{
                                  duration: 0.35,
                                  ease: [0.4, 0, 0.2, 1],
                                  opacity: { delay: isHovered ? 0.1 : 0 },
                                }}
                                style={{
                                  color: '#e8c76f',
                                  fontSize: isMobile ? '0.72rem' : '0.8rem',
                                  fontWeight: '600',
                                  letterSpacing: '0.5px',
                                  textShadow: isMobile ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.5)',
                                  overflow: 'hidden',
                                }}
                              >
                                {isRTL ? 'قطعة مميزة' : 'Featured'}
                              </motion.span>
                            </motion.div>
                          )}
                        </div>

                        {/* Content Section */}
                        <div style={{
                          padding: isMobile ? '1.5rem' : '2rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}>
                          <div>
                            <h3 style={{
                              fontSize: isMobile ? '1.1rem' : '1.55rem',
                              fontWeight: 'bold',
                              background: 'linear-gradient(135deg, #f5e6c8, #e8c76f)',
                              WebkitBackgroundClip: 'text',
                              WebkitTextFillColor: 'transparent',
                              backgroundClip: 'text',
                              marginBottom: '0.8rem',
                            }}>
                              {i18n.language === 'ar' ? product.name : product.nameEn}
                            </h3>

                            {!isMobile && (
                              <>
                                <p
                                  style={{
                                    fontSize: '0.95rem',
                                    color: 'rgba(232, 199, 111, 0.72)',
                                    lineHeight: '1.75',
                                    marginBottom: '1rem',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    maxWidth: '58ch',
                                  }}
                                >
                                  {i18n.language === 'ar' ? product.description : product.descriptionEn}
                                </p>

                                {/* Tags - Desktop Details View */}
                                {productTags.length > 0 && (
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      gap: '0.5rem',
                                      marginBottom: '1.5rem',
                                    }}
                                  >
                                    {productTags.slice(0, 4).map((tag: string, index: number) => (
                                      <div
                                        key={index}
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: '0.25rem',
                                          padding: '0.25rem 0.75rem',
                                          background: 'rgba(232, 199, 111, 0.1)',
                                          border: '1px solid rgba(232, 199, 111, 0.25)',
                                          borderRadius: '12px',
                                          fontSize: '0.75rem',
                                          color: 'rgba(232, 199, 111, 0.8)',
                                          fontWeight: '500',
                                        }}
                                      >
                                        <Tag size={10} />
                                        <span>{tag}</span>
                                      </div>
                                    ))}
                                    {productTags.length > 4 && (
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          padding: '0.25rem 0.75rem',
                                          background: 'rgba(232, 199, 111, 0.05)',
                                          border: '1px solid rgba(232, 199, 111, 0.15)',
                                          borderRadius: '12px',
                                          fontSize: '0.75rem',
                                          color: 'rgba(232, 199, 111, 0.6)',
                                          fontWeight: '500',
                                        }}
                                      >
                                        +{productTags.length - 4}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>

                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            paddingTop: isMobile ? '1rem' : '1.5rem',
                            borderTop: isMobile ? 'none' : '1px solid rgba(232, 199, 111, 0.1)',
                            gap: '1rem',
                            flexWrap: 'wrap',
                          }}>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              flexDirection: 'row',
                              gap: isMobile ? '0.34rem' : '0.42rem',
                              maxWidth: isMobile ? '188px' : '230px',
                              padding: isMobile ? '0.4rem 0.68rem' : '0.5rem 0.9rem',
                              borderRadius: '20px',
                              border: '1px solid rgba(232, 199, 111, 0.34)',
                              background: 'rgba(0, 0, 0, 0.58)',
                              backdropFilter: isMobile ? 'none' : 'blur(10px)',
                              boxShadow: '0 6px 18px rgba(0, 0, 0, 0.28)',
                            }}>
                              {isRTL ? (
                                <>
                                  <Tag
                                    size={isMobile ? 11 : 13}
                                    style={{
                                      color: '#e8c76f',
                                      flexShrink: 0,
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: 'rgba(232, 199, 111, 0.8)',
                                      fontSize: isMobile ? '0.68rem' : '0.7rem',
                                      fontWeight: 600,
                                      lineHeight: 1,
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {priceLabel}
                                  </span>
                                  <span
                                    style={{
                                      color: '#f5e6c8',
                                      fontSize: isMobile ? '0.9rem' : '0.85rem',
                                      fontWeight: 700,
                                      lineHeight: 1,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {productPrice}
                                  </span>
{productListPrice && (
  <span style={{ color: 'rgba(232, 199, 111, 0.55)', fontSize: '0.7rem', fontWeight: 600, lineHeight: 1.15, whiteSpace: 'nowrap', textDecoration: 'line-through' }}>
    {productListPrice}
  </span>
)}
                                </>
                              ) : (
                                <>
                                  <Tag
                                    size={isMobile ? 11 : 13}
                                    style={{
                                      color: '#e8c76f',
                                      flexShrink: 0,
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: 'rgba(232, 199, 111, 0.8)',
                                      fontSize: isMobile ? '0.68rem' : '0.7rem',
                                      fontWeight: 600,
                                      lineHeight: 1,
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {priceLabel}
                                  </span>
                                  <span
                                    style={{
                                      color: '#f5e6c8',
                                      fontSize: isMobile ? '0.9rem' : '0.85rem',
                                      fontWeight: 700,
                                      lineHeight: 1,
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                    }}
                                  >
                                    {productPrice}
                                  </span>
{productListPrice && (
  <span style={{ color: 'rgba(232, 199, 111, 0.55)', fontSize: '0.7rem', fontWeight: 600, lineHeight: 1.15, whiteSpace: 'nowrap', textDecoration: 'line-through' }}>
    {productListPrice}
  </span>
)}
                                </>
                              )}
                            </div>
                            
                            {/* Additional Info Badges */}
                            {!isMobile && (
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.6rem',
                                flexWrap: 'wrap',
                              }}>
                              {/* Images Count */}
                              <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  padding: '0.5rem 0.9rem',
                                  background: 'rgba(255, 255, 255, 0.08)',
                                  backdropFilter: 'blur(12px)',
                                  border: '1px solid rgba(232, 199, 111, 0.4)',
                                  borderRadius: '20px',
                                  fontSize: '0.85rem',
                                  fontWeight: '600',
                                  color: '#e8c76f',
                                  boxShadow: '0 3px 12px rgba(0, 0, 0, 0.15)',
                                  minWidth: '70px',
                                  justifyContent: 'center',
                                }}
                              >
                                <ImageIcon size={15} />
                                <span>{product.images?.length || 0}</span>
                                <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                                  {i18n.language === 'ar' ? 'صور' : 'Photos'}
                                </span>
                              </motion.div>
                              
                              {/* Likes Count - Only show if likes > 0 */}
                              {product.likes !== undefined && product.likes > 0 && (
                                <motion.div 
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.2, duration: 0.3 }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0.5rem 0.9rem',
                                    background: 'rgba(231, 76, 60, 0.15)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(231, 76, 60, 0.4)',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: '#e74c3c',
                                    boxShadow: '0 3px 12px rgba(231, 76, 60, 0.2)',
                                    minWidth: '80px',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Heart size={15} fill="#e74c3c" />
                                  <span>{product.likes}</span>
                                  <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                                    {i18n.language === 'ar' ? 'إعجابات' : 'Likes'}
                                  </span>
                                </motion.div>
                              )}
                              
                              {/* Details Count - Based on details length */}
                              {product.details && product.details.length > 0 && (
                                <motion.div 
                                  initial={{ scale: 0.8, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ delay: 0.3, duration: 0.3 }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    padding: '0.5rem 0.9rem',
                                    background: 'rgba(52, 152, 219, 0.15)',
                                    backdropFilter: 'blur(12px)',
                                    border: '1px solid rgba(52, 152, 219, 0.4)',
                                    borderRadius: '20px',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    color: '#3498db',
                                    boxShadow: '0 3px 12px rgba(52, 152, 219, 0.2)',
                                    minWidth: '85px',
                                    justifyContent: 'center',
                                  }}
                                >
                                  <Sparkles size={15} />
                                  <span>{product.details.length}</span>
                                  <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                                    {i18n.language === 'ar' ? 'تفاصيل' : 'Details'}
                                  </span>
                                </motion.div>
                              )}
                              </div>
                            )}
                            
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              padding: isMobile ? '0.5rem 1rem' : '0.6rem 1.2rem',
                              background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.2), rgba(212, 175, 55, 0.15))',
                              border: '1px solid rgba(232, 199, 111, 0.3)',
                              borderRadius: '50px',
                              color: '#e8c76f',
                              fontSize: isMobile ? '0.85rem' : '0.9rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                            }}
                            onClick={() => navigateToProduct(product.id)}
                            onMouseEnter={(e) => {
                              if (!canHoverCards) return;
                              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(232, 199, 111, 0.3), rgba(212, 175, 55, 0.25))';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
                              if (!canHoverCards) return;
                              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(232, 199, 111, 0.2), rgba(212, 175, 55, 0.15))';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}>
                              <Eye size={isMobile ? 14 : 16} />
                              {i18n.language === 'ar' ? 'عرض' : 'View'}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    gridColumn: '1 / -1',
                    justifySelf: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: 'rgba(232, 199, 111, 0.6)',
                    minHeight: '280px',
                  }}
                >
                  <Filter size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                  <p style={{ fontSize: '1.2rem' }}>
                    {i18n.language === 'ar' ? 'لا توجد قفاطين مطابقة للفلتر' : 'No caftans match this filter'}
                  </p>
                  <button
                    onClick={() => navigateTo('home')}
                    style={{
                      marginTop: '1rem',
                      padding: '0.65rem 1.2rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(232, 199, 111, 0.3)',
                      background: 'rgba(232, 199, 111, 0.08)',
                      color: '#e8c76f',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {i18n.language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
