'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useProducts } from '@/lib/products-context';
import { useWishlist } from '@/lib/wishlist-context';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Heart, Star, ShoppingBag, Zap, Crown, Gem, ChevronLeft, ChevronRight, X, Eye, Sparkles, ZoomIn, Share2, Check, Tag, Bookmark } from 'lucide-react';
import { PageType } from '@/app/page';
import WishlistButton from '@/components/WishlistButton';
import { getProductTags } from '@/lib/tags-config';
import { 
  TitleSkeleton, 
  PriceSkeleton, 
  DescriptionSkeleton, 
  DetailsListSkeleton, 
  LikesSkeleton 
} from '@/components/LoadingStates';
import LoadingSpinner from '@/components/LoadingSpinner';

// Remove local Product interface and use the one from context
type Product = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: string;
  priceEn: string;
  details?: string[];
  detailsEn?: string[];
  images: string[];
  featured: boolean;
  likes?: number;
  tags?: string[];
  tagsEn?: string[];
  views?: number;
};

interface ProductDetailsProps {
  productId: string;
  navigateTo: (page: PageType, productId?: string) => void;
}

export default function ProductDetails({ productId, navigateTo }: ProductDetailsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { products: allProducts, loading: productsLoading, incrementViews } = useProducts();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [imageZoomed, setImageZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [zoomScale, setZoomScale] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [initialPinchDistance, setInitialPinchDistance] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Memoized similar products - must be after all useState hooks
  const similarProducts = useMemo(() => {
    return allProducts
      .filter(p => p.id !== productId)
      .slice(0, 4);
  }, [allProducts, productId]);

  const LIKED_PRODUCTS_STORAGE_KEY = 'luna-liked-products';

  const getStoredLikedProductIds = (): string[] => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = window.localStorage.getItem(LIKED_PRODUCTS_STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((id: unknown): id is string => typeof id === 'string');
    } catch (error) {
      console.error('Failed to read liked products from localStorage:', error);
      return [];
    }
  };

  const persistLikedProductIds = (ids: string[]) => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(LIKED_PRODUCTS_STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      console.error('Failed to store liked products in localStorage:', error);
    }
  };

  const syncLikedProductInStorage = (productId: string, liked: boolean) => {
    if (typeof window === 'undefined') return;
    const likedIds = getStoredLikedProductIds();
    const hasId = likedIds.includes(productId);

    if (liked && !hasId) {
      persistLikedProductIds([...likedIds, productId]);
    } else if (!liked && hasId) {
      persistLikedProductIds(likedIds.filter((id) => id !== productId));
    }
  };

  // Ensure images is always an array
  const productImages = product && Array.isArray(product.images) ? product.images : [];
  const firstImage = productImages[0] || '';

  // Generate URL slug for the product (always use English name for consistency)
  const generateSlug = (nameEn: string) => {
    return nameEn
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  // Update URL when product is loaded (only once, not on language change)
  useEffect(() => {
    if (product) {
      const slug = generateSlug(product.nameEn);
      const newUrl = `/caftans/${slug}`;
      
      // Update browser URL without page reload
      if (typeof window !== 'undefined' && window.location.pathname !== newUrl) {
        window.history.replaceState(
          { productId: product.id },
          '',
          newUrl
        );
      }
    }
  }, [product]);

  useEffect(() => {
    if (productsLoading) {
      setLoading(true);
      return;
    }
    
    const foundProduct = allProducts.find((p: Product) => p.id === productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
      setLikesCount(foundProduct.likes ?? 0);
      setHasLiked(getStoredLikedProductIds().includes(foundProduct.id));
      
      // Increment views using context function
      incrementViews(foundProduct.id).catch(error => {
        console.error('Failed to increment views:', error);
      });
    } else {
      setHasLiked(false);
    }
    setLoading(false);
    
    // Cleanup on unmount
    return () => {
      setProduct(null);
    };
  }, [productId, allProducts, productsLoading]);

  const handleLike = async () => {
    if (isLiking || !product) return;
    if (!product.id) {
      console.error('Error: Product ID is missing. Cannot toggle like.');
      return;
    }

    const previousLikes = likesCount;
    const previousHasLiked = hasLiked;
    const nextHasLiked = !hasLiked;
    const optimisticLikes = nextHasLiked
      ? previousLikes + 1
      : Math.max(0, previousLikes - 1);

    setIsLiking(true);
    setHasLiked(nextHasLiked);
    setLikesCount(optimisticLikes);
    syncLikedProductInStorage(product.id, nextHasLiked);

    try {
      const action = nextHasLiked ? 'add' : 'remove';

      const res = await fetch(`/api/products/${product.id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Like toggle failed:', res.status, errorData);
        throw new Error(`Failed to toggle like: Status ${res.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await res.json();
      if (typeof data.likes === 'number') {
        setLikesCount(data.likes);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      setHasLiked(previousHasLiked);
      setLikesCount(previousLikes);
      syncLikedProductInStorage(product.id, previousHasLiked);
    } finally {
      setIsLiking(false);
    }
  };

  const formatPrice = (price: string) => {
    if (!price || price.trim() === '') {
      return i18n.language === 'ar' ? 'السعر حسب الطلب' : 'Price on Request';
    }
    return price;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth > 768) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePosition({ x, y });
    }
  };

  const getPinchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    } else if (e.touches.length === 2) {
      const distance = getPinchDistance(e.touches);
      setInitialPinchDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && initialPinchDistance) {
      // Pinch to zoom
      const currentDistance = getPinchDistance(e.touches);
      const scale = Math.max(1, Math.min(3, (currentDistance / initialPinchDistance) * zoomScale));
      setZoomScale(scale);
      setImageZoomed(scale > 1);
    } else if (e.touches.length === 1 && touchStart && zoomScale > 1) {
      // Pan when zoomed
      const deltaX = e.touches[0].clientX - touchStart.x;
      const deltaY = e.touches[0].clientY - touchStart.y;
      setPanPosition({
        x: panPosition.x + deltaX,
        y: panPosition.y + deltaY,
      });
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 0) {
      setTouchStart(null);
      setInitialPinchDistance(null);
      // Reset if zoom is minimal
      if (zoomScale < 1.1) {
        setZoomScale(1);
        setPanPosition({ x: 0, y: 0 });
        setImageZoomed(false);
      }
    }
  };

  const handleImageClick = () => {
    if (window.innerWidth > 768) {
      setImageZoomed(!imageZoomed);
    } else {
      // On mobile, toggle between 1x and 2x zoom
      if (zoomScale === 1) {
        setZoomScale(2);
        setImageZoomed(true);
      } else {
        setZoomScale(1);
        setPanPosition({ x: 0, y: 0 });
        setImageZoomed(false);
      }
    }
  };

  if (loading) {
    return (
      <LoadingSpinner 
        message={i18n.language === 'ar' ? 'جاري تحميل القفطان...' : 'Loading caftan...'} 
        fullScreen 
      />
    );
  }

  if (!product) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1410 100%)',
      }}>
        <p style={{ color: 'var(--color-gold)', fontSize: '1.5rem' }}>
          {i18n.language === 'ar' ? 'القفطان غير موجود' : 'Caftan not found'}
        </p>
        <button onClick={() => navigateTo('collection')} className="btn btn-primary">
          {i18n.language === 'ar' ? 'العودة إلى القفاطين' : 'Back to Collection'}
        </button>
      </div>
    );
  }

  const orderViaWhatsApp = () => {
    const productName = i18n.language === 'ar' ? product.name : product.nameEn;
    const productPrice = formatPrice(i18n.language === 'ar' ? product.price : product.priceEn);
    const message = encodeURIComponent(
      i18n.language === 'ar' 
        ? `مرحباً Luna Caftan! أنا مهتم بطلب:\n\n${productName}\n${productPrice}`
        : `Hello Luna Caftan! I'm interested in ordering:\n\n${productName}\n${productPrice}`
    );
    window.open(`https://wa.me/96569059697?text=${message}`, '_blank');
  };

  const shareProduct = () => {
    if (navigator.share && product) {
      navigator.share({
        title: i18n.language === 'ar' ? product.name : product.nameEn,
        text: i18n.language === 'ar' ? product.description : product.descriptionEn,
        url: window.location.href,
      });
    }
  };

  const nextImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Enhanced Hero Section with Breadcrumb */}
      <section style={{
        height: '50vh',
        minHeight: '400px',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: '60px',
      }}>
        {/* Background Image */}
        {firstImage && (
          <>
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${firstImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(1) blur(1.8px) saturate(1.05)',
              transform: 'scale(1.06)',
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at center, rgba(232, 199, 111, 0.18) 0%, rgba(10, 10, 10, 0.6) 52%, rgba(10, 10, 10, 0.38) 100%)',
            }} />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(10, 10, 10, 0.47) 0%, rgba(26, 20, 16, 0.67) 100%)',
            }} />
          </>
        )}
        
        {/* Animated Background Elements */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
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
            width: '250px',
            height: '250px',
            background: 'radial-gradient(circle, rgba(232, 199, 111, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            zIndex: 1,
          }}
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{
            position: 'absolute',
            bottom: '10%',
            right: '5%',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            zIndex: 1,
          }}
        />

        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          {/* Breadcrumb with Badge Style */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.6rem 1.2rem',
              background: 'rgba(0, 0, 0, 0.4)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(232, 199, 111, 0.3)',
              borderRadius: '50px',
              marginBottom: '2rem',
              marginTop: '2rem',
              color: 'rgba(232, 199, 111, 0.8)',
              fontSize: '0.9rem',
            }}>
            <button
              onClick={() => navigateTo('home')}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(232, 199, 111, 0.7)',
                cursor: 'pointer',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(232, 199, 111, 0.7)'}
            >
              {i18n.language === 'ar' ? 'الرئيسية' : 'Home'}
            </button>
            <span>{isRTL ? '←' : '→'}</span>
            <button
              onClick={() => navigateTo('collection')}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(232, 199, 111, 0.7)',
                cursor: 'pointer',
                transition: 'color 0.3s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-gold)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(232, 199, 111, 0.7)'}
            >
              {i18n.language === 'ar' ? 'القفاطين' : 'Collection'}
            </button>
            <span>{isRTL ? '←' : '→'}</span>
            <span style={{ color: 'var(--color-gold)' }}>
              {product ? (i18n.language === 'ar' ? product.name : product.nameEn) : '...'}
            </span>
          </motion.div>

          {/* Product Name in Hero with Enhanced Style */}
          {product ? (
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
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
              }}>
                {i18n.language === 'ar' ? product.name : product.nameEn}
            </motion.h1>
          ) : (
            <TitleSkeleton />
          )}

          {product?.featured && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.2), rgba(212, 175, 55, 0.15))',
              border: '1px solid rgba(232, 199, 111, 0.4)',
              borderRadius: '50px',
              padding: '0.5rem 1.25rem',
              color: 'var(--color-gold)',
              fontSize: '0.9rem',
              fontWeight: '600',
              boxShadow: '0 4px 12px rgba(232, 199, 111, 0.2)',
            }}>
              <Star size={16} fill="var(--color-gold)" />
              <span>{i18n.language === 'ar' ? 'قطعة مميزة' : 'Featured Caftan'}</span>
            </div>
          )}
          
          <style jsx>{`
            @keyframes shimmer {
              0% { background-position: 0% center; }
              100% { background-position: 200% center; }
            }
          `}</style>
        </div>
      </section>

      {/* Product Details Section */}
      <section className="section" style={{ 
        paddingTop: '4rem', 
        paddingBottom: '4rem',
        background: 'linear-gradient(180deg, #1a1410 0%, #0a0a0a 100%)',
      }}>
        <div className="container">
          {/* Back Button - Professional & Lightweight */}
          <div style={{ display: 'flex', justifyContent: isRTL ? 'flex-start' : 'flex-end', marginBottom: '3rem' }}>
            <motion.button
              onClick={() => navigateTo('collection')}
              whileHover={{ scale: 1.05, x: isRTL ? 8 : -8 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '0.75rem 1.75rem',
                background: 'transparent',
                border: '1px solid rgba(232, 199, 111, 0.2)',
                borderRadius: '50px',
                color: 'var(--color-gold)',
                fontSize: '0.9rem',
                fontWeight: '500',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                letterSpacing: '0.5px',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(232, 199, 111, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.4)';
                e.currentTarget.style.color = '#e8c76f';
                e.currentTarget.style.letterSpacing = '0.75px';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.2)';
                e.currentTarget.style.color = 'var(--color-gold)';
                e.currentTarget.style.letterSpacing = '0.5px';
              }}
            >
              <span style={{ 
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {isRTL ? <ArrowRight size={16} style={{ marginLeft: '2px' }} /> : <ArrowLeft size={16} style={{ marginRight: '2px' }} />}
                {i18n.language === 'ar' ? 'عودة للقفاطن' : 'Back to Caftans'}
              </span>
            </motion.button>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth > 968 ? '1.2fr 1fr' : '1fr', 
            gap: '5rem',
            alignItems: 'start',
          }}>
            {/* Images Gallery */}
            <div>
              {/* Main Image with Zoom */}
              <div 
                style={{ 
                  width: '100%', 
                  height: window.innerWidth > 768 ? '650px' : '500px', 
                  marginBottom: '2rem',
                  borderRadius: '24px',
                  overflow: imageZoomed ? 'hidden' : 'hidden',
                  border: '3px solid transparent',
                  backgroundImage: 'linear-gradient(#1a1410, #1a1410), linear-gradient(135deg, #f5e6c8, #e8c76f, #d4af37, #c9a961, #e8c76f)',
                  backgroundOrigin: 'border-box',
                  backgroundClip: 'padding-box, border-box',
                  position: 'relative',
                  boxShadow: '0 8px 32px rgba(232, 199, 111, 0.3), inset 0 0 60px rgba(232, 199, 111, 0.05)',
                  cursor: imageZoomed ? 'zoom-out' : 'zoom-in',
                  transition: 'all 0.4s ease',
                  touchAction: imageZoomed ? 'none' : 'auto',
                }}
                onClick={handleImageClick}
                onMouseMove={handleMouseMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={(e) => {
                  if (window.innerWidth > 768) {
                    e.currentTarget.style.boxShadow = '0 12px 48px rgba(232, 199, 111, 0.5), inset 0 0 80px rgba(232, 199, 111, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (window.innerWidth > 768) {
                    setImageZoomed(false);
                    setZoomScale(1);
                    setPanPosition({ x: 0, y: 0 });
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(232, 199, 111, 0.3), inset 0 0 60px rgba(232, 199, 111, 0.05)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }
                }}
              >
                <img 
                  src={product.images[selectedImage]} 
                  alt={`${i18n.language === 'ar' ? product.name : product.nameEn}`}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                    transform: window.innerWidth > 768 
                      ? (imageZoomed ? 'scale(2)' : 'scale(1)')
                      : `scale(${zoomScale}) translate(${panPosition.x / zoomScale}px, ${panPosition.y / zoomScale}px)`,
                    transformOrigin: window.innerWidth > 768 ? `${mousePosition.x}% ${mousePosition.y}%` : 'center center',
                    transition: (window.innerWidth > 768 && !imageZoomed) || (window.innerWidth <= 768 && zoomScale === 1) ? 'transform 0.3s' : 'none',
                  }}
                />
                
                {/* Action Buttons */}
                {!imageZoomed && (
                  <>
                    {/* Zoom Icon */}
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      [isRTL ? 'left' : 'right']: '20px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      backdropFilter: 'blur(10px)',
                      padding: '0.75rem',
                      borderRadius: '50%',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <ZoomIn size={20} />
                    </div>

                    {/* Like, Share & Wishlist Buttons */}
                    <div style={{
                      position: 'absolute',
                      top: '20px',
                      [isRTL ? 'right' : 'left']: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                    }}>
                      {/* Like Button with Counter */}
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleLike();
                          }}
                          disabled={isLiking}
                          style={{
                            background: hasLiked ? 'rgba(231, 76, 60, 0.9)' : 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(10px)',
                            border: hasLiked ? 'none' : 'none',
                            padding: '0.75rem',
                            borderRadius: '50%',
                            color: 'white',
                            cursor: isLiking ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s',
                            transform: isLiking ? 'scale(1.2)' : 'scale(1)',
                            boxShadow: hasLiked ? '0 4px 12px rgba(231, 76, 60, 0.4)' : 'none',
                          }}
                          onMouseEnter={(e) => {
                            if (!isLiking) e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            if (!isLiking) e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <Heart 
                            size={20} 
                            fill={hasLiked || isLiking ? '#fff' : 'none'}
                            style={{
                              transition: 'all 0.3s',
                            }}
                          />
                        </button>
                        
                        {/* Likes Counter Badge */}
                        {likesCount > 0 && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '-6px',
                              right: '-6px',
                              background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
                              borderRadius: '30px',
                              padding: '0.15rem 0.55rem',
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              color: '#fff',
                              boxShadow: '0 2px 7px rgba(231, 76, 60, 0.35)',
                              minWidth: '22px',
                              textAlign: 'center',
                            }}
                          >
                            {likesCount}
                          </div>
                        )}
                      </div>

                      {/* Share Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          shareProduct();
                        }}
                        style={{
                          background: 'rgba(0, 0, 0, 0.7)',
                          backdropFilter: 'blur(10px)',
                          border: 'none',
                          padding: '0.75rem',
                          borderRadius: '50%',
                          color: 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.3s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Share2 size={20} />
                      </button>

                      {/* Wishlist Button - Custom Design */}
                      <div style={{ position: 'relative' }}>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.id);
                          }}
                          style={{
                            background: isInWishlist(product.id) ? 'rgba(232, 199, 111, 0.9)' : 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(10px)',
                            border: isInWishlist(product.id) ? 'none' : 'none',
                            padding: '0.75rem',
                            borderRadius: '50%',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s',
                            boxShadow: isInWishlist(product.id) ? '0 4px 12px rgba(232, 199, 111, 0.4)' : 'none',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          <Bookmark 
                            size={20} 
                            fill={isInWishlist(product.id) ? '#fff' : 'none'}
                            style={{
                              transition: 'all 0.3s',
                            }}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Navigation Arrows */}
                    {product.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                          style={{
                            position: 'absolute',
                            top: '50%',
                            [isRTL ? 'right' : 'left']: '20px',
                            transform: 'translateY(-50%)',
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(10px)',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '50%',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                            e.currentTarget.style.background = 'rgba(232, 199, 111, 0.9)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                          }}
                        >
                          {isRTL ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                          style={{
                            position: 'absolute',
                            top: '50%',
                            [isRTL ? 'left' : 'right']: '20px',
                            transform: 'translateY(-50%)',
                            background: 'rgba(0, 0, 0, 0.7)',
                            backdropFilter: 'blur(10px)',
                            border: 'none',
                            padding: '1rem',
                            borderRadius: '50%',
                            color: 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.3s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
                            e.currentTarget.style.background = 'rgba(232, 199, 111, 0.9)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                          }}
                        >
                          {isRTL ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
                        </button>
                      </>
                    )}

                    {/* Image Counter */}
                    {product.images.length > 1 && (
                      <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(0, 0, 0, 0.7)',
                        backdropFilter: 'blur(10px)',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                      }}>
                        {selectedImage + 1} / {product.images.length}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '1rem',
                }}>
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: selectedImage === index 
                          ? '3px solid var(--color-gold)' 
                          : '1px solid rgba(232, 199, 111, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        opacity: selectedImage === index ? 1 : 0.5,
                        background: 'rgba(26, 20, 16, 0.4)',
                        transform: selectedImage === index ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: selectedImage === index 
                          ? '0 8px 24px rgba(232, 199, 111, 0.4)' 
                          : 'none',
                      }}
                      onMouseEnter={(e) => {
                        if (selectedImage !== index) {
                          e.currentTarget.style.opacity = '0.8';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedImage !== index) {
                          e.currentTarget.style.opacity = '0.5';
                          e.currentTarget.style.transform = 'scale(1)';
                        }
                      }}
                    >
                      <img 
                        src={image} 
                        alt={`Thumbnail ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div style={{ position: 'sticky', top: '100px' }}>
              {/* Description */}
              <div style={{ marginBottom: '2.5rem' }}>
                <h3 style={{ 
                  color: 'var(--color-cream)', 
                  fontSize: '1.3rem', 
                  fontWeight: '600',
                  marginBottom: '1rem',
                }}>
                  {i18n.language === 'ar' ? 'الوصف' : 'Description'}
                </h3>
                <p style={{ 
                  color: 'rgba(232, 199, 111, 0.8)', 
                  fontSize: '1.05rem', 
                  lineHeight: '1.8',
                  margin: 0,
                }}>
                  {i18n.language === 'ar' ? product.description : product.descriptionEn}
                </p>
              </div>

              {/* Tags */}  
              {getProductTags(product, i18n.language as 'ar' | 'en').length > 0 && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ 
                    color: 'var(--color-cream)', 
                    fontSize: '1.3rem', 
                    fontWeight: '600',
                    marginBottom: '1rem',
                  }}>
                    {i18n.language === 'ar' ? 'الوسوم' : 'Tags'}
                  </h3>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                  }}>
                    {getProductTags(product, i18n.language as 'ar' | 'en').map((tag: string, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          padding: '0.4rem 0.9rem',
                          background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.15), rgba(212, 175, 55, 0.1))',
                          border: '1.5px solid rgba(232, 199, 111, 0.3)',
                          borderRadius: '14px',
                          fontSize: '0.85rem',
                          color: '#e8c76f',
                          fontWeight: '500',
                          cursor: 'default',
                          transition: 'all 0.3s ease',
                        }}
                        whileHover={{
                          scale: 1.05,
                          borderColor: 'rgba(232, 199, 111, 0.5)',
                          background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.2), rgba(212, 175, 55, 0.15))',
                        }}
                      >
                        <Tag size={14} style={{ flexShrink: 0 }} />
                        <span>{tag}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Details */}
              {((i18n.language === 'ar' && product.details && product.details.length > 0) || 
                (i18n.language === 'en' && product.detailsEn && product.detailsEn.length > 0)) && (
                <div style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ 
                    color: 'var(--color-cream)', 
                    fontSize: '1.3rem', 
                    fontWeight: '600',
                    marginBottom: '1rem',
                  }}>
                    {i18n.language === 'ar' ? 'التفاصيل' : 'Details'}
                  </h3>
                  <ul style={{ 
                    listStyle: 'none', 
                    padding: 0, 
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem',
                  }}>
                    {(i18n.language === 'ar' ? product.details : product.detailsEn)?.map((detail, index) => (
                      <li 
                        key={index}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          color: 'rgba(232, 199, 111, 0.8)',
                          fontSize: '1rem',
                          lineHeight: '1.6',
                        }}
                      >
                        <Check 
                          size={20} 
                          style={{ 
                            color: 'var(--color-gold)', 
                            flexShrink: 0,
                            marginTop: '2px',
                          }} 
                        />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price Badge - At the end */}
              {product ? (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.12), rgba(212, 175, 55, 0.08))',
                  border: '2px solid rgba(232, 199, 111, 0.25)',
                  borderRadius: '16px',
                  padding: '1.25rem 1.75rem',
                  marginBottom: '2.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {/* Decorative corner */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    [isRTL ? 'left' : 'right']: 0,
                    width: '60px',
                    height: '60px',
                    background: 'linear-gradient(135deg, #e8c76f, #d4af37)',
                    clipPath: 'polygon(100% 0, 0 0, 100% 100%)',
                    opacity: 0.1,
                  }} />
                  <div style={{
                    position: 'relative',
                    zIndex: 1,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <div>
                      <p style={{
                        color: 'rgba(232, 199, 111, 0.8)',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        margin: '0 0 0.25rem 0',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                      }}>
                        {i18n.language === 'ar' ? 'السعر' : 'Price'}
                      </p>
                      <p style={{
                        color: 'var(--color-gold)',
                        fontSize: '1.35rem',
                        fontWeight: '700',
                        margin: 0,
                        letterSpacing: '0.5px',
                      }}>
                        {(product.price && product.price.trim() !== '')
                          ? (i18n.language === 'ar' ? product.price : product.priceEn)
                          : (i18n.language === 'ar' ? 'عند الطلب' : 'on Request')
                        }
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <PriceSkeleton />
              )}

              {/* WhatsApp Button */}
              <button
                onClick={orderViaWhatsApp}
                style={{
                  width: '100%',
                  padding: '1.25rem 2rem',
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  border: 'none',
                  borderRadius: '16px',
                  color: 'white',
                  fontSize: '1.15rem',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s',
                  boxShadow: '0 8px 24px rgba(37, 211, 102, 0.4)',
                  letterSpacing: '0.5px',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(37, 211, 102, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(37, 211, 102, 0.4)';
                }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                <span>{i18n.language === 'ar' ? 'اطلب عبر الواتساب' : 'Order via WhatsApp'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <section className="section" style={{ 
          paddingTop: '4rem', 
          paddingBottom: '6rem',
          background: '#0a0a0a',
        }}>
          <div className="container">
            {/* Section Header */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, var(--color-gold), transparent)',
                margin: '0 auto 1.5rem',
                borderRadius: '2px',
              }} />
              
              <h2 style={{ 
                fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #e8c76f, #d4af37)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
              }}>
                {i18n.language === 'ar' ? 'قفاطين مشابهة' : 'Similar Caftans'}
              </h2>
              
              <p style={{
                color: 'rgba(232, 199, 111, 0.7)',
                fontSize: '1.1rem',
                maxWidth: '600px',
                margin: '0 auto',
              }}>
                {i18n.language === 'ar' 
                  ? 'قد تعجبك هذه القفاطين أيضاً' 
                  : 'You might also like these caftans'}
              </p>
            </div>

            {/* Similar Products Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
              maxWidth: '1400px',
              margin: '0 auto',
            }}>
              {similarProducts.map((similarProduct) => {
                const hasPrice = similarProduct.price && similarProduct.price.trim() !== '';
                const hasTags = similarProduct.tags && similarProduct.tags.length > 0;
                const hasViews = typeof similarProduct.views === 'number' && similarProduct.views > 0;
                const hasLikes = typeof similarProduct.likes === 'number' && similarProduct.likes > 0;
                const hasStats = hasViews || hasLikes;
                
                return (
                  <motion.div
                    key={similarProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ y: -8 }}
                    style={{
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigateTo('product', similarProduct.id)}
                    onMouseEnter={() => setHoveredCard(similarProduct.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    {/* Glow Effect on Hover */}
                    <div style={{
                      position: 'absolute',
                      inset: '-2px',
                      background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.15), rgba(212, 175, 55, 0.1))',
                      borderRadius: '22px',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none',
                      zIndex: 0,
                    }}
                    className="card-glow"
                    />
                    
                    <div style={{
                      background: 'linear-gradient(145deg, rgba(26, 20, 16, 0.5), rgba(20, 15, 12, 0.6))',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(232, 199, 111, 0.12)',
                      borderRadius: '20px',
                      overflow: 'hidden',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      position: 'relative',
                      zIndex: 1,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.35)';
                      e.currentTarget.style.boxShadow = '0 16px 48px rgba(232, 199, 111, 0.25), 0 0 0 1px rgba(232, 199, 111, 0.1)';
                      e.currentTarget.style.transform = 'scale(1.01)';
                      const glow = e.currentTarget.parentElement?.querySelector('.card-glow') as HTMLElement;
                      if (glow) glow.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.12)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'scale(1)';
                      const glow = e.currentTarget.parentElement?.querySelector('.card-glow') as HTMLElement;
                      if (glow) glow.style.opacity = '0';
                    }}
                    >
                      {/* Image Container */}
                      <div style={{ 
                        height: '320px', 
                        position: 'relative', 
                        overflow: 'hidden',
                        background: 'rgba(0, 0, 0, 0.3)',
                      }}>
                        {/* Gradient Overlay */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(10, 8, 8, 0.8) 100%)',
                          zIndex: 1,
                          pointerEvents: 'none',
                        }} />
                        
                        <img 
                          src={similarProduct.images[0]} 
                          alt={i18n.language === 'ar' ? similarProduct.name : similarProduct.nameEn} 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        />
                        
                        {/* Wishlist Button */}
                        <WishlistButton 
                          productId={similarProduct.id}
                          isHovered={hoveredCard === similarProduct.id}
                          size={40}
                        />
                        
                        {/* Featured Badge */}
                        {similarProduct.featured && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            [isRTL ? 'left' : 'right']: '12px',
                            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.95), rgba(126, 34, 206, 0.95))',
                            backdropFilter: 'blur(10px)',
                            padding: '0.4rem 0.8rem',
                            borderRadius: '12px',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            zIndex: 2,
                            boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
                          }}>
                            <Star size={12} fill="white" />
                            <span>{i18n.language === 'ar' ? 'مميز' : 'Featured'}</span>
                          </div>
                        )}
                        
                        {/* Price Badge */}
                        {hasPrice && (
                          <div style={{
                            position: 'absolute',
                            top: '12px',
                            [isRTL ? 'right' : 'left']: '12px',
                            background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.95), rgba(212, 175, 55, 0.95))',
                            backdropFilter: 'blur(10px)',
                            padding: '0.5rem 1rem',
                            borderRadius: '12px',
                            color: '#1a1410',
                            fontSize: '0.85rem',
                            fontWeight: '700',
                            zIndex: 2,
                            boxShadow: '0 4px 12px rgba(232, 199, 111, 0.4)',
                          }}>
                            {i18n.language === 'ar' ? similarProduct.price : similarProduct.priceEn}
                          </div>
                        )}

                        {/* Stats Bar - Only show if there are actual stats > 0 */}
                        {hasStats && (
                          <div style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            right: '12px',
                            display: 'flex',
                            gap: '0.5rem',
                            zIndex: 2,
                          }}>
                            {/* Views - Only show if > 0 */}
                            {hasViews && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                  background: 'rgba(0, 0, 0, 0.75)',
                                  backdropFilter: 'blur(12px)',
                                  padding: '0.45rem 0.8rem',
                                  borderRadius: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  fontSize: '0.75rem',
                                  color: '#e8c76f',
                                  fontWeight: '600',
                                  border: '1px solid rgba(232, 199, 111, 0.2)',
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                }}
                              >
                                <Eye size={13} strokeWidth={2.5} />
                                <span>{similarProduct.views}</span>
                              </motion.div>
                            )}
                            
                            {/* Likes - Only show if > 0 */}
                            {hasLikes && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                  background: 'rgba(0, 0, 0, 0.75)',
                                  backdropFilter: 'blur(12px)',
                                  padding: '0.45rem 0.8rem',
                                  borderRadius: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.35rem',
                                  fontSize: '0.75rem',
                                  color: '#ef4444',
                                  fontWeight: '600',
                                  border: '1px solid rgba(239, 68, 68, 0.25)',
                                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                                }}
                              >
                                <Heart size={13} fill="#ef4444" strokeWidth={2.5} />
                                <span>{similarProduct.likes}</span>
                              </motion.div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ 
                        padding: '1.25rem',
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                      }}>
                        {/* Title */}
                        <h3 style={{ 
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: 'var(--color-cream)',
                          marginBottom: '0',
                          lineHeight: '1.4',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}>
                          {i18n.language === 'ar' ? similarProduct.name : similarProduct.nameEn}
                        </h3>
                        
                        {/* Description */}
                        <p style={{ 
                          fontSize: '0.85rem',
                          color: 'rgba(232, 199, 111, 0.6)',
                          lineHeight: '1.5',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          margin: 0,
                          flex: 1,
                        }}>
                          {i18n.language === 'ar' ? similarProduct.description : similarProduct.descriptionEn}
                        </p>

                        {/* Tags */}
                        {hasTags && similarProduct.tags && (
                          <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.4rem',
                            marginTop: 'auto',
                          }}>
                            {getProductTags(similarProduct, i18n.language as 'ar' | 'en').slice(0, 3).map((tag: string, index: number) => (
                              <motion.span
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.05 }}
                                style={{
                                  padding: '0.35rem 0.75rem',
                                  background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.1), rgba(212, 175, 55, 0.08))',
                                  border: '1px solid rgba(232, 199, 111, 0.25)',
                                  borderRadius: '10px',
                                  fontSize: '0.7rem',
                                  color: 'rgba(232, 199, 111, 0.85)',
                                  fontWeight: '600',
                                  cursor: 'default',
                                  transition: 'all 0.2s ease',
                                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                }}
                              >
                                {tag}
                              </motion.span>
                            ))}
                            {similarProduct.tags.length > 3 && (
                              <span style={{
                                padding: '0.35rem 0.75rem',
                                background: 'rgba(232, 199, 111, 0.06)',
                                border: '1px solid rgba(232, 199, 111, 0.18)',
                                borderRadius: '10px',
                                fontSize: '0.7rem',
                                color: 'rgba(232, 199, 111, 0.6)',
                                fontWeight: '600',
                              }}>
                                +{similarProduct.tags.length - 3}
                              </span>
                            )}
                          </div>
                        )}

                        {/* View Button */}
                        <motion.div 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingTop: '0.75rem',
                            borderTop: '1px solid rgba(232, 199, 111, 0.1)',
                            marginTop: 'auto',
                          }}
                          whileHover={{ x: isRTL ? -3 : 3 }}
                          transition={{ duration: 0.2 }}
                        >
                          <span style={{
                            fontSize: '0.85rem',
                            color: 'var(--color-gold)',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            transition: 'all 0.2s ease',
                          }}>
                            {i18n.language === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                            <motion.span
                              animate={{ x: isRTL ? [-2, 0, -2] : [2, 0, 2] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                            >
                              {isRTL ? <ArrowLeft size={14} strokeWidth={2.5} /> : <ArrowRight size={14} strokeWidth={2.5} />}
                            </motion.span>
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* View All Button - Professional & Lightweight */}
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <motion.button
                onClick={() => navigateTo('collection')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '0.875rem 2rem',
                  background: 'transparent',
                  border: '1px solid rgba(232, 199, 111, 0.2)',
                  borderRadius: '50px',
                  color: 'var(--color-gold)',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  letterSpacing: '0.5px',
                  position: 'relative',
                  overflow: 'hidden',
                  backdropFilter: 'blur(10px)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(232, 199, 111, 0.08)';
                  e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.4)';
                  e.currentTarget.style.color = '#e8c76f';
                  e.currentTarget.style.letterSpacing = '0.75px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.2)';
                  e.currentTarget.style.color = 'var(--color-gold)';
                  e.currentTarget.style.letterSpacing = '0.5px';
                }}
              >
                <span style={{ 
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  {i18n.language === 'ar' ? 'استكشفي المزيد' : 'Explore More'}
                  {isRTL ? <ArrowLeft size={16} style={{ marginLeft: '2px' }} /> : <ArrowRight size={16} style={{ marginRight: '2px' }} />}
                </span>
              </motion.button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
