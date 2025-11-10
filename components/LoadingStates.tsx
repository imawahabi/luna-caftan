'use client';

import { motion } from 'framer-motion';

// Skeleton for statistics numbers
export function StatsSkeleton() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '2rem',
      marginBottom: '3rem',
    }}>
      {[1, 2, 3].map((item) => (
        <div key={item} style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.05), rgba(212, 175, 55, 0.02))',
          borderRadius: '16px',
          border: '1px solid rgba(232, 199, 111, 0.1)',
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #e8c76f, #d4af37)',
            borderRadius: '50%',
            animation: 'pulse 2s infinite',
          }} />
          <div style={{
            width: '80px',
            height: '32px',
            margin: '0 auto 0.5rem',
            background: 'linear-gradient(90deg, rgba(232, 199, 111, 0.2), rgba(232, 199, 111, 0.1), rgba(232, 199, 111, 0.2))',
            borderRadius: '8px',
            animation: 'shimmer 1.5s infinite',
          }} />
          <div style={{
            width: '120px',
            height: '20px',
            margin: '0 auto',
            background: 'linear-gradient(90deg, rgba(232, 199, 111, 0.15), rgba(232, 199, 111, 0.08), rgba(232, 199, 111, 0.15))',
            borderRadius: '6px',
            animation: 'shimmer 1.5s infinite',
          }} />
        </div>
      ))}
    </div>
  );
}

// Skeleton for search bar
export function SearchSkeleton() {
  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto 3rem',
    }}>
      <div style={{
        position: 'relative',
        height: '60px',
        background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.05), rgba(212, 175, 55, 0.02))',
        borderRadius: '50px',
        border: '1px solid rgba(232, 199, 111, 0.1)',
        animation: 'pulse 2s infinite',
      }}>
        <div style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '24px',
          height: '24px',
          background: 'rgba(232, 199, 111, 0.2)',
          borderRadius: '50%',
        }} />
      </div>
    </div>
  );
}

// Skeleton for filter buttons
export function FilterSkeleton() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginBottom: '3rem',
      flexWrap: 'wrap',
    }}>
      {[1, 2, 3].map((item) => (
        <div key={item} style={{
          width: '120px',
          height: '44px',
          background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.05), rgba(212, 175, 55, 0.02))',
          borderRadius: '50px',
          border: '1px solid rgba(232, 199, 111, 0.1)',
          animation: 'pulse 2s infinite',
        }} />
      ))}
    </div>
  );
}

// Skeleton for product price in details page
export function PriceSkeleton() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '2rem',
    }}>
      <div style={{
        width: '100px',
        height: '36px',
        background: 'linear-gradient(90deg, rgba(232, 199, 111, 0.2), rgba(232, 199, 111, 0.1), rgba(232, 199, 111, 0.2))',
        borderRadius: '8px',
        animation: 'shimmer 1.5s infinite',
      }} />
      <div style={{
        width: '80px',
        height: '24px',
        background: 'linear-gradient(90deg, rgba(232, 199, 111, 0.15), rgba(232, 199, 111, 0.08), rgba(232, 199, 111, 0.15))',
        borderRadius: '6px',
        animation: 'shimmer 1.5s infinite',
      }} />
    </div>
  );
}

// Skeleton for product title in details page
export function TitleSkeleton() {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{
        width: '300px',
        height: '40px',
        background: 'linear-gradient(90deg, rgba(232, 199, 111, 0.2), rgba(232, 199, 111, 0.1), rgba(232, 199, 111, 0.2))',
        borderRadius: '8px',
        marginBottom: '1rem',
        animation: 'shimmer 1.5s infinite',
      }} />
      <div style={{
        width: '200px',
        height: '24px',
        background: 'linear-gradient(90deg, rgba(232, 199, 111, 0.15), rgba(232, 199, 111, 0.08), rgba(232, 199, 111, 0.15))',
        borderRadius: '6px',
        animation: 'shimmer 1.5s infinite',
      }} />
    </div>
  );
}

// Skeleton for product description
export function DescriptionSkeleton() {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        width: '100%',
        height: '20px',
        background: 'linear-gradient(90deg, rgba(232, 199, 111, 0.15), rgba(232, 199, 111, 0.08), rgba(232, 199, 111, 0.15))',
        borderRadius: '6px',
        marginBottom: '0.75rem',
        animation: 'shimmer 1.5s infinite',
      }} />
      <div style={{
        width: '100%',
        height: '20px',
        background: 'linear-gradient(90deg, rgba(232, 199, 111, 0.15), rgba(232, 199, 111, 0.08), rgba(232, 199, 111, 0.15))',
        borderRadius: '6px',
        marginBottom: '0.75rem',
        animation: 'shimmer 1.5s infinite',
      }} />
      <div style={{
        width: '80%',
        height: '20px',
        background: 'linear-gradient(90deg, rgba(232, 199, 111, 0.15), rgba(232, 199, 111, 0.08), rgba(232, 199, 111, 0.15))',
        borderRadius: '6px',
        animation: 'shimmer 1.5s infinite',
      }} />
    </div>
  );
}

// Skeleton for product details list
export function DetailsListSkeleton() {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        width: '120px',
        height: '28px',
        background: 'linear-gradient(90deg, rgba(232, 199, 111, 0.2), rgba(232, 199, 111, 0.1), rgba(232, 199, 111, 0.2))',
        borderRadius: '8px',
        marginBottom: '1rem',
        animation: 'shimmer 1.5s infinite',
      }} />
      {[1, 2, 3].map((item) => (
        <div key={item} style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          marginBottom: '0.75rem',
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            background: 'rgba(232, 199, 111, 0.2)',
            borderRadius: '50%',
            flexShrink: 0,
            animation: 'pulse 2s infinite',
          }} />
          <div style={{
            flex: 1,
            height: '20px',
            background: 'linear-gradient(90deg, rgba(232, 199, 111, 0.15), rgba(232, 199, 111, 0.08), rgba(232, 199, 111, 0.15))',
            borderRadius: '6px',
            animation: 'shimmer 1.5s infinite',
          }} />
        </div>
      ))}
    </div>
  );
}

// Skeleton for likes count
export function LikesSkeleton() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: 'linear-gradient(135deg, rgba(232, 199, 111, 0.05), rgba(212, 175, 55, 0.02))',
      borderRadius: '50px',
      border: '1px solid rgba(232, 199, 111, 0.1)',
      width: 'fit-content',
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        background: 'rgba(232, 199, 111, 0.2)',
        borderRadius: '50%',
        animation: 'pulse 2s infinite',
      }} />
      <div style={{
        width: '40px',
        height: '20px',
        background: 'linear-gradient(90deg, rgba(232, 199, 111, 0.15), rgba(232, 199, 111, 0.08), rgba(232, 199, 111, 0.15))',
        borderRadius: '6px',
        animation: 'shimmer 1.5s infinite',
      }} />
    </div>
  );
}

// Add CSS animations
if (typeof window !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shimmer {
      0% {
        background-position: -200px 0;
      }
      100% {
        background-position: calc(200px + 100%) 0;
      }
    }
    
    @keyframes pulse {
      0%, 100% {
        opacity: 0.6;
      }
      50% {
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}
