'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LogOut, Settings as SettingsIcon, Home as HomeIcon, 
  Package, Plus, Menu, X, Shield
} from 'lucide-react';
import Image from 'next/image';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
      }}>
        <p style={{ color: 'var(--color-gold)', fontSize: '1.5rem' }}>جاري التحميل...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const menuItems = [
    { icon: HomeIcon, label: 'الرئيسية', path: '/admin/dashboard', exact: true },
    { icon: Package, label: 'جميع القفاطين', path: '/admin/dashboard/products', exact: false },
    { icon: Plus, label: 'إضافة قفطان', path: '/admin/dashboard/products/new' },
    { icon: Shield, label: 'إدارة المسؤولين', path: '/admin/dashboard/admins' },
    { icon: SettingsIcon, label: 'الإعدادات', path: '/admin/dashboard/settings' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: '#0a0a0a',
      position: 'relative',
    }}>
      {/* Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        overflow: 'hidden',
      }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url('/images/admin-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.4) contrast(1.05)',
            transform: 'scale(1.08)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(10,10,10,0.88) 0%, rgba(26,20,16,0.8) 32%, rgba(10,10,10,0.86) 68%, rgba(10,10,10,0.92) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(circle at 20% 45%, rgba(232,199,111,0.08), transparent 55%), radial-gradient(circle at 80% 70%, rgba(212,175,55,0.06), transparent 55%)',
          }}
        />
      </div>

      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '280px' : '80px',
        height: '100vh',
        position: 'fixed',
        right: 0,
        top: 0,
        background: 'rgba(26, 20, 16, 0.95)',
        backdropFilter: 'blur(20px)',
        borderLeft: '1px solid rgba(232, 199, 111, 0.2)',
        transition: 'width 0.3s ease',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        direction: 'rtl',
      }}>
        {/* Logo Section */}
        <div style={{
          padding: '2rem 1.5rem',
          borderBottom: '1px solid rgba(232, 199, 111, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          gap: '1rem',
        }}>
          {sidebarOpen ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Image 
                  src="/logo-white.png" 
                  alt="Luna Caftan" 
                  width={40} 
                  height={40}
                  style={{ objectFit: 'contain' }}
                />
                <div>
                  <h2 style={{ 
                    color: 'var(--color-gold)', 
                    fontSize: '1.25rem', 
                    fontWeight: '700',
                    margin: 0,
                    lineHeight: 1.2,
                  }}>
                    Luna Caftan
                  </h2>
                  <p style={{ 
                    color: 'rgba(232, 199, 111, 0.6)', 
                    fontSize: '0.75rem',
                    margin: 0,
                  }}>
                    لوحة التحكم
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--color-light-gold)',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-gold)',
                cursor: 'pointer',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Menu size={24} />
            </button>
          )}
        </div>

        {/* User Info */}
        {sidebarOpen && (
          <div style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(232, 199, 111, 0.15)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.2), rgba(212, 175, 55, 0.2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(232, 199, 111, 0.3)',
              }}>
                <span style={{ 
                  color: 'var(--color-gold)', 
                  fontSize: '1.25rem',
                  fontWeight: '600',
                }}>
                  {session.user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ 
                  color: 'var(--color-cream)', 
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {session.user?.name || 'Admin'}
                </p>
                <p style={{ 
                  color: 'var(--color-light-gold)', 
                  fontSize: '0.8rem',
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {session.user?.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav style={{ 
          flex: 1, 
          padding: '1.5rem 0.75rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: sidebarOpen ? '0.875rem 1rem' : '0.875rem',
                  background: active 
                    ? 'linear-gradient(135deg, rgba(232, 199, 111, 0.15), rgba(212, 175, 55, 0.1))' 
                    : 'transparent',
                  border: active 
                    ? '1px solid rgba(232, 199, 111, 0.3)' 
                    : '1px solid transparent',
                  borderRadius: '12px',
                  color: active ? 'var(--color-gold)' : 'var(--color-light-gold)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  fontSize: '0.95rem',
                  fontWeight: active ? '600' : '500',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'rgba(232, 199, 111, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(232, 199, 111, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = 'transparent';
                  }
                }}
              >
                <Icon size={20} />
                {sidebarOpen && <span>{item.label}</span>}
                {active && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '60%',
                    background: 'var(--color-gold)',
                    borderRadius: '3px 0 0 3px',
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div style={{ 
          padding: '1rem 0.75rem',
          borderTop: '1px solid rgba(232, 199, 111, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}>
          <button
            onClick={() => router.push('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: sidebarOpen ? '0.875rem 1rem' : '0.875rem',
              background: 'rgba(232, 199, 111, 0.12)',
              border: '1px solid rgba(232, 199, 111, 0.3)',
              borderRadius: '12px',
              color: 'var(--color-gold)',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontSize: '0.95rem',
              fontWeight: '500',
              width: '100%',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(232, 199, 111, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(232, 199, 111, 0.12)';
            }}
          >
            <HomeIcon size={20} />
            {sidebarOpen && <span>زيارة الموقع</span>}
          </button>

          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: sidebarOpen ? '0.875rem 1rem' : '0.875rem',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              color: '#f87171',
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontSize: '0.95rem',
              fontWeight: '500',
              width: '100%',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
          >
            <LogOut size={20} />
            {sidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{
        flex: 1,
        marginRight: sidebarOpen ? '280px' : '80px',
        transition: 'margin-right 0.3s ease',
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
      }}>
        {children}
      </main>

      {/* Mobile Toggle Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          style={{
            position: 'fixed',
            top: '1rem',
            right: '1rem',
            zIndex: 999,
            background: 'rgba(232, 199, 111, 0.2)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(232, 199, 111, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem',
            color: 'var(--color-gold)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Menu size={24} />
        </button>
      )}
    </div>
  );
}
