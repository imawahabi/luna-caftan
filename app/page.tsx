'use client';

import { useRouter } from 'next/navigation';
import HomePage from '@/components/sections/HomePage';
import AppLayout from '@/components/AppLayout';
import { useNavigation } from '@/lib/navigation-context';

export type PageType = 'home' | 'about' | 'collection' | 'contact' | 'product';

export default function MainApp() {
  const router = useRouter();
  const { startNavigation } = useNavigation();

  const navigateTo = (page: PageType, productId?: string) => {
    startNavigation();
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'home') {
      router.push('/');
    } else if (page === 'about') {
      router.push('/about');
    } else if (page === 'collection') {
      router.push('/collection');
    } else if (page === 'contact') {
      router.push('/contact');
    }
  };

  return (
    <AppLayout>
      <HomePage navigateTo={navigateTo} />
    </AppLayout>
  );
}
