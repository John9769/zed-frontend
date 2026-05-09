'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SUBJECTS = [
  { value: 'MATH', label: 'Matematik', icon: '📐', color: '#ff2d78' },
  { value: 'ADD_MATH', label: 'Add Matematik', icon: '🧮', color: '#00d4ff' },
  { value: 'SCIENCE', label: 'Sains', icon: '🔬', color: '#10b981' },
  { value: 'ADD_SCIENCE', label: 'Add Sains', icon: '🧪', color: '#06b6d4' },
  { value: 'BIOLOGY', label: 'Biologi', icon: '🧬', color: '#84cc16' },
  { value: 'PHYSICS', label: 'Fizik', icon: '⚡', color: '#f59e0b' },
  { value: 'CHEMISTRY', label: 'Kimia', icon: '⚗️', color: '#a78bfa' }
];

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
    <main style={{ background: '#070714', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px' }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>✅</div>
        <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', marginBottom: '12px' }}>Permintaan Dihantar!</h2>
        <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px' }}>
          WhatsApp telah dihantar kepada ibu/bapa anda untuk bayaran subjek baru. Subjek akan diaktifkan selepas bayaran berjaya.
        </p>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '14px 32px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
          Kembali ke Dashboard
        </button>
      </div>
    </main>
  );

  return (
    <main style={{ background: '#070714', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '32px 24px' }}>
      <div style={{ maxWidth: '520px', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
            ← Balik
          </button>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 900 }}>Tambah Subjek</h1>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>RM19.99/bulan • Early Bird</p>
          </div>
        </div>

        <div style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '16px', padding: '16px 20px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '13px', color: '#00d4ff', fontWeight: 700 }}>🎯 Harga Early Bird</div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>Terhad untuk 10,000 pelajar pertama</div>
          </div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: '#00d4ff' }}>RM19.99</div>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '16px' }}>Pilih subjek baru</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {SUBJECTS.map(s => {
              const subscribed = alreadySubscribed.includes(s.value);
              const isSelected = selected === s.value;
              return (
                <div
                  key={s.value}
                  onClick={() => !subscribed && setSelected(s.value)}
                  style={{
                    border: `1px solid ${isSelected ? s.color : subscribed ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.1)'}`,
                    background: isSelected ? `${s.color}12` : subscribed ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.03)',
                    borderRadius: '14px',
                    padding: '16px',
                    cursor: subscribed ? 'not-allowed' : 'pointer',
                    opacity: subscribed ? 0.4 : 1,
                    textAlign: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>{s.icon}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: isSelected ? s.color : '#fff' }}>{s.label}</div>
                  {subscribed && <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>Sudah langgan</div>}
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
            <p style={{ color: '#ff2d78', fontSize: '13px' }}>{error}</p>
          </div>
        )}

        <button
          onClick={handleAdd}
          disabled={loading || !selected}
          style={{ width: '100%', background: !selected || loading ? 'rgba(0,212,255,0.2)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '16px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: !selected || loading ? 'not-allowed' : 'pointer', boxShadow: selected ? '0 0 20px rgba(0,212,255,0.3)' : 'none' }}>
          {loading ? 'Memproses...' : selected ? `Tambah ${SUBJECTS.find(s => s.value === selected)?.label} — RM19.99/bulan →` : 'Pilih subjek dahulu'}
        </button>

        <p style={{ fontSize: '12px', color: '#475569', textAlign: 'center', marginTop: '16px' }}>
          WhatsApp akan dihantar ke ibu/bapa anda untuk kelulusan bayaran.
        </p>
      </div>
    </main>
  );
}