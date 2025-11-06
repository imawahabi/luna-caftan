'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, ExternalLink, Trash2 } from 'lucide-react';

interface UploadedImage {
  filename: string;
  url: string;
  size: number;
  createdAt: string;
}

interface ImageUploaderProps {
  onImageSelect: (url: string) => void;
  currentValue?: string;
  label?: string;
  showGallery?: boolean;
}

export default function ImageUploader({ 
  onImageSelect, 
  currentValue = '', 
  label = 'الصورة',
  showGallery = true 
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [loadingGallery, setLoadingGallery] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [useExternalUrl, setUseExternalUrl] = useState(false);
  const [externalUrl, setExternalUrl] = useState(currentValue);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showGallery) {
      fetchUploadedImages();
    }
  }, [showGallery]);

  useEffect(() => {
    setExternalUrl(currentValue);
  }, [currentValue]);

  const fetchUploadedImages = async () => {
    setLoadingGallery(true);
    try {
      const res = await fetch('/api/upload');
      const data = await res.json();
      setUploadedImages(data.images || []);
    } catch (err) {
      console.error('Error fetching images:', err);
    } finally {
      setLoadingGallery(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'فشل رفع الصورة');
      }

      onImageSelect(data.url);
      setExternalUrl(data.url);
      setUseExternalUrl(false);
      await fetchUploadedImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الصورة');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async (filename: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return;

    try {
      const res = await fetch(`/api/upload?filename=${filename}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        await fetchUploadedImages();
        if (currentValue.includes(filename)) {
          onImageSelect('');
          setExternalUrl('');
        }
      }
    } catch (err) {
      console.error('Error deleting image:', err);
    }
  };

  const handleExternalUrlSubmit = () => {
    if (externalUrl.trim()) {
      onImageSelect(externalUrl.trim());
      setUseExternalUrl(false);
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '0.75rem', 
        color: 'var(--color-cream)',
        fontWeight: '600',
        fontSize: '0.95rem'
      }}>
        {label}
      </label>

      {error && (
        <div style={{
          padding: '0.75rem',
          marginBottom: '1rem',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#f87171',
          fontSize: '0.9rem',
        }}>
          {error}
        </div>
      )}

      {/* Current Image Preview */}
      {currentValue && (
        <div style={{
          marginBottom: '1rem',
          padding: '1rem',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          border: '1px solid rgba(232, 199, 111, 0.2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img 
              src={currentValue} 
              alt="Preview" 
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '2px solid rgba(232, 199, 111, 0.3)',
              }}
            />
            <div style={{ flex: 1 }}>
              <p style={{ color: 'var(--color-cream)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                الصورة الحالية
              </p>
              <p style={{ color: 'var(--color-light-gold)', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                {currentValue}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                onImageSelect('');
                setExternalUrl('');
              }}
              style={{
                padding: '0.5rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                color: '#f87171',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Upload Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* Main Upload Buttons */}
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: showGallery ? '1fr 1fr' : '1fr' }}>
          {/* Upload from Computer */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.15), rgba(212, 175, 55, 0.1))',
              border: '2px solid rgba(232, 199, 111, 0.4)',
              borderRadius: '12px',
              color: 'var(--color-gold)',
              cursor: uploading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(232, 199, 111, 0.2)',
            }}
            onMouseEnter={(e) => {
              if (!uploading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(232, 199, 111, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(232, 199, 111, 0.2)';
            }}
          >
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>جاري الرفع...</span>
              </>
            ) : (
              <>
                <Upload size={20} />
                <span>رفع من الجهاز</span>
              </>
            )}
          </button>

          {/* Browse Gallery */}
          {showGallery && (
            <button
              type="button"
              onClick={() => setShowImageGallery(!showImageGallery)}
              style={{
                padding: '1rem',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(37, 99, 235, 0.1))',
                border: '2px solid rgba(59, 130, 246, 0.4)',
                borderRadius: '12px',
                color: '#60a5fa',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                fontSize: '1rem',
                fontWeight: '600',
                transition: 'all 0.3s',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
              }}
            >
              <ImageIcon size={20} />
              <span>المعرض</span>
            </button>
          )}
        </div>

        {/* External URL - Secondary */}
        <button
          type="button"
          onClick={() => setUseExternalUrl(!useExternalUrl)}
          style={{
            padding: '0.625rem',
            background: 'transparent',
            border: '1px dashed rgba(168, 85, 247, 0.3)',
            borderRadius: '8px',
            color: '#a78bfa',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            fontSize: '0.85rem',
            fontWeight: '500',
            transition: 'all 0.3s',
            opacity: 0.7,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.background = 'rgba(168, 85, 247, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.7';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <ExternalLink size={16} />
          <span>أو استخدم رابط خارجي</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />

      {/* External URL Input */}
      {useExternalUrl && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(168, 85, 247, 0.05)',
          border: '1px solid rgba(168, 85, 247, 0.2)',
          borderRadius: '12px',
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="url"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              style={{
                flex: 1,
                padding: '0.75rem',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '8px',
                color: 'var(--color-cream)',
              }}
            />
            <button
              type="button"
              onClick={handleExternalUrlSubmit}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'rgba(168, 85, 247, 0.2)',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                borderRadius: '8px',
                color: '#a78bfa',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              تطبيق
            </button>
          </div>
        </div>
      )}

      {/* Image Gallery */}
      {showImageGallery && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(232, 199, 111, 0.2)',
          borderRadius: '12px',
          maxHeight: '400px',
          overflowY: 'auto',
        }}>
          <h3 style={{ 
            color: 'var(--color-gold)', 
            marginBottom: '1rem',
            fontSize: '1rem',
            fontWeight: '600'
          }}>
            معرض الصور ({uploadedImages.length})
          </h3>

          {loadingGallery ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-light-gold)' }}>
              <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto' }} />
              <p style={{ marginTop: '0.5rem' }}>جاري التحميل...</p>
            </div>
          ) : uploadedImages.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-light-gold)', padding: '2rem' }}>
              لا توجد صور في المعرض
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: '0.75rem',
            }}>
              {uploadedImages.map((image) => (
                <div
                  key={image.filename}
                  style={{
                    position: 'relative',
                    aspectRatio: '1',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: currentValue === image.url 
                      ? '3px solid var(--color-gold)' 
                      : '1px solid rgba(232, 199, 111, 0.2)',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    onImageSelect(image.url);
                    setExternalUrl(image.url);
                    setShowImageGallery(false);
                  }}
                >
                  <img
                    src={image.url}
                    alt={image.filename}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image.filename);
                    }}
                    style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      padding: '0.25rem',
                      background: 'rgba(239, 68, 68, 0.9)',
                      border: 'none',
                      borderRadius: '4px',
                      color: 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
