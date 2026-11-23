'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Grid3X3, Bookmark, Phone, Info } from 'lucide-react';
import { useWishlist } from '@/lib/wishlist-context';
import { useNavigation } from '@/lib/navigation-context';

const COMPACT_BREAKPOINT = 1024;

export default function BottomNavigation() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { startNavigation } = useNavigation();
  const isRTL = i18n.language === 'ar';
  const { wishlistCount } = useWishlist();
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const query = window.matchMedia(`(max-width: ${COMPACT_BREAKPOINT}px)`);
    const legacyQuery = query as MediaQueryList & {
      addListener?: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener?: (listener: (event: MediaQueryListEvent) => void) => void;
    };
    const syncViewport = () => {
      setIsCompact(query.matches);
    };

    syncViewport();

    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', syncViewport);
      return () => query.removeEventListener('change', syncViewport);
    }

    legacyQuery.addListener?.(syncViewport);
    return () => legacyQuery.removeListener?.(syncViewport);
  }, []);

  if (!isCompact) return null;

  const navItems = [
    {
      icon: Home,
      label: isRTL ? 'الرئيسية' : 'Home',
      path: '/',
    },
    {
      icon: Grid3X3,
      label: isRTL ? 'القفاطين' : 'Collection',
      path: '/collection',
    },
    {
      icon: Bookmark,
      label: isRTL ? 'المفضلة' : 'Wishlist',
      path: '/wishlist',
      badge: wishlistCount,
    },
    {
      icon: Phone,
      label: isRTL ? 'تواصل' : 'Contact',
      path: '/contact',
    },
    {
      icon: Info,
      label: isRTL ? 'من نحن' : 'About',
      path: '/about',
    },
  ];

  return (
    <nav className="mobile-bottom-nav" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="mobile-bottom-nav-shell">
        <div className="mobile-bottom-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => {
                  startNavigation();
                  router.push(item.path);
                }}
                className={`mobile-bottom-nav-item${isActive ? ' is-active' : ''}`}
                aria-label={item.label}
              >
                {item.badge !== undefined && item.badge > 0 && (
                  <div className="mobile-bottom-nav-badge">
                    {item.badge > 99 ? '99+' : item.badge}
                  </div>
                )}

                <div className="mobile-bottom-nav-icon-wrap">
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="mobile-bottom-nav-dot" />
                </div>

                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
