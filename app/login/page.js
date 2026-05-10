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

  const glass = {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px',
    padding: '12px 14px',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'Inter, sans-serif'
  };

  const labelStyle = {
    fontSize: '11px',
    color: '#71717a',
    marginBottom: '6px',
    display: 'block',
    fontWeight: 800,
    letterSpacing: '0.5px'
  };

  return (
    <main style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>

      <style jsx global>{`
        input::placeholder { color: #52525b; }
        input:focus { border-color: rgba(0,212,255,0.4) !important; }
      `}</style>

      <div style={{ width: '100%', maxWidth: '400px' }}>
        <button onClick={() => router.push('/')} style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: '12px', cursor: 'pointer', marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>← Kembali</button>

        {/* Logo */}
        <div onClick={() => router.push('/')} style={{ fontSize: '22px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '20px', cursor: 'pointer', display: 'inline-block' }}>
          ZED
        </div>

        {/* Card */}
        <div style={{ ...glass, borderRadius: '20px', padding: '28px 24px' }}>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <img src="/assets/Zed.png" alt="Zed" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,212,255,0.3)' }} />
            <div>
              <div style={{ fontSize: '17px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>Selamat Kembali!</div>
              <div style={{ fontSize: '12px', color: '#71717a' }}>Zed dah tunggu anda. Jom belajar! 🧠</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={labelStyle}>NOMBOR MOBILE</label>
              <input name="mobile" value={form.mobile} onChange={handle} placeholder="0123456789" style={inputStyle} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
            </div>
            <div>
              <label style={labelStyle}>PASSWORD</label>
              <input name="password" value={form.password} onChange={handle} placeholder="Password anda" type="password" style={inputStyle} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.2)', borderRadius: '10px', padding: '10px 14px', marginTop: '16px' }}>
              <p style={{ color: '#ff2d78', fontSize: '12px' }}>{error}</p>
            </div>
          )}

          {error?.includes('pending') && (
            <div style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '10px', padding: '10px 14px', marginTop: '8px' }}>
              <p style={{ color: '#00d4ff', fontSize: '12px' }}>💡 Akaun anda masih menunggu kelulusan ibu/bapa. Sila semak WhatsApp ibu/bapa anda.</p>
            </div>
          )}

          {error?.includes('expired') && (
            <div style={{ background: 'rgba(255,159,0,0.06)', border: '1px solid rgba(255,159,0,0.15)', borderRadius: '10px', padding: '10px 14px', marginTop: '8px' }}>
              <p style={{ color: '#f59e0b', fontSize: '12px' }}>💡 Langganan anda telah tamat. Sila hubungi ibu/bapa untuk memperbaharui.</p>
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} style={{ width: '100%', marginTop: '20px', background: loading ? 'rgba(0,212,255,0.2)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Logging in...' : 'Login →'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#71717a' }}>
            Belum ada akaun?{' '}
            <span onClick={() => router.push('/register')} style={{ color: '#00d4ff', cursor: 'pointer', fontWeight: 700 }}>Daftar sekarang</span>
          </p>

        </div>
      </div>
    </main>
  );
}