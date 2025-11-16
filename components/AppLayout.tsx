'use client';

import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import BottomNavigation from '@/components/BottomNavigation';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { PageType } from '@/app/page';
import { useProducts } from '@/lib/products-context';
import LoadingSpinner from '@/components/LoadingSpinner';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { loading } = useProducts();

  // Determine current page based on pathname
  const getCurrentPage = (): PageType => {
    if (pathname === '/') return 'home';
    if (pathname === '/about') return 'about';
    if (pathname === '/collection') return 'collection';
    if (pathname === '/contact') return 'contact';
    if (pathname?.startsWith('/caftans')) return 'product';
    return 'home';
  };

  // Navigation function with dynamic routing
  const navigateTo = (page: PageType, productId?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (page === 'home') {
      router.push('/');
    } else if (page === 'about') {
      router.push('/about');
    } else if (page === 'collection') {
      router.push('/collection');
    } else if (page === 'contact') {
      router.push('/contact');
    } else if (page === 'product' && productId) {
      // This will be handled by the calling component
      // which has access to product data
    }
  };

  return (
    <div>
      <Header currentPage={getCurrentPage()} navigateTo={navigateTo} />
      {loading ? (
        <LoadingSpinner message="جاري التحميل..." fullScreen />
      ) : (
        children
      )}
      <Footer navigateTo={navigateTo} />
      <ScrollToTopButton />
      <BottomNavigation />
      <PWAInstallPrompt />
    </div>
  );
}
