'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useProducts } from '@/lib/products-context';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles, Star, Filter, Grid, List, TrendingUp, Search, SortAsc, Eye, Heart, ImageIcon, Tag, Bookmark } from 'lucide-react';
import { PageType } from '@/app/page';
import ProductCard from '@/components/ProductCard';
import ProductCardSkeleton from '@/components/ProductCardSkeleton';
import WishlistButton from '@/components/WishlistButton';
import { getProductTags } from '@/lib/tags-config';
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'featured'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sort products with featured first
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      if (a.featured === b.featured) return 0;
      return a.featured ? -1 : 1;
    });
  }, [products]);

  useEffect(() => {
    let filtered = products;
    
    // Apply filter
    if (filterType === 'featured') {
      filtered = filtered.filter(p => p.featured);
    }
    
    // Apply search (name + tags)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => {
        // Search in name
        const nameMatch = (i18n.language === 'ar' ? p.name : p.nameEn)
          .toLowerCase()
          .includes(query);
        
        // Search in tags
        const tagsMatch = p.tags && p.tags.some(tag => 
          tag.toLowerCase().includes(query)
        );
        
        return nameMatch || tagsMatch;
      });
    }
    
    setFilteredProducts(filtered);
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
    const product = products.find(p => p.id === productId);
    if (product) {
      const slug = generateSlug(product.nameEn);
      // Use prefetch for faster navigation
      router.prefetch(`/caftans/${slug}`);
      router.push(`/caftans/${slug}`);
    }
  }, [products, generateSlug, router]);

  return (
    <div>
      {/* Enhanced Hero Section */}
      <section className="hero" style={{ 
        minHeight: '60vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, rgba(10, 8, 8, 0.9) 0%, rgba(26, 20, 16, 0.8) 50%, rgba(10, 8, 8, 0.95) 100%)',
        overflow: 'hidden',
      }}>
        <div className="hero-bg">
          <img src="/images/hero.jpg" alt="Collection" />
          <div className="hero-overlay"></div>
        </div>

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
                padding: '0.6rem 1.2rem',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(232, 199, 111, 0.3)',
                borderRadius: '50px',
                marginBottom: '1.5rem',
              }}
            >
              <Sparkles size={16} color="#e8c76f" />
              <span style={{ color: '#e8c76f', fontSize: '0.9rem', fontWeight: '600', letterSpacing: '0.5px' }}>
                {t('collection.subtitle')}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              style={{ 
                fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #f5e6c8, #e8c76f, #d4af37)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                textShadow: '0 4px 12px rgba(232, 199, 111, 0.3)',
                letterSpacing: '1px',
                lineHeight: '1.2',
                maxWidth: '900px',
                margin: '1.5rem auto',
              }}
            >
              {t('collection.title')}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              style={{
                fontSize: '1.15rem',
                color: 'rgba(232, 199, 111, 0.8)',
                lineHeight: '1.8',
                maxWidth: '600px',
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
        padding: '3rem 0',
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
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '2rem',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #f5e6c8, #e8c76f)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.5rem',
                }}>
                  {products.length}
                </div>
                <div style={{ color: 'rgba(232, 199, 111, 0.7)', fontSize: '1rem' }}>
                  {i18n.language === 'ar' ? 'قفطان متاح' : 'Available Caftans'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #f5e6c8, #e8c76f)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.5rem',
                }}>
                  {featuredCount}
                </div>
                <div style={{ color: 'rgba(232, 199, 111, 0.7)', fontSize: '1rem' }}>
                  {i18n.language === 'ar' ? 'قفطان مميز' : 'Featured Caftans'}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '2.5rem',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #f5e6c8, #e8c76f)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '0.5rem',
                }}>
                  100%
                </div>
                <div style={{ color: 'rgba(232, 199, 111, 0.7)', fontSize: '1rem' }}>
                  {i18n.language === 'ar' ? 'صناعة يدوية' : 'Handcrafted'}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Search Section */}
      <section style={{
        padding: '2rem 0',
        borderBottom: '1px solid rgba(232, 199, 111, 0.1)',
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
              maxWidth: '600px',
              margin: '0 auto 2rem',
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
                  padding: '1rem 1.2rem',
                  paddingLeft: isRTL ? '1.2rem' : '3.4rem',
                  paddingRight: isRTL ? '3.4rem' : '1.2rem',
                  background: 'rgba(0, 0, 0, 0.3)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(232, 199, 111, 0.2)',
                  borderRadius: '50px',
                  color: '#f5e6c8',
                  fontSize: '1rem',
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
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setFilterType('all')}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: filterType === 'all' 
                    ? 'linear-gradient(135deg, rgba(232, 199, 111, 0.2), rgba(212, 175, 55, 0.15))'
                    : 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${filterType === 'all' ? 'rgba(232, 199, 111, 0.5)' : 'rgba(232, 199, 111, 0.2)'}`,
                  borderRadius: '50px',
                  color: filterType === 'all' ? '#e8c76f' : 'rgba(232, 199, 111, 0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
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
                  padding: '0.75rem 1.5rem',
                  background: filterType === 'featured'
                    ? 'linear-gradient(135deg, rgba(232, 199, 111, 0.2), rgba(212, 175, 55, 0.15))'
                    : 'rgba(0, 0, 0, 0.3)',
                  border: `1px solid ${filterType === 'featured' ? 'rgba(232, 199, 111, 0.5)' : 'rgba(232, 199, 111, 0.2)'}`,
                  borderRadius: '50px',
                  color: filterType === 'featured' ? '#e8c76f' : 'rgba(232, 199, 111, 0.7)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  backdropFilter: 'blur(10px)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
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
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '0.4rem',
                borderRadius: '50px',
                border: '1px solid rgba(232, 199, 111, 0.2)',
                backdropFilter: 'blur(10px)',
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
                gridTemplateColumns: viewMode === 'grid' 
                  ? 'repeat(auto-fill, minmax(380px, 1fr))'
                  : '1fr',
                gap: viewMode === 'grid' ? '3rem' : '2rem',
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
                          />
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
                          background: 'linear-gradient(135deg, rgba(26, 20, 16, 0.6), rgba(10, 8, 8, 0.8))',
                          backdropFilter: 'blur(20px)',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          border: '1px solid rgba(232, 199, 111, 0.15)',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => {
                          setHoveredProductId(product.id);
                          e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.4)';
                          e.currentTarget.style.transform = 'translateY(-4px)';
                          e.currentTarget.style.boxShadow = '0 20px 40px rgba(232, 199, 111, 0.15)';
                        }}
                        onMouseLeave={(e) => {
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
                          height: isMobile ? '200px' : '350px',
                          overflow: 'hidden',
                        }}>
                          <img
                            src={product.images[0]}
                            alt={i18n.language === 'ar' ? product.name : product.nameEn}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              transition: 'transform 0.5s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          />
                          
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
                          
                          {product.featured && (
                            <motion.div 
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                              style={{
                                position: 'absolute',
                                top: isMobile ? '0.8rem' : '1rem',
                                [isRTL ? 'left' : 'right']: isMobile ? '0.8rem' : '1rem',
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
                                  width: isHovered ? 'auto' : 0,
                                  opacity: isHovered ? 1 : 0,
                                  marginLeft: isHovered ? '0.25rem' : 0,
                                }}
                                transition={{
                                  duration: 0.35,
                                  ease: [0.4, 0, 0.2, 1],
                                  opacity: { delay: isHovered ? 0.1 : 0 },
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
                              fontSize: isMobile ? '1.3rem' : '1.8rem',
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
                              <p style={{
                                color: 'rgba(232, 199, 111, 0.7)',
                                lineHeight: '1.8',
                                marginBottom: '1rem',
                                fontSize: '1rem',
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                              }}>
                                {i18n.language === 'ar' ? product.description : product.descriptionEn}
                              </p>
                            )}
                            
                            {/* Tags - List View */}
                            {getProductTags(product, i18n.language as 'ar' | 'en').length > 0 && (
                              <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '0.5rem',
                                marginBottom: isMobile ? '0' : '1.5rem',
                              }}>
                                {getProductTags(product, i18n.language as 'ar' | 'en').slice(0, isMobile ? 2 : 4).map((tag: string, index: number) => (
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
                                {getProductTags(product, i18n.language as 'ar' | 'en').length > (isMobile ? 2 : 4) && (
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
                                    +{getProductTags(product, i18n.language as 'ar' | 'en').length - (isMobile ? 2 : 4)}
                                  </div>
                                )}
                              </div>
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
                              fontSize: isMobile ? '1.3rem' : '1.5rem',
                              fontWeight: 'bold',
                              color: '#e8c76f',
                            }}>
                              {i18n.language === 'ar' ? product.price : product.priceEn}
                            </div>
                            
                            {/* Additional Info Badges */}
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
                            onClick={() => navigateTo('product', product.id)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(232, 199, 111, 0.3), rgba(212, 175, 55, 0.25))';
                              e.currentTarget.style.transform = 'translateY(-1px)';
                            }}
                            onMouseLeave={(e) => {
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
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
