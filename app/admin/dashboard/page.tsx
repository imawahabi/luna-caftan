'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Trash2, Edit, Eye, EyeOff, 
  Package, TrendingUp, ShoppingBag
} from 'lucide-react';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import AddCaftanButton from '@/components/AddCaftanButton';

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

export default function DashboardPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, inactive: 0, featured: 0 });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; product: Product | null }>({ isOpen: false, product: null });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?admin=true');
      const data = await res.json();
      setProducts(data);
      
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
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('فشل حذف المنتج');
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      console.log('🔄 Toggling product:', id, 'from', currentActive, 'to', !currentActive);
      const res = await fetch(`/api/products/${id}/toggle`, {
        method: 'POST',
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to toggle');
      }
      const result = await res.json();
      console.log('✅ Toggle result:', result);
      fetchProducts();
    } catch (error: any) {
      console.error('❌ Error toggling product:', error);
      alert('فشل تغيير حالة القفطان: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{ color: 'var(--color-gold)', fontSize: '1.5rem' }}>جاري التحميل...</p>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, gradient }: any) => (
    <div style={{
      background: gradient,
      backdropFilter: 'blur(20px)',
      border: `2px solid ${color}`,
      borderRadius: '20px',
      padding: '2rem',
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
      e.currentTarget.style.boxShadow = `0 20px 40px ${color}40, 0 0 60px ${color}20`;
      e.currentTarget.style.borderColor = color;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0) scale(1)';
      e.currentTarget.style.boxShadow = 'none';
      e.currentTarget.style.borderColor = `${color}80`;
    }}
    >
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '150px',
        height: '150px',
        background: `radial-gradient(circle, ${color}15, transparent 70%)`,
        borderRadius: '50%',
        transform: 'translate(30%, -30%)',
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{
            padding: '1rem',
            background: `${color}25`,
            borderRadius: '16px',
            display: 'flex',
            boxShadow: `0 8px 16px ${color}20`,
          }}>
            <Icon size={32} color={color} strokeWidth={2.5} />
          </div>

        </div>
        
        <div>
          <p style={{ 
            color: 'rgba(232, 199, 111, 0.8)', 
            fontSize: '0.9rem', 
            marginBottom: '0.5rem',
            fontWeight: '500',
            letterSpacing: '0.5px',
          }}>
            {title}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <p style={{ 
              color: 'var(--color-cream)', 
              fontSize: '3rem', 
              fontWeight: '800', 
              lineHeight: 1,
              textShadow: `0 2px 10px ${color}30`,
            }}>
              {value}
            </p>
            <span style={{ color: color, fontSize: '1rem', fontWeight: '600' }}>قفطان</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      padding: '2rem',
      direction: 'rtl',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', color: 'var(--color-gold)', fontWeight: '700', marginBottom: '0.5rem' }}>
          لوحة التحكم
        </h1>
        <p style={{ color: 'var(--color-light-gold)', fontSize: '1rem' }}>
          إليك نظرة عامة على متجرك
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem',
      }}>
        <StatCard
          title="إجمالي القفاطين"
          value={stats.total}
          icon={Package}
          color="#e8c76f"
          gradient="linear-gradient(135deg, rgba(232, 199, 111, 0.15), rgba(212, 175, 55, 0.08))"
        />
        <StatCard
          title="القفاطين النشطة"
          value={stats.active}
          icon={TrendingUp}
          color="#22c55e"
          gradient="linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.08))"
        />
        <StatCard
          title="القفاطين المخفية"
          value={stats.inactive}
          icon={EyeOff}
          color="#ef4444"
          gradient="linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.08))"
        />
        <StatCard
          title="القفاطين المميزة"
          value={stats.featured}
          icon={ShoppingBag}
          color="#a78bfa"
          gradient="linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(139, 92, 246, 0.08))"
        />
      </div>

      {/* Products Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
      }}>
        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-cream)', fontWeight: '600' }}>
          إدارة القفاطين
        </h2>
        <AddCaftanButton size="medium" />
      </div>

      {/* Products Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}>
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              background: 'rgba(26, 20, 16, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(232, 199, 111, 0.2)',
              borderRadius: '16px',
              overflow: 'hidden',
              transition: 'all 0.3s',
            }}
          >
            <div style={{ height: '250px', position: 'relative', overflow: 'hidden' }}>
              <img
                src={product.images[0] || '/placeholder.jpg'}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              {/* Status Badges */}
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                alignItems: 'flex-end',
              }}>
                {!product.active && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: '0.5rem 0.9rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                  }}>
                    غير نشط
                  </div>
                )}
                {product.featured && (
                  <div style={{
                    background: 'rgba(147, 51, 234, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    padding: '0.5rem 0.9rem',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(147, 51, 234, 0.4)',
                  }}>
                    ⭐ مميز
                  </div>
                )}
              </div>
              
              {/* Toggle Active Button - Top Left */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleActive(product.id, product.active);
                }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  padding: '0.6rem',
                  background: product.active 
                    ? 'rgba(251, 146, 60, 0.95)'
                    : 'rgba(34, 197, 94, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '50%',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  boxShadow: product.active 
                    ? '0 4px 12px rgba(251, 146, 60, 0.4)'
                    : '0 4px 12px rgba(34, 197, 94, 0.4)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.1)';
                  e.currentTarget.style.boxShadow = product.active 
                    ? '0 6px 16px rgba(251, 146, 60, 0.6)'
                    : '0 6px 16px rgba(34, 197, 94, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = product.active 
                    ? '0 4px 12px rgba(251, 146, 60, 0.4)'
                    : '0 4px 12px rgba(34, 197, 94, 0.4)';
                }}
                title={product.active ? 'إخفاء القفطان' : 'إظهار القفطان'}
              >
                {product.active ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <h3 style={{
                fontSize: '1.1rem',
                color: 'var(--color-cream)',
                marginBottom: '0.5rem',
                fontWeight: '600',
              }}>
                {product.name}
              </h3>
              <p style={{
                color: 'var(--color-gold)',
                fontSize: '1rem',
                marginBottom: '1.25rem',
                fontWeight: '500',
              }}>
                {product.price}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.5rem',
              }}>
                {/* Edit Button */}
                <button
                  onClick={() => router.push(`/admin/dashboard/products/${product.id}`)}
                  style={{
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1))',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    borderRadius: '10px',
                    color: '#60a5fa',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.15))';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1))';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Edit size={16} />
                  <span>تعديل</span>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => setDeleteModal({ isOpen: true, product })}
                  style={{
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '10px',
                    color: '#ef4444',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(220, 38, 38, 0.15))';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <Trash2 size={16} />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'rgba(26, 20, 16, 0.4)',
          border: '2px dashed rgba(232, 199, 111, 0.3)',
          borderRadius: '16px',
        }}>
          <Package size={64} color="var(--color-gold)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1.2rem', color: 'var(--color-light-gold)', marginBottom: '1rem' }}>
            لا توجد قفاطين حالياً
          </p>
          <AddCaftanButton size="large" />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, product: null })}
        onConfirmDelete={() => deleteModal.product && handleDelete(deleteModal.product.id)}
        onConfirmHide={() => deleteModal.product && handleToggleActive(deleteModal.product.id, deleteModal.product.active)}
        productName={deleteModal.product?.name || ''}
      />
    </div>
  );
}
