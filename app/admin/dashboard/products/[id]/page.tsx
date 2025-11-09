'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowRight, Plus, X, Save, Upload, Image as ImageIcon, Star, Edit as EditIcon, Eye, EyeOff } from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    price: '',
    details: [''],
    detailsEn: [''],
    images: [''],
    featured: false,
    active: true,
  });

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`);
      const data = await res.json();
      
      const priceNumber = data.price ? data.price.replace(/[^\d.]/g, '') : '';
      
      setFormData({
        name: data.name || '',
        nameEn: data.nameEn || '',
        description: data.description || '',
        descriptionEn: data.descriptionEn || '',
        price: priceNumber,
        details: data.details && data.details.length > 0 ? data.details : [''],
        detailsEn: data.detailsEn && data.detailsEn.length > 0 ? data.detailsEn : [''],
        images: data.images && data.images.length > 0 ? data.images : [''],
        featured: data.featured || false,
        active: data.active !== undefined ? data.active : true,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('فشل تحميل القفطان');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const priceFormatted = formData.price.trim() 
        ? `${formData.price.replace(/[^\d.]/g, '')} د.ك` 
        : '';

      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: priceFormatted,
          priceEn: priceFormatted.replace('د.ك', 'KD'),
          details: formData.details.filter(d => d.trim()),
          detailsEn: formData.detailsEn.filter(d => d.trim()),
          images: formData.images.filter(img => img.trim()),
        }),
      });

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        const error = await res.json();
        alert(error.error || 'فشل تحديث القفطان');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  const addDetail = (isArabic: boolean) => {
    if (isArabic) {
      setFormData({ ...formData, details: [...formData.details, ''] });
    } else {
      setFormData({ ...formData, detailsEn: [...formData.detailsEn, ''] });
    }
  };

  const updateDetail = (index: number, value: string, isArabic: boolean) => {
    if (isArabic) {
      const newDetails = [...formData.details];
      newDetails[index] = value;
      setFormData({ ...formData, details: newDetails });
    } else {
      const newDetailsEn = [...formData.detailsEn];
      newDetailsEn[index] = value;
      setFormData({ ...formData, detailsEn: newDetailsEn });
    }
  };

  const removeDetail = (index: number, isArabic: boolean) => {
    if (isArabic) {
      setFormData({ ...formData, details: formData.details.filter((_, i) => i !== index) });
    } else {
      setFormData({ ...formData, detailsEn: formData.detailsEn.filter((_, i) => i !== index) });
    }
  };

  const addImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_, i) => i !== index) });
  };

  if (fetching) {
    return <LoadingSpinner message="جاري تحميل بيانات القفطان..." fullScreen />;
  }

  return (
    <div style={{
      padding: window.innerWidth < 768 ? '1rem' : '2rem',
      direction: 'rtl',
      maxWidth: '100%',
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
        backgroundColor: '#0a0a0a',
      }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url('/images/admin-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.45) contrast(1.05)',
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

      {/* Main Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <button
            onClick={() => router.push('/admin/dashboard')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-gold)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.95rem',
              marginBottom: '1.5rem',
              padding: '0.5rem',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}
          >
            <ArrowRight size={20} />
            <span>العودة للوحة التحكم</span>
          </button>

          <div style={{
            background: 'rgba(26, 20, 16, 0.6)',
            backdropFilter: 'blur(10px)',
            padding: '2rem',
            borderRadius: '16px',
            border: '1px solid rgba(232, 199, 111, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <h1 style={{ fontSize: '2rem', color: 'var(--color-gold)', marginBottom: '0.5rem', fontWeight: '700' }}>
                تعديل القفطان
              </h1>
              <p style={{ color: 'rgba(232, 199, 111, 0.7)', fontSize: '0.95rem' }}>
                قم بتحديث معلومات القفطان
              </p>
            </div>
            <EditIcon size={48} color="var(--color-gold)" style={{ opacity: 0.3 }} />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* Basic Info Section */}
            <div style={{
              background: 'rgba(26, 20, 16, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(232, 199, 111, 0.2)',
              borderRadius: '16px',
              padding: '2rem',
            }}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--color-cream)', marginBottom: '1.5rem', fontWeight: '600' }}>
                المعلومات الأساسية
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Arabic Name */}
                <div>
                  <label style={labelStyle}>
                    الاسم بالعربية *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="مثال: قفطان الأميرة"
                    style={inputStyle}
                  />
                </div>

                {/* English Name */}
                <div>
                  <label style={labelStyle}>
                    Name in English *
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    required
                    placeholder="Example: Princess Caftan"
                    style={inputStyle}
                  />
                </div>

                {/* Price */}
                <div>
                  <label style={labelStyle}>
                    السعر (د.ك)
                  </label>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value.replace(/[^\d.]/g, '') })}
                    placeholder="مثال: 150 (اتركه فارغاً للسعر حسب الطلب)"
                    style={inputStyle}
                  />
                </div>

              </div>

              {/* Featured & Active */}
              <div style={{
                marginTop: '1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--color-gold)' }}
                  />
                  <Star size={18} color="var(--color-gold)" fill={formData.featured ? 'var(--color-gold)' : 'none'} />
                  <span style={{ color: 'var(--color-cream)' }}>قفطان مميز</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#22c55e' }}
                  />
                  {formData.active ? <Eye size={18} color="#22c55e" /> : <EyeOff size={18} color="#ef4444" />}
                  <span style={{ color: 'var(--color-cream)' }}>نشط</span>
                </label>
              </div>
            </div>

            {/* Descriptions Section */}
            <div style={{
              background: 'rgba(26, 20, 16, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(232, 199, 111, 0.2)',
              borderRadius: '16px',
              padding: '2rem',
            }}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--color-cream)', marginBottom: '1.5rem', fontWeight: '600' }}>
                الوصف
              </h2>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {/* Arabic Description */}
                <div>
                  <label style={labelStyle}>
                    الوصف بالعربية *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    placeholder="اكتب وصفاً تفصيلياً للقفطان بالعربية..."
                    rows={4}
                    style={textareaStyle}
                  />
                </div>

                {/* English Description */}
                <div>
                  <label style={labelStyle}>
                    Description in English *
                  </label>
                  <textarea
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    required
                    placeholder="Write a detailed description in English..."
                    rows={4}
                    style={textareaStyle}
                  />
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div style={{
              background: 'rgba(26, 20, 16, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(232, 199, 111, 0.2)',
              borderRadius: '16px',
              padding: '2rem',
            }}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--color-cream)', marginBottom: '1.5rem', fontWeight: '600' }}>
                المواصفات والتفاصيل
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Arabic Details */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <label style={labelStyle}>التفاصيل بالعربية</label>
                    <button
                      type="button"
                      onClick={() => addDetail(true)}
                      style={addButtonStyle}
                    >
                      <Plus size={16} />
                      <span>إضافة تفصيلة</span>
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {formData.details.map((detail, index) => (
                      <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => updateDetail(index, e.target.value, true)}
                          placeholder={`تفصيلة ${index + 1}`}
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        {formData.details.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDetail(index, true)}
                            style={removeButtonStyle}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* English Details */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <label style={labelStyle}>Details in English</label>
                    <button
                      type="button"
                      onClick={() => addDetail(false)}
                      style={addButtonStyle}
                    >
                      <Plus size={16} />
                      <span>Add Detail</span>
                    </button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {formData.detailsEn.map((detail, index) => (
                      <div key={index} style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          value={detail}
                          onChange={(e) => updateDetail(index, e.target.value, false)}
                          placeholder={`Detail ${index + 1}`}
                          style={{ ...inputStyle, flex: 1 }}
                        />
                        {formData.detailsEn.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDetail(index, false)}
                            style={removeButtonStyle}
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div style={{
              background: 'rgba(26, 20, 16, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(232, 199, 111, 0.2)',
              borderRadius: '16px',
              padding: '2rem',
            }}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--color-cream)', marginBottom: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ImageIcon size={24} color="var(--color-gold)" />
                <span>صور القفطان</span>
              </h2>

              {formData.images.map((image, index) => (
                <div key={index} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ color: 'var(--color-cream)', fontSize: '0.9rem', fontWeight: '500' }}>
                      الصورة {index + 1}
                    </label>
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={{
                          padding: '0.5rem 1rem',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          borderRadius: '8px',
                          color: '#f87171',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <X size={14} />
                        <span>حذف</span>
                      </button>
                    )}
                  </div>
                  <ImageUploader
                    currentValue={image}
                    onImageSelect={(url) => updateImage(index, url)}
                    showGallery={true}
                    label=""
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={addImage}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  background: 'rgba(232, 199, 111, 0.1)',
                  border: '1px solid rgba(232, 199, 111, 0.3)',
                  borderRadius: '12px',
                  color: 'var(--color-gold)',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '1rem',
                }}
              >
                <Plus size={18} />
                <span>إضافة صورة أخرى</span>
              </button>
            </div>

            {/* Submit Button */}
            <div style={{
              background: 'rgba(26, 20, 16, 0.6)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(232, 199, 111, 0.2)',
              borderRadius: '16px',
              padding: '2rem',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{
                  padding: '1rem 3rem',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontWeight: '600',
                }}
              >
                <Save size={22} />
                <span>{loading ? 'جاري الحفظ...' : 'حفظ التعديلات'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.5rem',
  color: 'var(--color-cream)',
  fontWeight: '600',
  fontSize: '0.95rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.875rem',
  background: 'rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(232, 199, 111, 0.3)',
  borderRadius: '8px',
  color: 'var(--color-cream)',
  fontSize: '0.95rem',
  transition: 'all 0.3s',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  resize: 'vertical',
  fontFamily: 'inherit',
};

const addButtonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  background: 'rgba(232, 199, 111, 0.1)',
  border: '1px solid rgba(232, 199, 111, 0.3)',
  borderRadius: '8px',
  color: 'var(--color-gold)',
  fontSize: '0.85rem',
  cursor: 'pointer',
  transition: 'all 0.3s',
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
  fontWeight: '500',
};

const removeButtonStyle: React.CSSProperties = {
  padding: '0.625rem',
  background: 'rgba(255, 0, 0, 0.1)',
  border: '1px solid rgba(255, 0, 0, 0.3)',
  borderRadius: '8px',
  color: '#ff6b6b',
  cursor: 'pointer',
  transition: 'all 0.3s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
};
