'use client';

import { useRouter } from 'next/navigation';
import { PageType } from '@/app/page';
import ContactPage from '@/components/sections/ContactPage';
import AppLayout from '@/components/AppLayout';
import { useNavigation } from '@/lib/navigation-context';

export default function ContactPageRoute() {
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
    }
  };

  return (
    <AppLayout>
      <ContactPage />
    </AppLayout>
  );
}
