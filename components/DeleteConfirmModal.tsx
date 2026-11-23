'use client';

import { AlertTriangle, X, Trash2, EyeOff } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
  onConfirmHide: () => void;
  productName: string;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirmDelete,
  onConfirmHide,
  productName,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(26, 20, 16, 0.98), rgba(20, 15, 12, 0.98))',
          border: '2px solid rgba(232, 199, 111, 0.3)',
          borderRadius: '24px',
          maxWidth: '500px',
          width: '100%',
          padding: '2rem',
          position: 'relative',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 100px rgba(232, 199, 111, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
            color: 'var(--color-cream)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'rotate(90deg)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'rotate(0deg)';
          }}
        >
          <X size={20} />
        </button>

        {/* Warning Icon */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.1))',
            borderRadius: '50%',
            padding: '1.5rem',
            animation: 'pulse 2s infinite',
          }}>
            <AlertTriangle size={48} color="#ef4444" strokeWidth={2.5} />
          </div>
        </div>

        {/* Title */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: 'var(--color-gold)',
          textAlign: 'center',
          marginBottom: '1rem',
          direction: 'rtl',
        }}>
          تحذير: حذف نهائي!
        </h2>

        {/* Product Name */}
        <div style={{
          background: 'rgba(232, 199, 111, 0.1)',
          border: '1px solid rgba(232, 199, 111, 0.3)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}>
          <p style={{
            color: 'var(--color-cream)',
            fontSize: '1.1rem',
            fontWeight: '600',
            direction: 'rtl',
          }}>
            {productName}
          </p>
        </div>

        {/* Warning Message */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.5rem',
          direction: 'rtl',
        }}>
          <p style={{
            color: '#f87171',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            marginBottom: '0.75rem',
          }}>
            ⚠️ <strong>تحذير:</strong> الحذف النهائي لا يمكن التراجع عنه!
          </p>
          <p style={{
            color: 'var(--color-light-gold)',
            fontSize: '0.9rem',
            lineHeight: '1.6',
          }}>
            💡 <strong>نصيحة:</strong> إذا كنت تريد استخدام هذا القفطان لاحقاً، يُفضل إخفاؤه بدلاً من حذفه.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          direction: 'rtl',
        }}>
          {/* Hide Button (Recommended) */}
          <button
            onClick={() => {
              onConfirmHide();
              onClose();
            }}
            style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(249, 115, 22, 0.15))',
              border: '2px solid rgba(251, 146, 60, 0.5)',
              borderRadius: '12px',
              color: '#fb923c',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251, 146, 60, 0.3), rgba(249, 115, 22, 0.2))';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(251, 146, 60, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(251, 146, 60, 0.2), rgba(249, 115, 22, 0.15))';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <span style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: 'rgba(34, 197, 94, 0.9)',
              color: 'white',
              padding: '0.25rem 0.5rem',
              borderRadius: '6px',
              fontSize: '0.7rem',
              fontWeight: '700',
            }}>
              مُوصى به
            </span>
            <EyeOff size={20} />
            <span>إخفاء القفطان (يمكن إظهاره لاحقاً)</span>
          </button>

          {/* Delete Button (Dangerous) */}
          <button
            onClick={() => {
              onConfirmDelete();
              onClose();
            }}
            style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.15))',
              border: '2px solid rgba(239, 68, 68, 0.5)',
              borderRadius: '12px',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(220, 38, 38, 0.2))';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.15))';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Trash2 size={20} />
            <span>حذف نهائي (لا يمكن التراجع)</span>
          </button>

          {/* Cancel Button */}
          <button
            onClick={onClose}
            style={{
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(232, 199, 111, 0.3)',
              borderRadius: '12px',
              color: 'var(--color-cream)',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }}
          >
            إلغاء
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
