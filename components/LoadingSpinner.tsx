'use client';

import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ message, fullScreen = false }: LoadingSpinnerProps) {
  const { i18n } = useTranslation();
  const fallbackMessage = i18n.language === 'ar' ? 'جاري التحميل...' : 'Loading...';

  const containerStyle = fullScreen
    ? {
        position: 'fixed' as const,
        inset: 0,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
      }
    : {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem',
      };

  return (
    <div style={containerStyle}>
      {/* Animated Logo */}
      <motion.div
        style={{
          position: 'relative',
          width: '80px',
          height: '80px',
          marginBottom: '1.5rem',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {/* Outer Ring */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            border: '3px solid transparent',
            borderTopColor: '#E8C76F',
            borderRightColor: '#D4AF37',
            borderRadius: '50%',
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        
        {/* Inner Ring */}
        <motion.div
          style={{
            position: 'absolute',
            inset: '10px',
            border: '2px solid transparent',
            borderBottomColor: '#E8D4A0',
            borderLeftColor: '#E8C76F',
            borderRadius: '50%',
          }}
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Center Dot */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '12px',
            height: '12px',
            background: 'linear-gradient(135deg, #E8C76F, #D4AF37)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 20px rgba(232, 199, 111, 0.6)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Loading Text */}
      <motion.p
        style={{
          color: '#E8C76F',
          fontSize: '1rem',
          fontWeight: '500',
          textAlign: 'center',
          letterSpacing: '0.05em',
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {message || fallbackMessage}
      </motion.p>

      {/* Animated Dots */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginTop: '1rem',
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              width: '8px',
              height: '8px',
              background: 'linear-gradient(135deg, #E8C76F, #D4AF37)',
              borderRadius: '50%',
            }}
            animate={{
              y: [-5, 5, -5],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
