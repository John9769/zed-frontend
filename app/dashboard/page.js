'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('zed_student');
    const token = localStorage.getItem('zed_token');
    if (!stored || !token) {
      router.push('/login');
      return;
    }
    setStudent(JSON.parse(stored));
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('zed_token');
    localStorage.removeItem('zed_student');
    router.push('/login');
  };

  const subjects = {
    BM: { label: 'Bahasa Melayu', icon: '📖', color: '#00d4ff', desc: 'Komsas, Karangan, Tatabahasa' },
    ENGLISH: { label: 'English', icon: '🌍', color: '#7c3aed', desc: 'Literature, Essay, Grammar' },
    MATH: { label: 'Mathematics', icon: '📐', color: '#ff2d78', desc: 'Algebra, Calculus, Statistics' },
    SCIENCE: { label: 'Science', icon: '🔬', color: '#10b981', desc: 'Biology, Chemistry, Physics' },
    SEJARAH: { label: 'Sejarah', icon: '🏛️', color: '#f59e0b', desc: 'Kesultanan, Kemerdekaan, Perlembagaan' }
  };

  if (loading) {
    return (
      <main style={{ background: '#070714', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#00d4ff', fontSize: '16px' }}>Loading...</div>
      </main>
    );
  }

  return (
    <main style={{ background: '#070714', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* Background */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }} />

      {/* Navbar */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        padding: '16px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(7,7,20,0.95)',
        borderBottom: '1px solid rgba(0,212,255,0.1)',
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ fontSize: '22px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ZED
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/assets/Zed.png" alt="Zed" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(0,212,255,0.3)' }} />
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>Hi, <strong style={{ color: '#fff' }}>{student?.name}</strong></span>
          </div>
          <button
            onClick={() => router.push('/dashboard/credits')}
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff', padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            💰 Zed Fund
          </button>
          <button
            onClick={logout}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '6px 14px', borderRadius: '50px', fontSize: '12px', cursor: 'pointer' }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 32px', position: 'relative', zIndex: 1 }}>

        {/* Welcome */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <img src="/assets/Zed.png" alt="Zed" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,212,255,0.4)', boxShadow: '0 0 20px rgba(0,212,255,0.2)' }} />
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '4px' }}>
                Hai {student?.name}! 👋
              </h1>
              <p style={{ fontSize: '14px', color: '#94a3b8' }}>
                Zed dah ready. Nak belajar subjek apa hari ni?
              </p>
            </div>
          </div>

          {/* First adopter badge */}
          {student?.isFirstAdopter && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '50px', padding: '6px 16px' }}>
              <span style={{ fontSize: '12px' }}>⭐</span>
              <span style={{ fontSize: '12px', color: '#00d4ff', fontWeight: 700 }}>First Adopter — Harga Terkunci</span>
            </div>
          )}
        </div>

        {/* Subject Grid */}
        <div style={{ marginBottom: '48px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '24px', color: '#94a3b8', letterSpacing: '1px', textTransform: 'uppercase', fontSize: '12px' }}>
            Subjek Anda
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {student?.subjects?.map((subjectKey) => {
              const sub = subjects[subjectKey];
              if (!sub) return null;
              return (
                <div
                  key={subjectKey}
                  onClick={() => router.push(`/dashboard/chat/${subjectKey}`)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${sub.color}20`,
                    borderRadius: '20px',
                    padding: '28px 24px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.border = `1px solid ${sub.color}60`;
                    e.currentTarget.style.background = `${sub.color}08`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.border = `1px solid ${sub.color}20`;
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ fontSize: '36px', marginBottom: '16px' }}>{sub.icon}</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, marginBottom: '8px', color: '#fff' }}>{sub.label}</h3>
                  <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '20px' }}>{sub.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sub.color, boxShadow: `0 0 8px ${sub.color}` }} />
                    <span style={{ fontSize: '12px', color: sub.color, fontWeight: 600 }}>Zed Ready</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {[
            { icon: '💰', label: 'Zed Fund', value: 'Semak Wallet', action: () => router.push('/dashboard/credits'), color: '#00d4ff' },
            { icon: '📊', label: 'Progress', value: 'Lihat Laporan', action: () => router.push('/dashboard/progress'), color: '#7c3aed' },
            { icon: '🔗', label: 'Referral Code', value: student?.referralCode || '—', action: null, color: '#ff2d78' }
          ].map((item, i) => (
            <div
              key={i}
              onClick={item.action}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${item.color}20`,
                borderRadius: '16px',
                padding: '20px',
                cursor: item.action ? 'pointer' : 'default',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Referral Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(124,58,237,0.08))',
          border: '1px solid rgba(0,212,255,0.15)',
          borderRadius: '20px',
          padding: '28px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px',
          flexWrap: 'wrap'
        }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '8px' }}>🔗 Share Referral Code Anda</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>Setiap kawan yang join — anda dapat RM5 atau RM10 setiap bulan!</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '12px', padding: '10px 20px', fontSize: '18px', fontWeight: 900, color: '#00d4ff', letterSpacing: '2px' }}>
              {student?.referralCode}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(student?.referralCode);
                alert('Kod disalin!');
              }}
              style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}
            >
              Copy
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}