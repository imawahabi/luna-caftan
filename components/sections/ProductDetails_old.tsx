'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, MessageCircle, Check, ArrowRight } from 'lucide-react';
import { PageType } from '@/app/page';

interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  price: string;
  priceEn: string;
  details: string[];
  detailsEn: string[];
  images: string[];
}

interface ProductDetailsProps {
  productId: string;
  navigateTo: (page: PageType, productId?: string) => void;
}

export default function ProductDetails({ productId, navigateTo }: ProductDetailsProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProductAndRelated();
  }, [productId]);

  const fetchProductAndRelated = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      const data = await res.json();
      setAllProducts(data);
      
      const foundProduct = data.find((p: Product) => p.id === productId);
      setProduct(foundProduct || null);
      setSelectedImage(0);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string) => {
    if (!price || price.trim() === '') {
      return i18n.language === 'ar' ? 'السعر حسب الطلب' : 'Price on Request';
    }
    return price;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1410 100%)',
      }}>
        <p style={{ color: 'var(--color-gold)', fontSize: '1.5rem' }}>
          {i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </p>
      </div>
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
          {i18n.language === 'ar' ? 'المنتج غير موجود' : 'Product not found'}
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

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Product Details Section */}
      <section className="section" style={{ 
        paddingTop: '6rem', 
        paddingBottom: '4rem',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1410 100%)',
      }}>
        <div className="container">
          {/* Back Button */}
          <button 
            onClick={() => navigateTo('collection')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-gold)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1rem',
              marginBottom: '2rem',
              padding: '0.5rem',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(' + (isRTL ? '5px' : '-5px') + ')'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            {isRTL ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
            <span>{i18n.language === 'ar' ? 'العودة للمجموعة' : 'Back to Collection'}</span>
          </button>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: window.innerWidth > 968 ? '1fr 1fr' : '1fr', 
            gap: '4rem',
            alignItems: 'start',
          }}>
            {/* Images Gallery */}
            <div>
              {/* Main Image */}
              <div style={{ 
                width: '100%', 
                height: window.innerWidth > 768 ? '600px' : '450px', 
                marginBottom: '1.5rem',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid rgba(232, 199, 111, 0.2)',
              }}>
                <img 
                  src={product.images[selectedImage]} 
                  alt={`${i18n.language === 'ar' ? product.name : product.nameEn}`}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'cover',
                  }}
                />
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                  gap: '0.75rem',
                }}>
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      style={{
                        aspectRatio: '1',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: selectedImage === index 
                          ? '2px solid var(--color-gold)' 
                          : '1px solid rgba(232, 199, 111, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        opacity: selectedImage === index ? 1 : 0.6,
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
            <div>
              {/* Product Name */}
              <h1 style={{ 
                fontSize: 'clamp(2rem, 4vw, 2.5rem)', 
                color: 'var(--color-cream)',
                marginBottom: '1rem',
                fontWeight: '600',
                lineHeight: '1.3',
              }}>
                {i18n.language === 'ar' ? product.name : product.nameEn}
              </h1>

              {/* Price */}
              <p style={{ 
                fontSize: '1.8rem', 
                color: 'var(--color-gold)',
                fontWeight: '600',
                marginBottom: '2rem',
              }}>
                {formatPrice(i18n.language === 'ar' ? product.price : product.priceEn)}
              </p>

              {/* Description */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  color: 'var(--color-cream)', 
                  marginBottom: '1rem',
                  fontWeight: '600',
                }}>
                  {i18n.language === 'ar' ? 'الوصف' : 'Description'}
                </h3>
                <p style={{ 
                  color: 'var(--color-light-gold)', 
                  lineHeight: '1.8',
                  fontSize: '1rem',
                }}>
                  {i18n.language === 'ar' ? product.description : product.descriptionEn}
                </p>
              </div>

              {/* Details List */}
              {product.details && product.details.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    color: 'var(--color-cream)', 
                    marginBottom: '1rem',
                    fontWeight: '600',
                  }}>
                    {i18n.language === 'ar' ? 'المواصفات' : 'Specifications'}
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {(i18n.language === 'ar' ? product.details : product.detailsEn).map((detail, index) => (
                      <li 
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          marginBottom: '0.75rem',
                          color: 'var(--color-light-gold)',
                          fontSize: '0.95rem',
                        }}
                      >
                        <Check size={18} color="var(--color-gold)" style={{ flexShrink: 0, marginTop: '0.15rem' }} />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Order Button */}
              <button 
                onClick={orderViaWhatsApp}
                className="btn btn-primary"
                style={{
                  width: '100%',
                  padding: '1.25rem 2rem',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  fontWeight: '600',
                }}
              >
                <MessageCircle size={22} />
                <span>{i18n.language === 'ar' ? 'اطلب عبر الواتساب' : 'Order via WhatsApp'}</span>
              </button>

              {/* Additional Info */}
              <p style={{
                marginTop: '1.5rem',
                padding: '1rem',
                background: 'rgba(232, 199, 111, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(232, 199, 111, 0.15)',
                color: 'var(--color-light-gold)', 
                fontSize: '0.9rem',
                lineHeight: '1.6',
                textAlign: 'center',
              }}>
                {i18n.language === 'ar' 
                  ? '✨ جميع القفاطين مصنوعة يدوياً من أجود الأقمشة'
                  : '✨ All caftans are handcrafted from the finest fabrics'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="section" style={{ 
        background: 'linear-gradient(180deg, #1a1410 0%, #0a0a0a 100%)', 
        paddingTop: '4rem', 
        paddingBottom: '4rem',
      }}>
        <div className="container">
          <h2 style={{ 
            fontSize: '2rem', 
            color: 'var(--color-cream)', 
            marginBottom: '2.5rem',
            textAlign: 'center',
            fontWeight: '600',
          }}>
            {i18n.language === 'ar' ? 'قفاطين مشابهة' : 'Similar Caftans'}
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: '2rem',
          }}>
            {allProducts.filter(p => p.id !== productId).slice(0, 3).map((relatedProduct) => (
              <button
                key={relatedProduct.id}
                onClick={() => navigateTo('product', relatedProduct.id)}
                className="product-card"
                style={{
                  cursor: 'pointer',
                  textAlign: isRTL ? 'right' : 'left',
                  direction: isRTL ? 'rtl' : 'ltr',
                }}
              >
                <div className="product-image" style={{ height: '350px' }}>
                  <img 
                    src={relatedProduct.images[0]} 
                    alt={i18n.language === 'ar' ? relatedProduct.name : relatedProduct.nameEn} 
                    loading="lazy" 
                  />
                  <div className="product-overlay"></div>
                </div>
                <div className="product-info" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
                  <h3 className="product-name">
                    {i18n.language === 'ar' ? relatedProduct.name : relatedProduct.nameEn}
                  </h3>
                  <p className="product-description">
                    {i18n.language === 'ar' ? relatedProduct.description : relatedProduct.descriptionEn}
                  </p>
                  <p style={{ 
                    color: 'var(--color-gold)', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    marginTop: '0.5rem',
                  }}>
                    {formatPrice(i18n.language === 'ar' ? relatedProduct.price : relatedProduct.priceEn)}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
