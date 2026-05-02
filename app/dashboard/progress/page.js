'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function ProgressPage() {
  const router = useRouter();
  const [progress, setProgress] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  const subjectColors = {
    BM: '#00d4ff', ENGLISH: '#7c3aed',
    MATH: '#ff2d78', SCIENCE: '#10b981', SEJARAH: '#f59e0b'
  };

  const subjectLabels = {
    BM: 'Bahasa Melayu', ENGLISH: 'English',
    MATH: 'Mathematics', SCIENCE: 'Science', SEJARAH: 'Sejarah'
  };

  useEffect(() => {
    const token = localStorage.getItem('zed_token');
    if (!token) { router.push('/login'); return; }
    fetchProgress(token);
  }, []);

  const fetchProgress = async (token) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/zed/sessions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const student = JSON.parse(localStorage.getItem('zed_student') || '{}');

  return (
    <main style={{ background: '#070714', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      <nav style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(7,7,20,0.95)', borderBottom: '1px solid rgba(0,212,255,0.1)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <div style={{ fontSize: '18px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Progress Saya</div>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <img src="/assets/Zed.png" alt="Zed" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,212,255,0.3)' }} />
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '4px' }}>Laporan Pembelajaran</h2>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>North Star: Setiap 30 hari dengan Zed — markah mesti naik. 🎯</p>
          </div>
        </div>

        {/* Subject progress cards */}
        {student?.subjects?.map((subjectKey) => {
          const color = subjectColors[subjectKey] || '#00d4ff';
          return (
            <div key={subjectKey} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${color}20`, borderRadius: '20px', padding: '24px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color }}>{subjectLabels[subjectKey]}</h3>
                <button
                  onClick={() => router.push(`/dashboard/chat/${subjectKey}`)}
                  style={{ background: `${color}15`, border: `1px solid ${color}30`, color, padding: '6px 14px', borderRadius: '50px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Belajar →
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ background: 'rgba(255,45,120,0.05)', border: '1px solid rgba(255,45,120,0.1)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>TOPIK LEMAH</div>
                  <div style={{ fontSize: '13px', color: '#ff2d78' }}>
                    Belum dikenal pasti — teruskan belajar dengan Zed!
                  </div>
                </div>
                <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.1)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>TOPIK KUKUH</div>
                  <div style={{ fontSize: '13px', color: '#10b981' }}>
                    Belum dikenal pasti — teruskan belajar dengan Zed!
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Motivation */}
        <div style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.06), rgba(124,58,237,0.06))', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
          <img src="/assets/Zed.png" alt="Zed" style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,212,255,0.3)', marginBottom: '12px' }} />
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7 }}>
            "Progress anda akan muncul di sini selepas anda mula belajar dengan Zed. Jom mulakan sesi pertama anda sekarang!" 🚀
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            style={{ marginTop: '16px', background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '12px 28px', borderRadius: '50px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
          >
            Mula Belajar →
          </button>
        </div>

      </div>
    </main>
  );
}