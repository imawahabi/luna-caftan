'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/admin/dashboard');
    }
  }, [status, router]);

  if (status === 'authenticated') {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1410 100%)',
        }}
      >
        <p style={{ color: 'var(--color-gold)', fontSize: '1.25rem' }}>
          جاري إعادة التوجيه إلى لوحة التحكم...
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/admin/dashboard');
      }
    } catch (err) {
      setError('حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#020105',
        position: 'relative',
        padding: '1.5rem',
        overflow: 'hidden',
      }}
    >
      {/* background image + subtle glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/images/admin-bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.35) contrast(1.05)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(circle at 10% 0%, rgba(232,199,111,0.18), transparent 55%), radial-gradient(circle at 90% 100%, rgba(212,175,55,0.12), transparent 55%)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '420px',
        }}
      >
        <div
          style={{
            width: '100%',
            borderRadius: '20px',
            padding: '2rem',
            background:
              'linear-gradient(135deg, rgba(10,10,10,0.80), rgba(15,15,15,0.85))',
            border: '1px solid rgba(232, 199, 111, 0.35)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.9)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            direction: 'rtl',
          }}
        >
          {/* Logo + title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: '1.75rem',
              gap: '0.75rem',
            }}
          >
            <div
              style={{
                width: '76px',
                height: '76px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src="/logo-white.png"
                alt="Luna Caftan"
                style={{
                  width: '72px',
                  height: '72px',
                  objectFit: 'contain',
                }}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h1
                style={{
                  fontSize: '1.55rem',
                  margin: 0,
                  color: 'var(--color-gold)',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                لوحة تحكم لونا
              </h1>
              <p
                style={{
                  marginTop: '0.35rem',
                  fontSize: '0.9rem',
                  color: 'rgba(209, 213, 219, 0.7)',
                }}
              >
                سجّل دخولك لإدارة القفاطين والمحتوى
              </p>
              <div
                style={{
                  marginTop: '1rem',
                  height: '1px',
                  width: '72px',
                  marginInline: 'auto',
                  background:
                    'linear-gradient(90deg, transparent, rgba(232,199,111,0.9), transparent)',
                }}
              />
            </div>
          </div>

          {error && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.35)',
                color: '#fecaca',
                fontSize: '0.9rem',
                textAlign: 'right',
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  marginBottom: '0.4rem',
                  color: 'var(--color-cream)',
                  fontSize: '0.95rem',
                }}
              >
                البريد الإلكتروني
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(55,65,81,0.9)',
                  background: 'rgba(15,15,15,0.9)',
                  color: 'var(--color-cream)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="password"
                style={{
                  display: 'block',
                  marginBottom: '0.4rem',
                  color: 'var(--color-cream)',
                  fontSize: '0.95rem',
                }}
              >
                كلمة المرور
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  borderRadius: '10px',
                  border: '1px solid rgba(55,65,81,0.9)',
                  background: 'rgba(15,15,15,0.9)',
                  color: 'var(--color-cream)',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem 2rem',
                borderRadius: '16px',
                border: 'none',
                background:
                  'linear-gradient(135deg, #e8c76f 0%, #d4af37 50%, #c9a961 100%)',
                color: '#44240e',
                fontSize: '1.05rem',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.8 : 1,
                transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out, background 0.2s ease-out',
                boxShadow:
                  '0 8px 24px rgba(232, 199, 111, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)';
                e.currentTarget.style.boxShadow =
                  '0 12px 32px rgba(232, 199, 111, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.5), inset 0 -1px 0 rgba(0, 0, 0, 0.15)';
                e.currentTarget.style.background =
                  'linear-gradient(135deg, #f0d080 0%, #ddb847 50%, #d4af37 100%)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow =
                  '0 8px 24px rgba(232, 199, 111, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.4), inset 0 -1px 0 rgba(0, 0, 0, 0.1)';
                e.currentTarget.style.background =
                  'linear-gradient(135deg, #e8c76f 0%, #d4af37 50%, #c9a961 100%)';
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(0.99)';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px) scale(1.01)';
              }}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          <p
            style={{
              marginTop: '1.25rem',
              fontSize: '0.8rem',
              color: 'rgba(148,163,184,0.8)',
              textAlign: 'center',
            }}
          >
            مخصصة للاستخدام الإداري فقط
          </p>
        </div>
      </div>
    </div>
  );
}
