'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Trash2, Edit, Eye, EyeOff, 
  Package, Calendar, Star, Filter
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
  createdAt: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'featured'>('all');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; product: Product | null }>({ isOpen: false, product: null });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products?admin=true');
      if (!res.ok) {
        throw new Error(`API error: Status ${res.status}`);
      }
      const data = await res.json();
      
      // Sort by creation date (newest first)
      const sortedData = data.sort((a: Product, b: Product) => {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
      
      setProducts(sortedData);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('فشل تحميل القفاطين. تحقق من الاتصال بالخادم.');
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
      alert('فشل حذف القفطان');
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

  const filteredProducts = products.filter(product => {
    if (filter === 'active') return product.active;
    if (filter === 'inactive') return !product.active;
    if (filter === 'featured') return product.featured;
    return true;
  });

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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'غير محدد';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-UK', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div style={{
      padding: '2rem',
      direction: 'rtl',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', color: 'var(--color-gold)', fontWeight: '700', marginBottom: '0.5rem' }}>
            جميع القفاطين
          </h1>
          <p style={{ color: 'var(--color-light-gold)', fontSize: '1rem' }}>
            {filteredProducts.length} قفطان • مرتبة حسب الأحدث
          </p>
        </div>
        <AddCaftanButton size="medium" />
      </div>

      {/* Filter Buttons */}
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
      }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '0.625rem 1.25rem',
            background: filter === 'all' ? 'rgba(232, 199, 111, 0.2)' : 'rgba(26, 20, 16, 0.6)',
            border: `1px solid ${filter === 'all' ? 'rgba(232, 199, 111, 0.5)' : 'rgba(232, 199, 111, 0.2)'}`,
            borderRadius: '12px',
            color: filter === 'all' ? 'var(--color-gold)' : 'var(--color-light-gold)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: filter === 'all' ? '600' : '500',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Filter size={16} />
          <span>الكل ({products.length})</span>
        </button>
        <button
          onClick={() => setFilter('active')}
          style={{
            padding: '0.625rem 1.25rem',
            background: filter === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(26, 20, 16, 0.6)',
            border: `1px solid ${filter === 'active' ? 'rgba(34, 197, 94, 0.5)' : 'rgba(232, 199, 111, 0.2)'}`,
            borderRadius: '12px',
            color: filter === 'active' ? '#22c55e' : 'var(--color-light-gold)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: filter === 'active' ? '600' : '500',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Eye size={16} />
          <span>النشطة ({products.filter(p => p.active).length})</span>
        </button>
        <button
          onClick={() => setFilter('inactive')}
          style={{
            padding: '0.625rem 1.25rem',
            background: filter === 'inactive' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(26, 20, 16, 0.6)',
            border: `1px solid ${filter === 'inactive' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(232, 199, 111, 0.2)'}`,
            borderRadius: '12px',
            color: filter === 'inactive' ? '#f87171' : 'var(--color-light-gold)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: filter === 'inactive' ? '600' : '500',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <EyeOff size={16} />
          <span>المخفية ({products.filter(p => !p.active).length})</span>
        </button>
        <button
          onClick={() => setFilter('featured')}
          style={{
            padding: '0.625rem 1.25rem',
            background: filter === 'featured' ? 'rgba(147, 51, 234, 0.2)' : 'rgba(26, 20, 16, 0.6)',
            border: `1px solid ${filter === 'featured' ? 'rgba(147, 51, 234, 0.5)' : 'rgba(232, 199, 111, 0.2)'}`,
            borderRadius: '12px',
            color: filter === 'featured' ? '#a78bfa' : 'var(--color-light-gold)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: filter === 'featured' ? '600' : '500',
            transition: 'all 0.3s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Star size={16} />
          <span>المميزة ({products.filter(p => p.featured).length})</span>
        </button>
      </div>

      {/* Products Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
      }}>
        {filteredProducts.map((product) => {
          const isInactive = !product.active;
          const cardStyle: React.CSSProperties = {
            background: isInactive ? 'rgba(60, 60, 60, 0.4)' : 'rgba(26, 20, 16, 0.6)',
            backdropFilter: 'blur(10px)',
            border: isInactive ? '1px solid rgba(148, 163, 184, 0.35)' : '1px solid rgba(232, 199, 111, 0.2)',
            borderRadius: '16px',
            overflow: 'hidden',
            transition: 'all 0.3s',
            filter: isInactive ? 'grayscale(100%) brightness(0.85)' : 'none',
            opacity: isInactive ? 0.75 : 1,
            position: 'relative',
          };

          const imageStyle: React.CSSProperties = {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: isInactive ? 'scale(1.02)' : 'none',
            transition: 'transform 0.3s ease',
          };

          return (
            <div
              key={product.id}
              style={cardStyle}
            >
              <div style={{ height: '250px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={product.images[0] || '/placeholder.jpg'}
                  alt={product.name}
                  style={imageStyle}
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
                      background: 'rgba(148, 163, 184, 0.9)',
                      backdropFilter: 'blur(10px)',
                      color: '#f8fafc',
                      padding: '0.5rem 0.9rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(148, 163, 184, 0.35)',
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

                {/* Date Badge */}
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  background: 'rgba(0, 0, 0, 0.8)',
                  backdropFilter: 'blur(10px)',
                  color: 'var(--color-light-gold)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}>
                  <Calendar size={12} />
                  <span>{formatDate(product.createdAt)}</span>
                </div>
              </div>

              <div style={{ padding: '1.25rem', position: 'relative' }}>
                {!product.active && (
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.25), rgba(15, 23, 42, 0.35))',
                    pointerEvents: 'none',
                  }} />
                )}
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
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.25)';
                    }}
                    onMouseLeave={(e) => {
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
                      color: '#f87171',
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
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.25)';
                    }}
                    onMouseLeave={(e) => {
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
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'rgba(26, 20, 16, 0.4)',
          border: '2px dashed rgba(232, 199, 111, 0.3)',
          borderRadius: '16px',
        }}>
          <Package size={64} color="var(--color-gold)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
          <p style={{ fontSize: '1.2rem', color: 'var(--color-light-gold)', marginBottom: '1rem' }}>
            {filter === 'all' ? 'لا توجد قفاطين حالياً' : `لا توجد قفاطين ${filter === 'active' ? 'نشطة' : filter === 'inactive' ? 'مخفية' : 'مميزة'}`}
          </p>
          {filter === 'all' && (
            <AddCaftanButton size="large" />
          )}
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
