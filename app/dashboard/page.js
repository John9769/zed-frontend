'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SUBJECT_MAP = {
  MATH: { label: 'Matematik', icon: '📐', color: '#ff2d78', desc: 'Algebra, Geometry, Statistics' },
  ADD_MATH: { label: 'Add Matematik', icon: '🧮', color: '#00d4ff', desc: 'Calculus, Progressions, Linear Law' },
  SCIENCE: { label: 'Sains', icon: '🔬', color: '#10b981', desc: 'Physics, Chemistry, Biology Basics' },
  BIOLOGY: { label: 'Biologi', icon: '🧬', color: '#84cc16', desc: 'Cell Biology, Genetics, Ecology' },
  PHYSICS: { label: 'Fizik', icon: '⚡', color: '#f59e0b', desc: 'Mechanics, Waves, Electricity' },
  CHEMISTRY: { label: 'Kimia', icon: '⚗️', color: '#a78bfa', desc: 'Organic, Inorganic, Electrochemistry' }
};

const glass = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
};

export default function Dashboard() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('zed_student');
    const token = localStorage.getItem('zed_token');
    if (!stored || !token) { router.push('/login'); return; }
    setStudent(JSON.parse(stored));
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('zed_token');
    localStorage.removeItem('zed_student');
    router.push('/login');
  };

  const isTrial = student?.status === 'TRIAL';

  if (loading) return (
    <main style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#00d4ff', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>Loading...</div>
    </main>
  );

  return (
    <main style={{ background: '#050508', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      <style jsx global>{`
        .subj-card:hover { transform: translateY(-3px); }
        .subj-card { transition: all 0.2s ease; }
      `}</style>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(5,5,8,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
        <div style={{ fontSize: '20px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ZED</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/assets/Zed.png" alt="Zed" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(0,212,255,0.3)' }} />
          <span style={{ fontSize: '12px', color: '#71717a' }}>Hi, <strong style={{ color: '#fff' }}>{student?.name}</strong></span>
          <button onClick={() => router.push('/dashboard/credits')} style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.15)', color: '#00d4ff', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
            💰 Zed Fund
          </button>
          <button onClick={logout} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#71717a', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 20px' }}>

        {/* Welcome */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <img src="/assets/Zed.png" alt="Zed" style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,212,255,0.3)' }} />
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '2px', letterSpacing: '-0.5px' }}>Hai {student?.name}! 👋</h1>
            <p style={{ fontSize: '12px', color: '#71717a' }}>
              {isTrial ? `${5 - (student?.trialMessages || 0)} mesej percuma tinggal — jom cuba!` : 'Zed dah ready. Nak belajar subjek apa hari ni?'}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {student?.isFirstAdopter && (
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '100px', padding: '4px 12px' }}>
              <span style={{ fontSize: '10px', color: '#00d4ff', fontWeight: 800 }}>⭐ FIRST ADOPTER — EARLY BIRD TERKUNCI</span>
            </div>
          )}
          {isTrial && (
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '100px', padding: '4px 12px' }}>
              <span style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 800 }}>🎯 TRIAL — {5 - (student?.trialMessages || 0)} MESEJ BERBAKI</span>
            </div>
          )}
        </div>

        {/* Trial Banner */}
        {isTrial && (
          <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '14px', padding: '16px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#f59e0b', marginBottom: '2px' }}>Cuba semua subjek percuma!</div>
              <div style={{ fontSize: '11px', color: '#71717a' }}>Selepas 5 mesej, pilih 1 subjek pada RM19.99/bulan sahaja.</div>
            </div>
            <button onClick={() => router.push('/register')} style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Langgan Sekarang →
            </button>
          </div>
        )}

        {/* Subjects */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#71717a', letterSpacing: '1px' }}>
              {isTrial ? 'CUBA SEMUA SUBJEK' : 'SUBJEK ANDA'}
            </div>
            {!isTrial && (
              <button onClick={() => router.push('/dashboard/add-subject')} style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', color: '#00d4ff', padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                + Tambah Subjek
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
            {student?.subjects?.map((subjectKey) => {
              const sub = SUBJECT_MAP[subjectKey];
              if (!sub) return null;
              return (
                <div
                  key={subjectKey}
                  className="subj-card"
                  onClick={() => router.push(`/dashboard/chat/${subjectKey}`)}
                  style={{ ...glass, border: `1px solid ${sub.color}20`, borderRadius: '14px', padding: '18px 16px', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{sub.icon}</div>
                  <h3 style={{ fontSize: '14px', fontWeight: 800, marginBottom: '4px', color: '#fff', letterSpacing: '-0.3px' }}>{sub.label}</h3>
                  <p style={{ fontSize: '10px', color: '#71717a', marginBottom: '12px', lineHeight: 1.4 }}>{sub.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: sub.color, boxShadow: `0 0 6px ${sub.color}` }} />
                    <span style={{ fontSize: '10px', color: sub.color, fontWeight: 700 }}>{isTrial ? 'Cuba Percuma' : 'Zed Ready'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
          {[
            { icon: '💰', label: 'Zed Fund', value: 'Semak Wallet', action: () => router.push('/dashboard/credits'), color: '#00d4ff' },
            { icon: '📊', label: 'Progress', value: 'Lihat Laporan', action: () => router.push('/dashboard/progress'), color: '#7c3aed' },
            { icon: '🔗', label: 'Referral', value: student?.referralCode || '—', action: null, color: '#ff2d78' }
          ].map((item, i) => (
            <div key={i} onClick={item.action} style={{ ...glass, border: `1px solid ${item.color}15`, borderRadius: '12px', padding: '14px 12px', cursor: item.action ? 'pointer' : 'default' }}>
              <div style={{ fontSize: '20px', marginBottom: '6px' }}>{item.icon}</div>
              <div style={{ fontSize: '10px', color: '#71717a', marginBottom: '2px', fontWeight: 700 }}>{item.label}</div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: item.color }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Referral Banner */}
        <div style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '14px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: '13px', fontWeight: 800, marginBottom: '4px', letterSpacing: '-0.3px' }}>🔗 Share Referral Code Anda</h3>
            <p style={{ fontSize: '11px', color: '#71717a' }}>Setiap kawan yang join — dapat <strong style={{ color: '#00d4ff' }}>RM5 per subjek</strong> setiap bulan!</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '8px', padding: '8px 16px', fontSize: '15px', fontWeight: 900, color: '#00d4ff', letterSpacing: '2px' }}>
              {student?.referralCode}
            </div>
            <button onClick={() => { navigator.clipboard.writeText(student?.referralCode); alert('Kod disalin!'); }} style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '8px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
              Copy
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}