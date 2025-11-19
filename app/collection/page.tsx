'use client';

import { useRouter } from 'next/navigation';
import { PageType } from '@/app/page';
import CollectionPage from '@/components/sections/CollectionPage';
import AppLayout from '@/components/AppLayout';
import { useNavigation } from '@/lib/navigation-context';

export default function CollectionPageRoute() {
  const router = useRouter();
  const { startNavigation } = useNavigation();

  const navigateTo = (page: PageType, productId?: string) => {
    startNavigation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (page === 'home') {
      router.push('/');
    } else if (page === 'about') {
      router.push('/about');
    } else if (page === 'contact') {
      router.push('/contact');
    } else if (page === 'product' && productId) {
      // Will be handled by CollectionPage
    }
  };

  return (
    <AppLayout>
      <CollectionPage navigateTo={navigateTo} />
    </AppLayout>
  );
}
