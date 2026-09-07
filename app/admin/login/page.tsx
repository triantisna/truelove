'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email atau password salah');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '24px',
        background:
          'radial-gradient(circle at 15% 15%, rgba(220,169,181,.35), transparent 32%), linear-gradient(145deg, #fffaf7, #f4e8e8)',
      }}
    >
      <section
        className="admin-panel"
        style={{ width: 'min(100%, 440px)', padding: 'clamp(28px, 7vw, 52px)' }}
      >
        <p className="eyebrow">TRUELOVE ADMIN</p>
        <h1
          style={{
            margin: '8px 0 10px',
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(2.5rem, 10vw, 4.4rem)',
            lineHeight: 0.95,
            fontWeight: 500,
            letterSpacing: '-.05em',
          }}
        >
          Welcome back.
        </h1>
        <p style={{ margin: '0 0 28px', color: 'var(--muted)', lineHeight: 1.6 }}>
          Sign in to manage your romantic experiences.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 16 }}>
          <label style={{ display: 'grid', gap: 7, fontWeight: 750, fontSize: '.82rem' }}>
            Email
            <input
              type="email"
              value={email}
              autoComplete="email"
              required
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@example.com"
            />
          </label>

          <label style={{ display: 'grid', gap: 7, fontWeight: 750, fontSize: '.82rem' }}>
            Password
            <input
              type="password"
              value={password}
              autoComplete="current-password"
              required
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <p
              role="alert"
              style={{
                margin: 0,
                padding: '11px 13px',
                borderRadius: 12,
                background: '#fff0f1',
                color: '#9b263d',
                fontSize: '.88rem',
              }}
            >
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="button primary"
            disabled={loading}
            style={{ width: '100%', marginTop: 4 }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </section>
    </main>
  );
}