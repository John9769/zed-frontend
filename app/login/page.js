'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ mobile: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async () => {
    if (!form.mobile || !form.password) {
      return setError('Sila masukkan nombor mobile dan password.');
    }
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, form);
      localStorage.setItem('zed_token', res.data.token);
      localStorage.setItem('zed_student', JSON.stringify(res.data.student));
      router.push('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal. Sila cuba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '14px 16px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none'
  };

  const labelStyle = {
    fontSize: '13px',
    color: '#94a3b8',
    marginBottom: '8px',
    display: 'block',
    fontWeight: 600
  };

  return (
    <main style={{ background: '#070714', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, sans-serif' }}>

      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '500px', height: '400px', background: 'rgba(124,58,237,0.06)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div
          onClick={() => router.push('/')}
          style={{ fontSize: '28px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '32px', cursor: 'pointer', display: 'inline-block' }}
        >
          ZED
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          padding: '40px 32px',
          backdropFilter: 'blur(12px)'
        }}>

          {/* Zed avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <img
              src="/assets/Zed.png"
              alt="Zed"
              style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,212,255,0.3)' }}
            />
            <div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>Selamat Kembali!</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>Zed dah tunggu anda. Jom belajar! 🧠</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div>
              <label style={labelStyle}>Nombor Mobile</label>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handle}
                placeholder="0123456789"
                style={inputStyle}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                name="password"
                value={form.password}
                onChange={handle}
                placeholder="Password anda"
                type="password"
                style={inputStyle}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>

          </div>

          {/* Error */}
          {error && (
            <div style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)', borderRadius: '12px', padding: '12px 16px', marginTop: '20px' }}>
              <p style={{ color: '#ff2d78', fontSize: '13px' }}>{error}</p>
            </div>
          )}

          {/* Status messages */}
          {error?.includes('pending') && (
            <div style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '12px', padding: '12px 16px', marginTop: '12px' }}>
              <p style={{ color: '#00d4ff', fontSize: '13px' }}>
                💡 Akaun anda masih menunggu kelulusan ibu/bapa. Sila semak WhatsApp ibu/bapa anda.
              </p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%', marginTop: '32px',
              background: loading ? 'rgba(0,212,255,0.3)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              border: 'none', color: '#fff', padding: '14px',
              borderRadius: '12px', fontSize: '15px',
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 20px rgba(0,212,255,0.3)'
            }}
          >
            {loading ? 'Logging in...' : 'Login →'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#94a3b8' }}>
            Belum ada akaun?{' '}
            <span onClick={() => router.push('/register')} style={{ color: '#00d4ff', cursor: 'pointer', fontWeight: 600 }}>
              Daftar sekarang
            </span>
          </p>

        </div>
      </div>
    </main>
  );
}