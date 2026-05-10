'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const glass = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('zed_admin_token');
    if (!token) { router.push('/admin'); return; }
    fetchStats(token);
  }, []);

  const fetchStats = async (token) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('zed_admin_token');
    localStorage.removeItem('zed_admin');
    router.push('/admin');
  };

  if (loading) return (
    <main style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ color: '#00d4ff', fontSize: '13px' }}>Loading dashboard...</div>
    </main>
  );

  const statCards = [
    { label: 'TOTAL PELAJAR', value: stats?.students?.total || 0, sub: `${stats?.students?.active || 0} aktif`, color: '#00d4ff' },
    { label: 'PENDING AKTIVASI', value: stats?.students?.pending || 0, sub: 'Menunggu pembayaran', color: '#f59e0b' },
    { label: 'FIRST ADOPTERS', value: stats?.students?.firstAdopters || 0, sub: `${stats?.students?.slotsRemaining || 0} slot tinggal`, color: '#7c3aed' },
    { label: 'TOTAL HASIL', value: `RM${(stats?.revenue?.total || 0).toFixed(0)}`, sub: 'Pembayaran berjaya', color: '#10b981' },
    { label: 'RUJUKAN AKTIF', value: stats?.referrals?.active || 0, sub: `${stats?.referrals?.total || 0} jumlah`, color: '#ff2d78' },
    { label: 'RAG CONTENT', value: stats?.ragContent?.subjectContent || 0, sub: `${stats?.ragContent?.pastYearQuestions || 0} soalan lalu`, color: '#a78bfa' }
  ];

  return (
    <main style={{ background: '#050508', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(5,5,8,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: '18px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>ZED Admin</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { label: 'Dashboard', path: '/admin/dashboard', active: true },
            { label: 'Pelajar', path: '/admin/students' },
            { label: 'RAG', path: '/admin/content' },
            { label: 'Perbualan', path: '/admin/conversations' }
          ].map((item, i) => (
            <button key={i} onClick={() => router.push(item.path)} style={{ background: item.active ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${item.active ? 'rgba(0,212,255,0.2)' : 'rgba(255,255,255,0.08)'}`, color: item.active ? '#00d4ff' : '#71717a', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: item.active ? 800 : 400, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              {item.label}
            </button>
          ))}
          <button onClick={logout} style={{ background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.15)', color: '#ff2d78', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px 16px' }}>

        <h1 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '2px', letterSpacing: '-0.5px' }}>Platform Overview</h1>
        <p style={{ fontSize: '11px', color: '#71717a', marginBottom: '20px' }}>Zed — Malaysia's First AI Educational BFF</p>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '20px' }}>
          {statCards.map((card, i) => (
            <div key={i} style={{ ...glass, border: `1px solid ${card.color}15`, borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '9px', color: '#71717a', marginBottom: '6px', fontWeight: 800, letterSpacing: '0.5px' }}>{card.label}</div>
              <div style={{ fontSize: '26px', fontWeight: 900, color: card.color, marginBottom: '2px', letterSpacing: '-1px' }}>{card.value}</div>
              <div style={{ fontSize: '10px', color: '#52525b' }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* First adopter progress */}
        <div style={{ ...glass, border: '1px solid rgba(0,212,255,0.12)', borderRadius: '14px', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '-0.3px' }}>🎯 First Adopter Progress</div>
            <div style={{ fontSize: '12px', color: '#00d4ff', fontWeight: 800 }}>{stats?.students?.firstAdopters || 0} / 10,000</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '6px', height: '6px' }}>
            <div style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', height: '6px', borderRadius: '6px', width: `${Math.min(((stats?.students?.firstAdopters || 0) / 10000) * 100, 100)}%`, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ fontSize: '11px', color: '#71717a', marginTop: '8px' }}>
            {stats?.students?.slotsRemaining || 10000} slot harga pengasas masih tersedia
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          {[
            { label: '👥 Urus Pelajar', desc: 'Lihat, aktifkan, gantung akaun', path: '/admin/students', color: '#00d4ff' },
            { label: '📚 Tambah Kandungan', desc: 'Seed RAG syllabus & soalan lalu', path: '/admin/content', color: '#7c3aed' },
            { label: '💬 Perbualan Pelajar', desc: 'Semak semua sesi chat dengan Zed', path: '/admin/conversations', color: '#10b981' }
          ].map((item, i) => (
            <div key={i} onClick={() => router.push(item.path)}
              style={{ ...glass, border: `1px solid ${item.color}12`, borderRadius: '12px', padding: '16px', cursor: 'pointer', transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = `${item.color}35`}
              onMouseLeave={e => e.currentTarget.style.borderColor = `${item.color}12`}
            >
              <div style={{ fontSize: '13px', fontWeight: 800, marginBottom: '4px', letterSpacing: '-0.3px' }}>{item.label}</div>
              <div style={{ fontSize: '11px', color: '#71717a' }}>{item.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}