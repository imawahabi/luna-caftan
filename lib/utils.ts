// Utility functions for Luna Caftan

/**
 * Generate SEO-friendly URL slug from product name
 * Always uses English name for consistency across languages
 */
export function generateProductSlug(product: { nameEn: string } | string): string {
  const nameEn = typeof product === 'string' ? product : product.nameEn;
  return nameEn
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

/**
 * Debounce function to limit function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
}

/**
 * Smooth scroll to top
 */
export function scrollToTop(behavior: ScrollBehavior = 'smooth'): void {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior });
  }
}

/**
 * Lazy load images
 */
export function lazyLoadImage(src: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
  });
}
