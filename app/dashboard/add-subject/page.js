'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SUBJECTS = [
  { value: 'MATH', label: 'Matematik', icon: '📐', color: '#ff2d78' },
  { value: 'ADD_MATH', label: 'Add Matematik', icon: '🧮', color: '#00d4ff' },
  { value: 'SCIENCE', label: 'Sains', icon: '🔬', color: '#10b981' },
  { value: 'BIOLOGY', label: 'Biologi', icon: '🧬', color: '#84cc16' },
  { value: 'PHYSICS', label: 'Fizik', icon: '⚡', color: '#f59e0b' },
  { value: 'CHEMISTRY', label: 'Kimia', icon: '⚗️', color: '#a78bfa' }
];

const glass = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
};

export default function AddSubject() {
  const router = useRouter();
  const [student, setStudent] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('zed_student');
    const token = localStorage.getItem('zed_token');
    if (!stored || !token) { router.push('/login'); return; }
    const s = JSON.parse(stored);
    if (s.status !== 'ACTIVE') { router.push('/dashboard'); return; }
    setStudent(s);
  }, []);

  const alreadySubscribed = student?.subjects || [];

  const handleAdd = async () => {
    if (!selected) return setError('Sila pilih subjek.');
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('zed_token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/add-subject`,
        { subject: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal tambah subjek. Sila cuba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <main style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: '360px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginBottom: '8px', letterSpacing: '-0.5px' }}>Permintaan Dihantar!</h2>
        <p style={{ color: '#a1a1aa', fontSize: '13px', lineHeight: 1.6, marginBottom: '24px' }}>
          WhatsApp telah dihantar kepada ibu/bapa anda untuk bayaran subjek baru. Subjek akan diaktifkan selepas bayaran berjaya.
        </p>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '12px 28px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: 'pointer' }}>
          Kembali ke Dashboard
        </button>
      </div>
    </main>
  );

  return (
    <main style={{ background: '#050508', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ ...glass, color: '#a1a1aa', padding: '7px 14px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.08)' }}>
            ← Balik
          </button>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.5px' }}>Tambah Subjek</h1>
            <p style={{ fontSize: '11px', color: '#71717a', fontWeight: 700 }}>RM19.99/bulan • Early Bird</p>
          </div>
        </div>

        {/* Price reminder */}
        <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.12)', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '11px', color: '#00d4ff', fontWeight: 800, letterSpacing: '0.5px' }}>🎯 HARGA EARLY BIRD</div>
            <div style={{ fontSize: '10px', color: '#71717a', marginTop: '2px' }}>Terhad untuk 10,000 pelajar pertama</div>
          </div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#00d4ff', letterSpacing: '-1px' }}>RM19.99</div>
        </div>

        {/* Subject grid */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '10px', color: '#71717a', fontWeight: 800, letterSpacing: '0.5px', marginBottom: '12px' }}>PILIH SUBJEK BARU</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {SUBJECTS.map(s => {
              const subscribed = alreadySubscribed.includes(s.value);
              const isSelected = selected === s.value;
              return (
                <div
                  key={s.value}
                  onClick={() => !subscribed && setSelected(s.value)}
                  style={{
                    border: `1px solid ${isSelected ? s.color : subscribed ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)'}`,
                    background: isSelected ? `${s.color}10` : subscribed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    padding: '14px 8px',
                    cursor: subscribed ? 'not-allowed' : 'pointer',
                    opacity: subscribed ? 0.35 : 1,
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: isSelected ? s.color : '#a1a1aa' }}>{s.label}</div>
                  {subscribed && <div style={{ fontSize: '9px', color: '#52525b', marginTop: '3px' }}>Sudah langgan</div>}
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.15)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px' }}>
            <p style={{ color: '#ff2d78', fontSize: '12px' }}>{error}</p>
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={loading || !selected}
          style={{ width: '100%', background: !selected || loading ? 'rgba(0,212,255,0.15)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '14px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: !selected || loading ? 'not-allowed' : 'pointer' }}>
          {loading ? 'Memproses...' : selected ? `Tambah ${SUBJECTS.find(s => s.value === selected)?.label} — RM19.99/bulan →` : 'Pilih subjek dahulu'}
        </button>

        <p style={{ fontSize: '11px', color: '#52525b', textAlign: 'center', marginTop: '12px' }}>
          WhatsApp akan dihantar ke ibu/bapa anda untuk kelulusan bayaran.
        </p>
      </div>
    </main>
  );
}