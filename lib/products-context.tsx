'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Product, ProductFilters } from '@/types/product';

interface ProductsContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  filterProducts: (filters: ProductFilters) => Product[];
  incrementViews: (productId: string) => Promise<void>;
  allTags: string[];
}

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Extract all unique tags from products
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    products.forEach(product => {
      if (product.tags && Array.isArray(product.tags)) {
        product.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [products]);

  // Filter products based on criteria
  const filterProducts = useCallback((filters: ProductFilters): Product[] => {
    return products.filter(product => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(searchLower) ||
                           product.nameEn.toLowerCase().includes(searchLower);
        const matchesDescription = product.description.toLowerCase().includes(searchLower) ||
                                  product.descriptionEn.toLowerCase().includes(searchLower);
        const matchesTags = product.tags?.some(tag => tag.toLowerCase().includes(searchLower));
        
        if (!matchesName && !matchesDescription && !matchesTags) return false;
      }

      // Featured filter
      if (filters.featured !== undefined && product.featured !== filters.featured) {
        return false;
      }

      // Tags filter
      if (filters.tags && filters.tags.length > 0) {
        if (!product.tags || !filters.tags.some(tag => product.tags?.includes(tag))) {
          return false;
        }
      }

      // Price filter
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        const price = parseFloat(product.price.replace(/[^\d.]/g, ''));
        if (isNaN(price)) return true; // Skip price filtering for non-numeric prices
        
        if (filters.minPrice !== undefined && price < filters.minPrice) return false;
        if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sorting
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'popular':
          return (b.views || 0) - (a.views || 0);
        case 'price-asc':
          const priceA = parseFloat(a.price.replace(/[^\d.]/g, '')) || 0;
          const priceB = parseFloat(b.price.replace(/[^\d.]/g, '')) || 0;
          return priceA - priceB;
        case 'price-desc':
          const priceA2 = parseFloat(a.price.replace(/[^\d.]/g, '')) || 0;
          const priceB2 = parseFloat(b.price.replace(/[^\d.]/g, '')) || 0;
          return priceB2 - priceA2;
        default:
          return 0;
      }
    });
  }, [products]);

  // Increment product views
  const incrementViews = useCallback(async (productId: string) => {
    try {
      await fetch(`/api/products/${productId}/view`, {
        method: 'POST',
      });
      // Update local state
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, views: (p.views || 0) + 1 } : p
      ));
    } catch (err) {
      console.error('Error incrementing views:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ 
      products, 
      loading, 
      error, 
      refreshProducts: fetchProducts,
      filterProducts,
      incrementViews,
      allTags
    }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
