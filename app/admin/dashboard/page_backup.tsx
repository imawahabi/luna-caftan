'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Trash2, Edit, Plus, LogOut, Eye, EyeOff, 
  Package, TrendingUp, ShoppingBag, Settings as SettingsIcon,
  Home as HomeIcon
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  nameEn: string;
  price: string;
  priceEn: string;
  images: string[];
  featured: boolean;
  active: boolean;
}

interface Stats {
  total: number;
  active: number;
  inactive: number;
  featured: number;
}

export default function ImprovedDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, inactive: 0, featured: 0 });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      
      // Calculate stats
      const total = data.length;
      const active = data.filter((p: Product) => p.active).length;
      const inactive = total - active;
      const featured = data.filter((p: Product) => p.featured).length;
      setStats({ total, active, inactive, featured });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج?')) return;

    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('فشل حذف المنتج');
    }
  };

  const handleToggleActive = async (id: string, active: boolean) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active }),
      });
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1410 100%)',
      }}>
        <p style={{ color: 'var(--color-gold)', fontSize: '1.5rem' }}>جاري التحميل...</p>
      </div>
    );
  }

  if (!session) return null;

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div style={{
      background: 'linear-gradient(135deg, rgba(26, 20, 16, 0.8), rgba(10, 10, 10, 0.9))',
      border: `2px solid ${color}`,
      borderRadius: '15px',
      padding: '2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      transition: 'all 0.3s',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = `0 10px 30px ${color}40`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      <div style={{
        padding: '1rem',
        background: `${color}20`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Icon size={32} color={color} />
      </div>
      <div>
        <p style={{ color: 'var(--color-light-gold)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
          {title}
        </p>
        <p style={{ color: 'var(--color-cream)', fontSize: '2rem', fontWeight: '700' }}>
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1410 50%, #0a0a0a 100%)',
    }}>
      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        width: '280px',
        background: 'rgba(10, 10, 10, 0.95)',
        borderRight: '2px solid rgba(232, 199, 111, 0.2)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <img src="/logo-white.png" alt="Luna Caftan" style={{ height: '60px', marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--color-gold)', fontSize: '1.3rem', marginBottom: '0.5rem' }}>
            لوحة التحكم
          </h2>
          <p style={{ color: 'var(--color-light-gold)', fontSize: '0.85rem' }}>
            {session.user?.email}
          </p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={() => router.push('/admin/dashboard')}
            style={{
              padding: '1rem 1.5rem',
              background: 'rgba(232, 199, 111, 0.1)',
              border: '2px solid rgba(232, 199, 111, 0.3)',
              borderRadius: '12px',
              color: 'var(--color-gold)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            <Package size={20} />
            <span>المنتجات</span>
          </button>

          <button
            onClick={() => router.push('/admin/dashboard/settings')}
            style={{
              padding: '1rem 1.5rem',
              background: 'transparent',
              border: '2px solid rgba(232, 199, 111, 0.2)',
              borderRadius: '12px',
              color: 'var(--color-light-gold)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            <SettingsIcon size={20} />
            <span>الإعدادات</span>
          </button>

          <button
            onClick={() => window.open('/', '_blank')}
            style={{
              padding: '1rem 1.5rem',
              background: 'transparent',
              border: '2px solid rgba(232, 199, 111, 0.2)',
              borderRadius: '12px',
              color: 'var(--color-light-gold)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.3s',
            }}
          >
            <HomeIcon size={20} />
            <span>زيارة الموقع</span>
          </button>
        </nav>

        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          style={{
            padding: '1rem 1.5rem',
            background: 'rgba(255, 0, 0, 0.1)',
            border: '2px solid rgba(255, 0, 0, 0.3)',
            borderRadius: '12px',
            color: '#ff6b6b',
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            cursor: 'pointer',
            transition: 'all 0.3s',
          }}
        >
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </button>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: '280px', padding: '3rem' }}>
        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}>
          <StatCard
            title="إجمالي القفاطين"
            value={stats.total}
            icon={Package}
            color="rgba(232, 199, 111, 1)"
          />
          <StatCard
            title="القفاطين النشطة"
            value={stats.active}
            icon={TrendingUp}
            color="rgba(34, 197, 94, 1)"
          />
          <StatCard
            title="القفاطين المخفية"
            value={stats.inactive}
            icon={EyeOff}
            color="rgba(239, 68, 68, 1)"
          />
          <StatCard
            title="القفاطين المميزة"
            value={stats.featured}
            icon={ShoppingBag}
            color="rgba(147, 51, 234, 1)"
          />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-gold)' }}>
            إدارة القفاطين
          </h1>
          <button
            onClick={() => router.push('/admin/dashboard/products/new')}
            className="btn btn-primary"
            style={{ gap: '0.5rem', padding: '1rem 2rem' }}
          >
            <Plus size={20} />
            <span>إضافة قفطان جديد</span>
          </button>
        </div>

        {/* Products Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
        }}>
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                background: 'linear-gradient(145deg, rgba(26, 20, 16, 0.7), rgba(10, 10, 10, 0.9))',
                border: '2px solid rgba(232, 199, 111, 0.25)',
                borderRadius: '18px',
                overflow: 'hidden',
                transition: 'all 0.4s',
              }}
            >
              <div style={{ height: '280px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={product.images[0] || '/placeholder.jpg'}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  display: 'flex',
                  gap: '0.5rem',
                }}>
                  {!product.active && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }}>
                      غير نشط
                    </div>
                  )}
                  {product.featured && (
                    <div style={{
                      background: 'rgba(147, 51, 234, 0.9)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                    }}>
                      مميز
                    </div>
                  )}
                </div>
              </div>

              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  fontSize: '1.3rem',
                  color: 'var(--color-cream)',
                  marginBottom: '0.5rem',
                  fontWeight: '600',
                }}>
                  {product.name}
                </h3>
                <p style={{
                  color: 'var(--color-gold)',
                  fontSize: '1.1rem',
                  marginBottom: '1.5rem',
                  fontWeight: '500',
                }}>
                  {product.price}
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                }}>
                  <button
                    onClick={() => router.push(`/admin/dashboard/products/${product.id}`)}
                    className="btn btn-outline"
                    style={{
                      padding: '0.75rem',
                      fontSize: '0.9rem',
                      gap: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Edit size={16} />
                    <span>تعديل</span>
                  </button>

                  <button
                    onClick={() => handleToggleActive(product.id, product.active)}
                    className="btn btn-outline"
                    style={{
                      padding: '0.75rem',
                      fontSize: '0.9rem',
                      gap: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: product.active ? 'rgba(239, 68, 68, 0.5)' : 'rgba(34, 197, 94, 0.5)',
                      color: product.active ? '#ff6b6b' : '#22c55e',
                    }}
                  >
                    {product.active ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span>{product.active ? 'إخفاء' : 'إظهار'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(product.id)}
                    className="btn btn-outline"
                    style={{
                      padding: '0.75rem',
                      fontSize: '0.9rem',
                      gap: '0.5rem',
                      borderColor: 'rgba(255, 0, 0, 0.5)',
                      color: '#ff6b6b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gridColumn: '1 / -1',
                    }}
                  >
                    <Trash2 size={16} />
                    <span>حذف نهائياً</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'rgba(26, 20, 16, 0.5)',
            border: '2px dashed rgba(232, 199, 111, 0.3)',
            borderRadius: '20px',
          }}>
            <Package size={64} color="var(--color-gold)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '1.3rem', color: 'var(--color-light-gold)', marginBottom: '1rem' }}>
              لا توجد منتجات حالياً
            </p>
            <button
              onClick={() => router.push('/admin/dashboard/products/new')}
              className="btn btn-primary"
            >
              إضافة أول قفطان
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
