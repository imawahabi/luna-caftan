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
        background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1410 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '2rem',
          background: 'rgba(26, 20, 16, 0.8)',
          border: '2px solid rgba(232, 199, 111, 0.3)',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
        }}
      >
        <img
          src="/logo-white.png"
          alt="Luna Caftan"
          style={{
            height: '80px',
            margin: '0 auto 2rem',
            display: 'block',
          }}
        />

        <h1
          style={{
            fontSize: '2rem',
            color: 'var(--color-gold)',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          لوحة التحكم
        </h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
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
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(232, 199, 111, 0.3)',
                borderRadius: '8px',
                color: 'var(--color-cream)',
                fontSize: '1rem',
              }}
            />
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
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
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'rgba(0, 0, 0, 0.5)',
                border: '1px solid rgba(232, 199, 111, 0.3)',
                borderRadius: '8px',
                color: 'var(--color-cream)',
                fontSize: '1rem',
              }}
            />
          </div>

          {error && (
            <div
              style={{
                padding: '0.75rem',
                marginBottom: '1rem',
                background: 'rgba(255, 0, 0, 0.1)',
                border: '1px solid rgba(255, 0, 0, 0.3)',
                borderRadius: '8px',
                color: '#ff6b6b',
                textAlign: 'center',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '1rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </form>
      </div>
    </div>
  );
}
