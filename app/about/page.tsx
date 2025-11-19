'use client';

import { useRouter } from 'next/navigation';
import { PageType } from '@/app/page';
import AboutPage from '@/components/sections/AboutPage';
import AppLayout from '@/components/AppLayout';
import { useNavigation } from '@/lib/navigation-context';

export default function AboutPageRoute() {
  const router = useRouter();
  const { startNavigation } = useNavigation();

  const navigateTo = (page: PageType, productId?: string) => {
    startNavigation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (page === 'home') {
      router.push('/');
    } else if (page === 'collection') {
      router.push('/collection');
    } else if (page === 'contact') {
      router.push('/contact');
    }
  };

  return (
    <AppLayout>
      <AboutPage />
    </AppLayout>
  );
}
