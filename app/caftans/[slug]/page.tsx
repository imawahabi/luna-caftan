'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { PageType } from '@/app/page';
import ProductDetails from '@/components/sections/ProductDetails';
import AppLayout from '@/components/AppLayout';
import { useProducts } from '@/lib/products-context';

interface CaftanPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CaftanPage({ params }: CaftanPageProps) {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { products, loading: productsLoading } = useProducts();
  const [productId, setProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Unwrap the params promise
  const resolvedParams = use(params);

  // Find product by slug (using context - no fetch)
  useEffect(() => {
    if (productsLoading || products.length === 0) {
      setLoading(true);
      return;
    }

    const slug = resolvedParams.slug;
    const foundProduct = products.find((product: any) => {
      const nameEn = product.nameEn
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      return nameEn === slug;
    });

    if (foundProduct) {
      setProductId(foundProduct.id);
      setError(null);
    } else {
      setError('Product not found');
    }
    setLoading(false);
  }, [resolvedParams.slug, products, productsLoading]);

  const navigateTo = async (page: PageType, productId?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (page === 'home') {
      router.push('/');
    } else if (page === 'collection') {
      router.push('/collection');
    } else if (page === 'about') {
      router.push('/about');
    } else if (page === 'contact') {
      router.push('/contact');
    } else if (page === 'product' && productId) {
      // Find product and generate slug (using context - no fetch)
      const product = products.find((p: any) => p.id === productId);
      if (product) {
        const slug = product.nameEn
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        // Prefetch for faster navigation
        router.prefetch(`/caftans/${slug}`);
        router.push(`/caftans/${slug}`);
      }
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
          color: '#e8c76f',
        }}>
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ color: 'var(--color-gold)', fontSize: '1.5rem' }}>
          {i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
        </p>
      </div>
        </div>
      </AppLayout>
    );
  }

  if (error || !productId) {
    return (
      <AppLayout>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '70vh',
          color: '#e8c76f',
          textAlign: 'center',
          padding: '2rem',
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            {i18n.language === 'ar' ? 'القفطان غير موجود' : 'Caftan Not Found'}
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
            {i18n.language === 'ar' 
              ? 'عذراً، هذا القفطان غير موجود أو تم حذفه' 
              : 'Sorry, this caftan does not exist or has been removed'}
          </p>
          <button
            onClick={() => router.push('/')}
            style={{
              padding: '1rem 2rem',
              background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.2), rgba(212, 175, 55, 0.15))',
              border: '1px solid rgba(232, 199, 111, 0.3)',
              borderRadius: '50px',
              color: '#e8c76f',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.5)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(232, 199, 111, 0.3), rgba(212, 175, 55, 0.2))';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.3)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(232, 199, 111, 0.2), rgba(212, 175, 55, 0.15))';
            }}
          >
            {i18n.language === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ProductDetails productId={productId} navigateTo={navigateTo} />
    </AppLayout>
  );
}
