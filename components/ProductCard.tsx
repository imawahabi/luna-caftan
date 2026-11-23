'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Eye, Sparkles, Heart, Images, Tag } from 'lucide-react';
import Image from 'next/image';
import WishlistButton from './WishlistButton';
import { getProductTags } from '@/lib/tags-config';
import { canOptimizeImageSrc, sanitizeImageSrc } from '@/lib/image-utils';

const COMPACT_BREAKPOINT = 1024;

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
}

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  variants?: Variants;
  showStats?: boolean;
  showWishlist?: boolean;
  showTags?: boolean;
  showDescription?: boolean;
  layout?: 'vertical' | 'horizontal';
  titleSize?: 'default' | 'compact';
}

export default function ProductCard({
  product,
  onClick,
  variants,
  showStats = false,
  showWishlist = false,
  showTags = true,
  showDescription = true,
  layout = 'vertical',
  titleSize = 'default',
}: ProductCardProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const isHorizontal = layout === 'horizontal';
  const hasPrice = product.price && product.price.trim() !== '';
  const productPrice = isRTL ? product.price : product.priceEn;
  const priceLabel = isRTL ? 'السعر' : 'Price';
  const isOnSale = Boolean(product.onSale);
  const listPriceLabel = isOnSale
    ? (isRTL ? product.listPrice : product.listPriceEn)
    : undefined;
  const [isHovered, setIsHovered] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const compactQuery = window.matchMedia(`(max-width: ${COMPACT_BREAKPOINT}px)`);
    const hoverQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    const legacyCompactQuery = compactQuery as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };
    const legacyHoverQuery = hoverQuery as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };
    const syncViewport = () => {
      setIsCompact(compactQuery.matches);
      setCanHover(hoverQuery.matches);
    };

    syncViewport();

    if (typeof compactQuery.addEventListener === 'function' && typeof hoverQuery.addEventListener === 'function') {
      compactQuery.addEventListener('change', syncViewport);
      hoverQuery.addEventListener('change', syncViewport);

      return () => {
        compactQuery.removeEventListener('change', syncViewport);
        hoverQuery.removeEventListener('change', syncViewport);
      };
    }

    legacyCompactQuery.addListener?.(syncViewport);
    legacyHoverQuery.addListener?.(syncViewport);

    return () => {
      legacyCompactQuery.removeListener?.(syncViewport);
      legacyHoverQuery.removeListener?.(syncViewport);
    };
  }, []);

  const images = Array.isArray(product.images) ? product.images : [];
  const firstImage = sanitizeImageSrc(images[0], '/images/hero.jpg');
  const canOptimizeFirstImage = canOptimizeImageSrc(firstImage);
  const cardBackgroundImage = isCompact
    ? 'linear-gradient(145deg, rgba(26, 20, 16, 0.88), rgba(20, 15, 12, 0.94))'
    : 'linear-gradient(145deg, rgba(26, 20, 16, 0.6), rgba(20, 15, 12, 0.8)), linear-gradient(135deg, #f5e6c8, #e8c76f, #d4af37, #c9a961, #e8c76f)';
  const productTags = useMemo(
    () => getProductTags(product, i18n.language as 'ar' | 'en'),
    [product, i18n.language]
  );

  if (process.env.NODE_ENV !== 'production' && !images[0]) {
    console.warn('Product missing image:', product.name, product.images);
  }

  return (
    <motion.div
      variants={variants}
      onClick={onClick}
      onMouseEnter={() => canHover && setIsHovered(true)}
      onMouseLeave={() => canHover && setIsHovered(false)}
      style={{
        backgroundColor: isCompact ? 'rgba(20, 15, 12, 0.94)' : 'rgba(20, 15, 12, 0.8)',
        backdropFilter: isCompact ? 'none' : 'blur(30px)',
        border: isCompact ? '1px solid rgba(232, 199, 111, 0.2)' : '3px solid transparent',
        backgroundImage: cardBackgroundImage,
        backgroundOrigin: isCompact ? undefined : 'border-box',
        backgroundClip: isCompact ? undefined : 'padding-box, border-box',
        borderRadius: isCompact ? '18px' : '28px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: isHorizontal ? 'grid' : 'block',
        gridTemplateColumns: isHorizontal ? (isCompact ? '42% 1fr' : '40% 1fr') : undefined,
        alignItems: isHorizontal ? 'stretch' : undefined,
        textAlign: isRTL ? 'right' : 'left',
        direction: isRTL ? 'rtl' : 'ltr',
        transition: isCompact
          ? 'transform 0.2s ease, border-color 0.2s ease'
          : 'transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease',
        position: 'relative',
        boxShadow: isCompact
          ? 'none'
          : '0 10px 30px rgba(0, 0, 0, 0.35), inset 0 0 40px rgba(232, 199, 111, 0.04)',
        contentVisibility: 'auto',
        containIntrinsicSize: isHorizontal
          ? (isCompact ? '220px' : '240px')
          : (isCompact ? '460px' : '640px'),
        contain: 'layout paint style',
        transform: 'translateZ(0)',
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
      whileHover={
        canHover
          ? {
              y: -6,
              scale: 1.01,
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(232, 199, 111, 0.22), inset 0 0 56px rgba(232, 199, 111, 0.06)',
              transition: { duration: 0.24, ease: 'easeOut' },
            }
          : undefined
      }
      whileTap={{ scale: isCompact ? 0.995 : 0.98 }}
      transition={{ duration: isCompact ? 0.18 : 0.3 }}
    >
      <div
        style={{
          height: isHorizontal ? '100%' : 'auto',
          minHeight: isHorizontal ? (isCompact ? '180px' : '220px') : undefined,
          aspectRatio: isHorizontal ? undefined : '4 / 5',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: isHorizontal ? '0' : (isCompact ? '18px 18px 0 0' : '24px 24px 0 0'),
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            transform: canHover && isHovered ? 'scale(1.05)' : 'scale(1)',
          }}
          transition={{ duration: isCompact ? 0.2 : 0.35, ease: 'easeOut' }}
        >
          {canOptimizeFirstImage ? (
            <Image
              src={firstImage}
              alt={i18n.language === 'ar' ? product.name : product.nameEn}
              fill
              loading="lazy"
              decoding="async"
              sizes={isCompact ? '(max-width: 1024px) 94vw, 45vw' : '(max-width: 1600px) 33vw, 420px'}
              style={{
                objectFit: 'cover',
                filter: isCompact ? 'brightness(0.98)' : 'brightness(0.95)',
              }}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={firstImage}
              alt={i18n.language === 'ar' ? product.name : product.nameEn}
              loading="lazy"
              decoding="async"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: isCompact ? 'brightness(0.98)' : 'brightness(0.95)',
              }}
            />
          )}
        </motion.div>

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isCompact
              ? 'linear-gradient(to top, rgba(10, 10, 10, 0.85) 0%, rgba(10, 10, 10, 0.2) 45%, transparent 75%)'
              : 'linear-gradient(to top, rgba(10, 10, 10, 0.95) 0%, rgba(10, 10, 10, 0.3) 40%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {showWishlist && (
          <WishlistButton
            productId={product.id}
            isHovered={canHover && isHovered}
            size={isCompact ? 36 : 40}
          />
        )}

        {/* Private Sale discount badge — top start corner of the image,
            stacked under the wishlist button when it is shown */}
        {isOnSale && (
          <div
            style={{
              position: 'absolute',
              top: showWishlist ? (isCompact ? '64px' : '68px') : (isCompact ? '0.75rem' : '20px'),
              [isRTL ? 'right' : 'left']: isCompact ? '0.75rem' : '20px',
              background: 'linear-gradient(135deg, #e8c76f, #d4af37)',
              color: '#1a1410',
              padding: isCompact ? '0.32rem 0.65rem' : '0.4rem 0.8rem',
              borderRadius: '999px',
              border: '1px solid rgba(245, 230, 200, 0.55)',
              fontSize: isCompact ? '0.68rem' : '0.75rem',
              fontWeight: '800',
              lineHeight: 1.2,
              zIndex: 10,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.35)',
              whiteSpace: 'nowrap',
            }}
          >
            {isRTL ? 'خصم 20%' : '-20%'}
          </div>
        )}

        {product.featured &&
          (isCompact ? (
            <div
              style={{
                position: 'absolute',
                top: '0.75rem',
                [isRTL ? 'left' : 'right']: '0.75rem',
                background: 'rgba(0, 0, 0, 0.58)',
                padding: '0.45rem 0.7rem',
                borderRadius: '14px',
                height: '34px',
                border: '1px solid rgba(232, 199, 111, 0.25)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                zIndex: 10,
                whiteSpace: 'nowrap',
              }}
            >
              <Sparkles size={14} style={{ color: '#e8c76f', strokeWidth: 2 }} />
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              style={{
                position: 'absolute',
                top: '20px',
                [isRTL ? 'left' : 'right']: '20px',
                background: 'rgba(0, 0, 0, 0.58)',
                backdropFilter: 'blur(16px) saturate(150%)',
                WebkitBackdropFilter: 'blur(16px) saturate(150%)',
                padding: isHovered ? '0.5rem 1.1rem 0.5rem 0.5rem' : '0.45rem 0.7rem',
                borderRadius: isHovered ? '50px' : '50%',
                width: isHovered ? 'auto' : '40px',
                height: '40px',
                border: '1px solid rgba(232, 199, 111, 0.25)',
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
              <Sparkles
                size={14}
                style={{
                  color: '#e8c76f',
                  strokeWidth: 2,
                }}
              />
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
          ))}

        <div
          style={{
            position: 'absolute',
            bottom: isCompact ? '12px' : '20px',
            left: isCompact ? '12px' : '20px',
            right: isCompact ? '12px' : '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            {!isCompact && showStats && images.length > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  backdropFilter: 'blur(12px)',
                  padding: '0.4rem 0.7rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(232, 199, 111, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  minWidth: '55px',
                  justifyContent: 'center',
                }}
              >
                <Images size={14} style={{ color: '#e8c76f' }} />
                <span style={{ color: '#e8c76f', fontSize: '0.8rem', fontWeight: '600' }}>{images.length}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.7, color: '#e8c76f' }}>
                  {i18n.language === 'ar' ? 'صور' : 'Photos'}
                </span>
              </motion.div>
            )}

            {!isCompact &&
              showStats &&
              product.likes !== undefined &&
              product.likes !== null &&
              Number(product.likes) > 0 && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  style={{
                    background: 'rgba(231, 76, 60, 0.15)',
                    backdropFilter: 'blur(12px)',
                    padding: '0.4rem 0.7rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(231, 76, 60, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    minWidth: '60px',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(231, 76, 60, 0.2)',
                  }}
                >
                  <Heart size={14} style={{ color: '#e74c3c', fill: '#e74c3c' }} />
                  <span style={{ color: '#e74c3c', fontSize: '0.8rem', fontWeight: '600' }}>{product.likes}</span>
                </motion.div>
              )}

            {!isCompact && showStats && product.details && product.details.length > 0 && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
                style={{
                  background: 'rgba(52, 152, 219, 0.15)',
                  backdropFilter: 'blur(12px)',
                  padding: '0.4rem 0.7rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(52, 152, 219, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  minWidth: '65px',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(52, 152, 219, 0.2)',
                }}
              >
                <Sparkles size={14} style={{ color: '#3498db' }} />
                <span style={{ color: '#3498db', fontSize: '0.8rem', fontWeight: '600' }}>{product.details.length}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.7, color: '#3498db' }}>
                  {i18n.language === 'ar' ? 'تفاصيل' : 'Details'}
                </span>
              </motion.div>
            )}
          </div>

          {hasPrice && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                flexDirection: 'row',
                gap: isCompact ? '0.28rem' : '0.4rem',
                maxWidth: isCompact ? (isOnSale ? '205px' : '168px') : (isOnSale ? '240px' : '196px'),
                padding: '0.4rem 0.7rem',
                minHeight: '32px',
                borderRadius: '12px',
                border: '1px solid rgba(232, 199, 111, 0.32)',
                background: isCompact ? 'rgba(0, 0, 0, 0.72)' : 'rgba(0, 0, 0, 0.66)',
                backdropFilter: isCompact ? 'none' : 'blur(10px)',
                boxShadow: isCompact
                  ? '0 3px 10px rgba(0, 0, 0, 0.28)'
                  : '0 6px 16px rgba(0, 0, 0, 0.3)',
              }}
            >
              {isRTL ? (
                <>
                  <Tag
                    size={isCompact ? 11 : 12}
                    style={{
                      color: '#e8c76f',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: 'rgba(232, 199, 111, 0.78)',
                      fontSize: isCompact ? '0.65rem' : '0.7rem',
                      fontWeight: '600',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {priceLabel}
                  </span>
                  <span
                    style={{
                      color: '#f5e6c8',
                      fontSize: isCompact ? '0.82rem' : '0.8rem',
                      fontWeight: '700',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {productPrice}
                  </span>
                  {listPriceLabel && (
                    <span
                      style={{
                        color: 'rgba(232, 199, 111, 0.55)',
                        fontSize: isCompact ? '0.68rem' : '0.7rem',
                        fontWeight: '600',
                        lineHeight: 1.2,
                        whiteSpace: 'nowrap',
                        textDecoration: 'line-through',
                      }}
                    >
                      {listPriceLabel}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Tag
                    size={isCompact ? 11 : 12}
                    style={{
                      color: '#e8c76f',
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      color: 'rgba(232, 199, 111, 0.78)',
                      fontSize: isCompact ? '0.65rem' : '0.7rem',
                      fontWeight: '600',
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {priceLabel}
                  </span>
                  <span
                    style={{
                      color: '#f5e6c8',
                      fontSize: isCompact ? '0.82rem' : '0.8rem',
                      fontWeight: '700',
                      lineHeight: 1.7,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {productPrice}
                  </span>
                  {listPriceLabel && (
                    <span
                      style={{
                        color: 'rgba(232, 199, 111, 0.55)',
                        fontSize: isCompact ? '0.68rem' : '0.7rem',
                        fontWeight: '600',
                        lineHeight: 1.7,
                        whiteSpace: 'nowrap',
                        textDecoration: 'line-through',
                      }}
                    >
                      {listPriceLabel}
                    </span>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          padding: isHorizontal
            ? (isCompact ? '1rem 0.95rem' : '1.25rem 1.3rem')
            : (isCompact ? '1.25rem' : '2rem'),
          direction: isRTL ? 'rtl' : 'ltr',
          background: isCompact
            ? 'linear-gradient(to bottom, rgba(26, 20, 16, 0.9), rgba(20, 15, 12, 0.95))'
            : 'linear-gradient(to bottom, rgba(26, 20, 16, 0.8), rgba(20, 15, 12, 0.9))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: isHorizontal ? '0.7rem' : '0.9rem',
        }}
      >
        <h3
          style={{
            fontSize: isHorizontal
              ? (isCompact ? '1rem' : '1.12rem')
              : titleSize === 'compact'
                ? (isCompact ? '1.05rem' : '1.28rem')
                : (isCompact ? '1.2rem' : '1.5rem'),
            fontWeight: '700',
            background: 'linear-gradient(135deg, #e8c76f, #d4af37)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: showDescription || (showTags && !isCompact) ? '0.45rem' : '0',
            lineHeight: '1.3',
            letterSpacing: '0.3px',
          }}
        >
          {i18n.language === 'ar' ? product.name : product.nameEn}
        </h3>

        {showDescription && (
          <p
            style={{
              fontSize: isCompact ? '0.9rem' : '0.95rem',
              color: 'rgba(232, 199, 111, 0.7)',
              marginBottom: showTags && !isCompact ? '0.65rem' : '0.35rem',
              lineHeight: isCompact ? '1.5' : '1.6',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {i18n.language === 'ar' ? product.description : product.descriptionEn}
          </p>
        )}

        {showTags && !isCompact && productTags.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.5rem',
              marginBottom: isHorizontal ? '0.35rem' : '1.25rem',
            }}
          >
            {productTags.slice(0, 3).map((tag: string, index: number) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: isCompact ? '0.2rem 0.6rem' : '0.25rem 0.75rem',
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
            {productTags.length > 3 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: isCompact ? '0.2rem 0.6rem' : '0.25rem 0.75rem',
                  background: 'rgba(232, 199, 111, 0.05)',
                  border: '1px solid rgba(232, 199, 111, 0.15)',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  color: 'rgba(232, 199, 111, 0.6)',
                  fontWeight: '500',
                }}
              >
                +{productTags.length - 3}
              </div>
            )}
          </div>
        )}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 0',
            borderTop: '1px solid rgba(232, 199, 111, 0.15)',
            color: 'rgba(232, 199, 111, 0.7)',
            fontSize: '0.85rem',
            fontWeight: '500',
            transition: isCompact ? 'none' : 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            if (!canHover) return;
            e.currentTarget.style.color = 'var(--color-gold)';
            const icon = e.currentTarget.querySelector('svg') as SVGElement;
            if (icon) icon.style.transform = isRTL ? 'translateX(-4px)' : 'translateX(4px)';
          }}
          onMouseLeave={(e) => {
            if (!canHover) return;
            e.currentTarget.style.color = 'rgba(232, 199, 111, 0.7)';
            const icon = e.currentTarget.querySelector('svg') as SVGElement;
            if (icon) icon.style.transform = 'translateX(0)';
          }}
        >
          <span>{i18n.language === 'ar' ? 'عرض التفاصيل' : 'View Details'}</span>
          <Eye
            size={16}
            style={{
              transition: isCompact ? 'none' : 'transform 0.3s ease',
              transform: isRTL ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
