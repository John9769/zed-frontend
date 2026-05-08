'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

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
    <main style={{ background: '#070714', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#00d4ff' }}>Loading dashboard...</div>
    </main>
  );

  const statCards = [
    { label: 'Total Pelajar', value: stats?.students?.total || 0, sub: `${stats?.students?.active || 0} aktif`, color: '#00d4ff' },
    { label: 'Pending Aktivasi', value: stats?.students?.pending || 0, sub: 'Menunggu pembayaran', color: '#f59e0b' },
    { label: 'First Adopters', value: stats?.students?.firstAdopters || 0, sub: `${stats?.students?.slotsRemaining || 0} slot tinggal`, color: '#7c3aed' },
    { label: 'Total Hasil', value: `RM${(stats?.revenue?.total || 0).toFixed(0)}`, sub: 'Pembayaran berjaya', color: '#10b981' },
    { label: 'Rujukan Aktif', value: stats?.referrals?.active || 0, sub: `${stats?.referrals?.total || 0} jumlah`, color: '#ff2d78' },
    { label: 'RAG Content', value: stats?.ragContent?.subjectContent || 0, sub: `${stats?.ragContent?.pastYearQuestions || 0} soalan lalu`, color: '#00d4ff' }
  ];

  return (
    <main style={{ background: '#070714', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{ padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(7,7,20,0.95)', borderBottom: '1px solid rgba(0,212,255,0.1)', backdropFilter: 'blur(12px)' }}>
        <div style={{ fontSize: '20px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ZED Admin</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {[
            { label: 'Dashboard', path: '/admin/dashboard' },
            { label: 'Pelajar', path: '/admin/students' },
            { label: 'Kandungan RAG', path: '/admin/content' },
            { label: 'Perbualan', path: '/admin/conversations' }
          ].map((item, i) => (
            <button key={i} onClick={() => router.push(item.path)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
              {item.label}
            </button>
          ))}
          <button onClick={logout} style={{ background: 'transparent', border: '1px solid rgba(255,45,120,0.3)', color: '#ff2d78', padding: '6px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 32px' }}>

        <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>Platform Overview</h1>
        <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '40px' }}>Zed — Malaysia's First AI Educational BFF</p>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
          {statCards.map((card, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${card.color}20`, borderRadius: '16px', padding: '24px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>{card.label}</div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: card.color, marginBottom: '4px' }}>{card.value}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>{card.sub}</div>
            </div>
          ))}
        </div>

        {/* First adopter progress */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '20px', padding: '28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 800 }}>🎯 First Adopter Progress</div>
            <div style={{ fontSize: '14px', color: '#00d4ff', fontWeight: 700 }}>{stats?.students?.firstAdopters || 0} / 10,000</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '8px', height: '8px' }}>
            <div style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', height: '8px', borderRadius: '8px', width: `${Math.min(((stats?.students?.firstAdopters || 0) / 10000) * 100, 100)}%`, transition: 'width 0.5s ease' }} />
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '8px' }}>
            {stats?.students?.slotsRemaining || 10000} slot harga pengasas masih tersedia
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { label: '👥 Urus Pelajar', desc: 'Lihat, aktifkan, gantung akaun', path: '/admin/students', color: '#00d4ff' },
            { label: '📚 Tambah Kandungan', desc: 'Seed RAG syllabus & soalan lalu', path: '/admin/content', color: '#7c3aed' },
            { label: '💬 Perbualan Pelajar', desc: 'Semak semua sesi chat dengan Zed', path: '/admin/conversations', color: '#10b981' }
          ].map((item, i) => (
            <div key={i} onClick={() => router.push(item.path)} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}20`, borderRadius: '16px', padding: '24px', cursor: 'pointer', transition: 'all 0.3s ease' }}
              onMouseEnter={e => e.currentTarget.style.border = `1px solid ${item.color}50`}
              onMouseLeave={e => e.currentTarget.style.border = `1px solid ${item.color}20`}
            >
              <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>{item.label}</div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>{item.desc}</div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}