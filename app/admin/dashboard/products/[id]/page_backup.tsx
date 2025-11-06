'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Plus, X, Save, Upload, Image as ImageIcon, Star } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const priceFormatted = formData.price.trim() 
        ? `${formData.price.replace(/[^\d.]/g, '')} د.ك` 
        : '';

      const res = await fetch('/api/products', {
        method: 'POST',
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
        alert(error.error || 'فشل إضافة المنتج');
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

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      direction: 'rtl',
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
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
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
                إضافة قفطان جديد
              </h1>
              <p style={{ color: 'rgba(232, 199, 111, 0.7)', fontSize: '0.95rem' }}>
                املأ المعلومات أدناه لإضافة قفطان جديد إلى المتجر
              </p>
            </div>
            <Plus size={48} color="var(--color-gold)" style={{ opacity: 0.3 }} />
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

                {/* Featured */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 0' }}>
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    style={{
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer',
                      accentColor: 'var(--color-gold)',
                    }}
                  />
                  <label htmlFor="featured" style={{ color: 'var(--color-cream)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Star size={18} color="var(--color-gold)" fill={formData.featured ? 'var(--color-gold)' : 'none'} />
                    <span>قفطان مميز</span>
                  </label>
                </div>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.3rem', color: 'var(--color-cream)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ImageIcon size={24} color="var(--color-gold)" />
                  <span>صور المنتج</span>
                </h2>
                <button
                  type="button"
                  onClick={addImage}
                  style={addButtonStyle}
                >
                  <Plus size={16} />
                  <span>إضافة صورة</span>
                </button>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {formData.images.map((image, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'center',
                    padding: '1rem',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '12px',
                    border: '1px solid rgba(232, 199, 111, 0.15)',
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'rgba(232, 199, 111, 0.1)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Upload size={20} color="var(--color-gold)" />
                    </div>
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => updateImage(index, e.target.value)}
                      placeholder={`رابط الصورة ${index + 1} (URL)`}
                      style={{ ...inputStyle, flex: 1, margin: 0 }}
                    />
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        style={removeButtonStyle}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <p style={{
                marginTop: '1rem',
                color: 'rgba(232, 199, 111, 0.6)',
                fontSize: '0.85rem',
                textAlign: 'center',
              }}>
                💡 يمكنك استخدام روابط الصور من خدمات مثل Imgur أو Cloudinary
              </p>
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
                <span>{loading ? 'جاري الحفظ...' : 'حفظ القفطان'}</span>
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
