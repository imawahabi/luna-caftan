'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/components/sections/HomePage';
import AboutPage from '@/components/sections/AboutPage';
import CollectionPage from '@/components/sections/CollectionPage';
import ContactPage from '@/components/sections/ContactPage';
import ProductDetails from '@/components/sections/ProductDetails';

export type PageType = 'home' | 'about' | 'collection' | 'contact' | 'product';

export default function MainApp() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const navigateTo = (page: PageType, productId?: string) => {
    setCurrentPage(page);
    if (productId !== undefined) {
      setSelectedProductId(productId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div>
      <Header currentPage={currentPage} navigateTo={navigateTo} />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage + (selectedProductId || '')}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {currentPage === 'home' && <HomePage navigateTo={navigateTo} />}
          {currentPage === 'about' && <AboutPage />}
          {currentPage === 'collection' && <CollectionPage navigateTo={navigateTo} />}
          {currentPage === 'contact' && <ContactPage />}
          {currentPage === 'product' && selectedProductId !== null && (
            <ProductDetails productId={selectedProductId} navigateTo={navigateTo} />
          )}
        </motion.div>
      </AnimatePresence>

      <Footer navigateTo={navigateTo} />
    </div>
  );
}
