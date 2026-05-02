'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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

  return (
    <main style={{ background: '#070714', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        <div style={{ fontSize: '28px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>ZED</div>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '32px' }}>Admin Panel</div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px 32px' }}>
          <h1 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '32px', color: '#fff' }}>Admin Login</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Email</label>
              <input name="email" value={form.email} onChange={handle} placeholder="admin@zed.my" style={inputStyle} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px', display: 'block', fontWeight: 600 }}>Password</label>
              <input name="password" value={form.password} onChange={handle} placeholder="Password" type="password" style={inputStyle} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)', borderRadius: '12px', padding: '12px', marginTop: '20px' }}>
              <p style={{ color: '#ff2d78', fontSize: '13px' }}>{error}</p>
            </div>
          )}

          <button onClick={handleLogin} disabled={loading} style={{ width: '100%', marginTop: '32px', background: loading ? 'rgba(0,212,255,0.3)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Loading...' : 'Login →'}
          </button>
        </div>
      </div>
    </main>
  );
}