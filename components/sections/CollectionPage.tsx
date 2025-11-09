'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { PageType } from '@/app/page';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';

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
}

export default function CollectionPage({ navigateTo }: CollectionPageProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div>
      {/* Hero */}
      <section className="hero" style={{ minHeight: '50vh' }}>
        <div className="hero-bg">
          <img src="/images/hero.jpg" alt="Collection" />
          <div className="hero-overlay"></div>
        </div>

        <div className="container">
          <div className="hero-content" style={{ maxWidth: '600px' }}>
            <span className="hero-badge">{t('collection.subtitle')}</span>
            <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)' }}>
              {t('collection.title')}
            </h1>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="section" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
        <div className="container">
          {loading ? (
            <LoadingSpinner message={i18n.language === 'ar' ? 'جاري تحميل القفاطين...' : 'Loading Caftans...'} />
          ) : (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
                gap: '3rem',
              }}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => navigateTo('product', product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
