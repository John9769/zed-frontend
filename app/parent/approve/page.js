'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

const SUBJECT_LABELS = {
  MATH: { label: 'Matematik', icon: '📐' },
  ADD_MATH: { label: 'Add Matematik', icon: '🧮' },
  SCIENCE: { label: 'Sains', icon: '🔬' },
  BIOLOGY: { label: 'Biologi', icon: '🧬' },
  PHYSICS: { label: 'Fizik', icon: '⚡' },
  CHEMISTRY: { label: 'Kimia', icon: '⚗️' }
};

function ParentApprovePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const subject = searchParams.get('subject') || 'MATH';
  const price = searchParams.get('price') || '19.99';
  const priceType = searchParams.get('priceType') || 'EARLY_BIRD';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subjectInfo = SUBJECT_LABELS[subject] || { label: subject, icon: '📚' };
  const isEarlyBird = priceType === 'EARLY_BIRD';

  const handlePay = async () => {
    if (!token) return setError('Link tidak sah. Sila minta anak anda mendaftar semula.');
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-bill`, {
        token, subject, priceType
      });
      window.location.href = res.data.paymentUrl;
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal membuat bil. Sila cuba lagi.');
      setLoading(false);
    }
  };

  const glass = {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  return (
    <main style={{ background: '#050508', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '20px' }}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
      `}</style>

      <div style={{ maxWidth: '480px', margin: '0 auto' }}>

        {/* Logo */}
        <div style={{ fontSize: '22px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '20px', textAlign: 'center' }}>
          ZED
        </div>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src="/assets/Zed.png" alt="Zed" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,212,255,0.3)', marginBottom: '12px', boxShadow: '0 0 20px rgba(0,212,255,0.15)' }} />
          <h1 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '6px', letterSpacing: '-0.5px' }}>Salam, Ibu/Bapa! 👋</h1>
          <p style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: 1.6 }}>
            Anak anda telah mendaftar untuk <strong style={{ color: '#00d4ff' }}>ZED</strong> — AI Study BFF pertama Malaysia untuk pelajar SPM.
          </p>
        </div>

        {/* What is Zed */}
        <div style={{ ...glass, borderRadius: '16px', padding: '20px', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 800, marginBottom: '14px', color: '#00d4ff', letterSpacing: '0.5px' }}>🧠 APA ITU ZED?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: '📚', text: 'Tutor AI peribadi untuk subjek SPM — mengajar mengikut silibus KSSM' },
              { icon: '🕐', text: 'Tersedia 24/7 — termasuk tengah malam sebelum peperiksaan' },
              { icon: '🧬', text: 'Mengingati topik lemah anak anda dan mengajar semula dengan cara berbeza' },
              { icon: '💬', text: 'Bercakap seperti kawan — sabar, tidak menghukum, sentiasa ada' },
              { icon: '📝', text: 'Menyemak jawapan seperti pemeriksa SPM yang sebenar' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                <span style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: 1.5 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price comparison */}
        <div style={{ ...glass, borderRadius: '16px', padding: '20px', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 800, marginBottom: '14px', color: '#00d4ff', letterSpacing: '0.5px' }}>💰 PERBANDINGAN HARGA</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.15)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '6px', fontWeight: 700 }}>PUSAT TUISYEN</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#ff2d78' }}>RM100+</div>
              <div style={{ fontSize: '10px', color: '#71717a' }}>1 subjek / bulan</div>
            </div>
            <div style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '6px', fontWeight: 700 }}>ZED</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#00d4ff' }}>RM19.99</div>
              <div style={{ fontSize: '10px', color: '#71717a' }}>1 subjek / bulan</div>
            </div>
          </div>
        </div>

        {/* Zed Fund */}
        <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: '16px', padding: '20px', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 800, marginBottom: '10px', color: '#a78bfa', letterSpacing: '0.5px' }}>🎓 ZED FUND — TIADA TANDINGAN</h3>
          <p style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: 1.6 }}>
            Setiap kali anak anda merujuk rakan untuk menyertai Zed — mereka mendapat <strong style={{ color: '#a78bfa' }}>RM5 setiap bulan</strong> secara berulang bagi setiap subjek yang dirujuk. Wang ini disimpan dalam Zed Fund untuk kegunaan selepas SPM.
          </p>
        </div>

        {/* CTA */}
        <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>

          {/* Subject */}
          <div style={{ ...glass, borderRadius: '12px', padding: '14px', marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '8px', fontWeight: 700, letterSpacing: '0.5px' }}>SUBJEK DIPILIH</div>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>{subjectInfo.icon}</div>
            <div style={{ fontSize: '16px', fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{subjectInfo.label}</div>
          </div>

          {/* Price */}
          <div style={{ marginBottom: '6px' }}>
            <span style={{ fontSize: '40px', fontWeight: 900, color: '#00d4ff', letterSpacing: '-2px' }}>RM{price}</span>
            <span style={{ fontSize: '13px', color: '#71717a' }}>/bulan</span>
          </div>

          {isEarlyBird && (
            <div style={{ display: 'inline-flex', alignItems: 'center', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '100px', padding: '4px 12px', marginBottom: '16px' }}>
              <span style={{ fontSize: '10px', color: '#00d4ff', fontWeight: 800 }}>🎯 EARLY BIRD — Harga asal RM29.99</span>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '14px' }}>
              <p style={{ color: '#ff2d78', fontSize: '12px' }}>{error}</p>
            </div>
          )}

          <button onClick={handlePay} disabled={loading} style={{ width: '100%', background: loading ? 'rgba(0,212,255,0.2)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '14px', borderRadius: '10px', fontSize: '14px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Memproses...' : `Aktifkan ${subjectInfo.label} — RM${price}/bulan →`}
          </button>

          <p style={{ fontSize: '11px', color: '#71717a', marginTop: '12px', lineHeight: 1.5 }}>
            🔒 Pembayaran selamat melalui Billplz. Akaun anak anda akan diaktifkan serta-merta selepas pembayaran berjaya.
          </p>
        </div>

      </div>
    </main>
  );
}

export default function ParentApprovePageWrapper() {
  return (
    <Suspense fallback={<div style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d4ff', fontFamily: 'Inter, sans-serif' }}>Loading...</div>}>
      <ParentApprovePage />
    </Suspense>
  );
}