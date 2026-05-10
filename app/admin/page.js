'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const glass = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  padding: '10px 14px',
  color: '#fff',
  fontSize: '13px',
  outline: 'none',
  fontFamily: 'Inter, sans-serif'
};

const labelStyle = {
  fontSize: '10px',
  color: '#71717a',
  marginBottom: '6px',
  display: 'block',
  fontWeight: 800,
  letterSpacing: '0.5px'
};

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) return setError('Sila isi semua medan.');
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`, form);
      localStorage.setItem('zed_admin_token', res.data.token);
      localStorage.setItem('zed_admin', JSON.stringify(res.data.admin));
      router.push('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>

      <style jsx global>{`
        input::placeholder { color: #52525b; }
        input:focus { border-color: rgba(0,212,255,0.3) !important; }
      `}</style>

      <div style={{ width: '100%', maxWidth: '360px' }}>

        <div style={{ fontSize: '22px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '4px', letterSpacing: '-0.5px' }}>ZED</div>
        <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '20px', fontWeight: 700 }}>Admin Panel</div>

        <div style={{ ...glass, borderRadius: '16px', padding: '24px' }}>
          <h1 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '20px', color: '#fff', letterSpacing: '-0.5px' }}>Admin Login</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>EMAIL</label>
              <input name="email" value={form.email} onChange={handle} placeholder="admin@zed.my" style={inputStyle} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <div>
              <label style={labelStyle}>PASSWORD</label>
              <input name="password" value={form.password} onChange={handle} placeholder="Password" type="password" style={inputStyle} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.15)', borderRadius: '8px', padding: '10px 12px', marginTop: '14px' }}>
              <p style={{ color: '#ff2d78', fontSize: '12px' }}>{error}</p>
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} style={{ width: '100%', marginTop: '20px', background: loading ? 'rgba(0,212,255,0.2)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif' }}>
            {loading ? 'Loading...' : 'Login →'}
          </button>
        </div>
      </div>
    </main>
  );
}