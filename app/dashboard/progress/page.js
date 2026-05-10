'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const subjectColors = {
  MATH: '#ff2d78', ADD_MATH: '#00d4ff', SCIENCE: '#10b981',
  BIOLOGY: '#84cc16', PHYSICS: '#f59e0b', CHEMISTRY: '#a78bfa'
};

const subjectLabels = {
  MATH: 'Mathematics', ADD_MATH: 'Additional Mathematics',
  SCIENCE: 'Science', BIOLOGY: 'Biology',
  PHYSICS: 'Physics', CHEMISTRY: 'Chemistry'
};

const glass = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
};

export default function ProgressPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('zed_token');
    const stored = localStorage.getItem('zed_student');
    if (!token) { router.push('/login'); return; }
    if (stored) setStudent(JSON.parse(stored));
    fetchProgress(token);
  }, []);

  const fetchProgress = async (token) => {
    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/zed/sessions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ background: '#050508', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      <nav style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(5,5,8,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '18px' }}>←</button>
        <div style={{ fontSize: '16px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>Progress Saya</div>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px 16px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <img src="/assets/Zed.png" alt="Zed" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(0,212,255,0.3)' }} />
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 900, marginBottom: '2px', letterSpacing: '-0.5px' }}>Laporan Pembelajaran</h2>
            <p style={{ fontSize: '11px', color: '#71717a' }}>North Star: Setiap 30 hari dengan Zed — markah mesti naik. 🎯</p>
          </div>
        </div>

        {student?.subjects?.map((subjectKey) => {
          const color = subjectColors[subjectKey] || '#00d4ff';
          return (
            <div key={subjectKey} style={{ ...glass, border: `1px solid ${color}15`, borderRadius: '14px', padding: '16px', marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '13px', fontWeight: 800, color, letterSpacing: '-0.3px' }}>{subjectLabels[subjectKey] || subjectKey}</h3>
                <button onClick={() => router.push(`/dashboard/chat/${subjectKey}`)} style={{ background: `${color}10`, border: `1px solid ${color}25`, color, padding: '5px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                  Belajar →
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div style={{ background: 'rgba(255,45,120,0.04)', border: '1px solid rgba(255,45,120,0.08)', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '9px', color: '#71717a', marginBottom: '6px', fontWeight: 800, letterSpacing: '0.5px' }}>TOPIK LEMAH</div>
                  <div style={{ fontSize: '11px', color: '#ff2d78' }}>Belum dikenal pasti — teruskan belajar!</div>
                </div>
                <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.08)', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '9px', color: '#71717a', marginBottom: '6px', fontWeight: 800, letterSpacing: '0.5px' }}>TOPIK KUKUH</div>
                  <div style={{ fontSize: '11px', color: '#10b981' }}>Belum dikenal pasti — teruskan belajar!</div>
                </div>
              </div>
            </div>
          );
        })}

        <div style={{ background: 'rgba(0,212,255,0.04)', border: '1px solid rgba(0,212,255,0.1)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
          <img src="/assets/Zed.png" alt="Zed" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(0,212,255,0.3)', marginBottom: '10px' }} />
          <p style={{ fontSize: '12px', color: '#71717a', lineHeight: 1.6, marginBottom: '14px' }}>
            "Progress anda akan muncul di sini selepas anda mula belajar dengan Zed. Jom mulakan sesi pertama anda sekarang!" 🚀
          </p>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
            Mula Belajar →
          </button>
        </div>

      </div>
    </main>
  );
}