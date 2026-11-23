'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AddCaftanButtonProps {
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export default function AddCaftanButton({ 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false 
}: AddCaftanButtonProps) {
  const router = useRouter();

  const sizes = {
    small: {
      padding: '0.75rem 1.5rem',
      fontSize: '0.95rem',
      iconSize: 18,
    },
    medium: {
      padding: '1rem 2rem',
      fontSize: '1.05rem',
      iconSize: 22,
    },
    large: {
      padding: '1.25rem 2.5rem',
      fontSize: '1.15rem',
      iconSize: 24,
    },
  };

  const currentSize = sizes[size];

  return (
    <button
      onClick={() => router.push('/admin/dashboard/products/new')}
      style={{
        padding: currentSize.padding,
        background: variant === 'primary'
          ? 'linear-gradient(135deg, #e8c76f 0%, #d4af37 50%, #c9a961 100%)'
          : 'linear-gradient(135deg, rgba(232, 199, 111, 0.2), rgba(212, 175, 55, 0.15))',
        border: variant === 'primary' 
          ? 'none' 
          : '2px solid rgba(232, 199, 111, 0.5)',
        borderRadius: '16px',
        color: variant === 'primary' ? '#44240eff' : 'var(--color-gold)',
        cursor: 'pointer',
        fontSize: currentSize.fontSize,
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: variant === 'primary'
          ? '0 8px 24px rgba(232, 199, 111, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.1)'
          : '0 4px 12px rgba(232, 199, 111, 0.2)',
        position: 'relative',
        overflow: 'hidden',
        width: fullWidth ? '100%' : 'auto',
        textShadow: variant === 'primary' ? '0 1px 2px rgba(0, 0, 0, 0.1)' : 'none',
      }}
      onMouseEnter={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(232, 199, 111, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(0, 0, 0, 0.15)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #f0d080 0%, #ddb847 50%, #d4af37 100%)';
        } else {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(232, 199, 111, 0.4)';
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(232, 199, 111, 0.3), rgba(212, 175, 55, 0.2))';
        }
      }}
      onMouseLeave={(e) => {
        if (variant === 'primary') {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(232, 199, 111, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.1)';
          e.currentTarget.style.background = 'linear-gradient(135deg, #e8c76f 0%, #d4af37 50%, #c9a961 100%)';
        } else {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(232, 199, 111, 0.2)';
          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(232, 199, 111, 0.2), rgba(212, 175, 55, 0.15))';
        }
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = variant === 'primary' 
          ? 'translateY(-3px) scale(1.02)' 
          : 'translateY(-2px)';
      }}
    >
      {/* Shine Effect */}
      {variant === 'primary' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
          animation: 'shine 3s infinite',
        }} />
      )}
      
      <Plus size={currentSize.iconSize} strokeWidth={3} />
      <span style={{ position: 'relative', zIndex: 1 }}>إضافة قفطان جديد</span>

      <style jsx>{`
        @keyframes shine {
          0% {
            left: -100%;
          }
          50%, 100% {
            left: 100%;
          }
        }
      `}</style>
    </button>
  );
}
