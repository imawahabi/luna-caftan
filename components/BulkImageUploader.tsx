'use client';

import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Trash2, Plus, X } from 'lucide-react';
import ImageUploader from './ImageUploader';

interface BulkImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function BulkImageUploader({ images, onChange }: BulkImageUploaderProps) {
  const [bulkUrls, setBulkUrls] = useState('');
  const [showBulkInput, setShowBulkInput] = useState(false);

  const addImage = () => {
    onChange([...images, '']);
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...images];
    newImages[index] = value;
    onChange(newImages);
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const handleBulkAdd = () => {
    const urls = bulkUrls
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);
    
    if (urls.length > 0) {
      onChange([...images.filter(img => img.trim()), ...urls]);
      setBulkUrls('');
      setShowBulkInput(false);
    }
  };

  return (
    <div style={{
      background: 'rgba(26, 20, 16, 0.6)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(232, 199, 111, 0.2)',
      borderRadius: '16px',
      padding: '2rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
      }}>
        <h2 style={{
          fontSize: '1.3rem',
          color: 'var(--color-cream)',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <Upload size={24} color="var(--color-gold)" />
          <span>صور القفطان</span>
          <span style={{
            background: 'rgba(232, 199, 111, 0.15)',
            padding: '0.25rem 0.75rem',
            borderRadius: '20px',
            fontSize: '0.85rem',
            color: 'var(--color-gold)',
          }}>
            {images.filter(img => img.trim()).length} صورة
          </span>
        </h2>

        <button
          type="button"
          onClick={() => setShowBulkInput(!showBulkInput)}
          style={{
            padding: '0.625rem 1.25rem',
            background: showBulkInput 
              ? 'rgba(239, 68, 68, 0.1)' 
              : 'rgba(232, 199, 111, 0.1)',
            border: showBulkInput
              ? '1px solid rgba(239, 68, 68, 0.3)'
              : '1px solid rgba(232, 199, 111, 0.3)',
            borderRadius: '8px',
            color: showBulkInput ? '#ef4444' : 'var(--color-gold)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s',
          }}
        >
          {showBulkInput ? <X size={16} /> : <LinkIcon size={16} />}
          <span>{showBulkInput ? 'إلغاء' : 'إضافة روابط متعددة'}</span>
        </button>
      </div>

      {/* Bulk URL Input */}
      {showBulkInput && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '1.5rem',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          border: '1px solid rgba(232, 199, 111, 0.2)',
        }}>
          <label style={{
            display: 'block',
            marginBottom: '0.75rem',
            color: 'var(--color-cream)',
            fontWeight: '600',
            fontSize: '0.95rem',
          }}>
            أضف روابط الصور (رابط واحد في كل سطر)
          </label>
          <textarea
            value={bulkUrls}
            onChange={(e) => setBulkUrls(e.target.value)}
            placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
            rows={6}
            style={{
              width: '100%',
              padding: '0.875rem',
              background: 'rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(232, 199, 111, 0.3)',
              borderRadius: '8px',
              color: 'var(--color-cream)',
              fontSize: '0.9rem',
              resize: 'vertical',
              fontFamily: 'monospace',
            }}
          />
          <div style={{
            display: 'flex',
            gap: '0.75rem',
            marginTop: '1rem',
          }}>
            <button
              type="button"
              onClick={handleBulkAdd}
              disabled={!bulkUrls.trim()}
              style={{
                flex: 1,
                padding: '0.75rem',
                background: bulkUrls.trim() 
                  ? 'rgba(34, 197, 94, 0.15)' 
                  : 'rgba(100, 100, 100, 0.1)',
                border: bulkUrls.trim()
                  ? '1px solid rgba(34, 197, 94, 0.3)'
                  : '1px solid rgba(100, 100, 100, 0.2)',
                borderRadius: '8px',
                color: bulkUrls.trim() ? '#22c55e' : '#666',
                cursor: bulkUrls.trim() ? 'pointer' : 'not-allowed',
                fontSize: '0.9rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s',
              }}
            >
              <Plus size={18} />
              <span>إضافة الروابط ({bulkUrls.split('\n').filter(u => u.trim()).length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Individual Images */}
      <div style={{
        display: 'grid',
        gap: '1.25rem',
      }}>
        {images.map((image, index) => (
          <div
            key={index}
            style={{
              padding: '1.25rem',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '12px',
              border: '1px solid rgba(232, 199, 111, 0.15)',
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem',
            }}>
              <label style={{
                color: 'var(--color-cream)',
                fontSize: '0.9rem',
                fontWeight: '600',
              }}>
                الصورة {index + 1}
              </label>
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s',
                  }}
                >
                  <Trash2 size={14} />
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
      </div>

      {/* Add Image Button */}
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
          transition: 'all 0.3s',
        }}
      >
        <Plus size={18} />
        <span>إضافة صورة واحدة أخرى</span>
      </button>
    </div>
  );
}
