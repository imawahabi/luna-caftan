import { motion } from 'framer-motion';

const shimmerStyle = {
  animation: 'shimmer 2.5s ease-in-out infinite',
} as const;

export default function ProductCardSkeleton() {
  return (
    <motion.div
      className="product-card"
      style={{
        background: 'rgba(26, 20, 16, 0.6)',
        border: '1px solid rgba(232, 199, 111, 0.2)',
        borderRadius: '28px',
        overflow: 'hidden',
        position: 'relative',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Image Skeleton */}
      <div
        style={{
          width: '100%',
          height: '400px',
          background: 'linear-gradient(90deg, rgba(26, 20, 16, 0.9) 0%, rgba(232, 199, 111, 0.15) 50%, rgba(26, 20, 16, 0.9) 100%)',
          backgroundSize: '200% 100%',
          position: 'relative',
          borderRadius: '24px 24px 0 0',
          ...shimmerStyle,
        }}
      >
        {/* Decorative Circle */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80px',
            height: '80px',
            border: '2px solid rgba(232, 199, 111, 0.15)',
            borderRadius: '50%',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50px',
              height: '50px',
              border: '1px solid rgba(232, 199, 111, 0.1)',
              borderRadius: '50%',
            }}
          />
        </div>
      </div>

      {/* Content Skeleton */}
      <div style={{ padding: '1.5rem' }}>
        {/* Title Skeleton */}
        <div
          style={{
            width: '75%',
            height: '26px',
            background: 'linear-gradient(90deg, rgba(26, 20, 16, 0.9) 0%, rgba(232, 199, 111, 0.15) 50%, rgba(26, 20, 16, 0.9) 100%)',
            backgroundSize: '200% 100%',
            borderRadius: '4px',
            marginBottom: '0.75rem',
            ...shimmerStyle,
          }}
        />

        {/* Subtitle Skeleton */}
        <div
          style={{
            width: '55%',
            height: '20px',
            background: 'linear-gradient(90deg, rgba(26, 20, 16, 0.9) 0%, rgba(232, 199, 111, 0.12) 50%, rgba(26, 20, 16, 0.9) 100%)',
            backgroundSize: '200% 100%',
            borderRadius: '4px',
            marginBottom: '1.25rem',
            ...shimmerStyle,
          }}
        />

        {/* Price Skeleton */}
        <div
          style={{
            width: '45%',
            height: '22px',
            background: 'linear-gradient(90deg, rgba(232, 199, 111, 0.25) 0%, rgba(232, 199, 111, 0.12) 50%, rgba(232, 199, 111, 0.25) 100%)',
            backgroundSize: '200% 100%',
            borderRadius: '4px',
            marginBottom: '1.5rem',
            ...shimmerStyle,
          }}
        />

        {/* Button Skeleton */}
        <div
          style={{
            width: '100%',
            height: '50px',
            background: 'linear-gradient(90deg, rgba(26, 20, 16, 0.9) 0%, rgba(232, 199, 111, 0.15) 50%, rgba(26, 20, 16, 0.9) 100%)',
            backgroundSize: '200% 100%',
            borderRadius: '8px',
            border: '1px solid rgba(232, 199, 111, 0.2)',
            ...shimmerStyle,
          }}
        />
      </div>
    </motion.div>
  );
}
