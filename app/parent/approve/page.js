'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function ParentApprovePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const tier = searchParams.get('tier') || 'THREE_SUBJECTS';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentName, setStudentName] = useState('');
  const [paymentUrl, setPaymentUrl] = useState('');
  const [step, setStep] = useState('info'); // info → paying → done

  const tierLabel = tier === 'FIVE_SUBJECTS' ? '5 Subjek' : '3 Subjek Teras';
  const tierPrice = tier === 'FIVE_SUBJECTS' ? 'RM99.00' : 'RM79.99';

  const handlePay = async () => {
    if (!token) return setError('Link tidak sah. Sila minta anak anda mendaftar semula.');
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-bill`, { token, tier });
      setStudentName(res.data.studentName);
      setPaymentUrl(res.data.paymentUrl);
      setStep('paying');
      window.location.href = res.data.paymentUrl;
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal membuat bil. Sila cuba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '16px'
  };

  return (
    <main style={{ background: '#070714', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif', padding: '32px 24px' }}>

      {/* Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at top, #0d0d2b 0%, #070714 60%)', zIndex: 0 }} />

      <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative', zIndex: 1 }}>

        {/* Logo */}
        <div style={{ fontSize: '28px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '32px', textAlign: 'center' }}>
          ZED
        </div>

        {/* Zed intro */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img
            src="/assets/Zed.png"
            alt="Zed"
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(0,212,255,0.4)', marginBottom: '16px', boxShadow: '0 0 30px rgba(0,212,255,0.2)' }}
          />
          <h1 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '8px' }}>
            Salam, Ibu/Bapa! 👋
          </h1>
          <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: 1.7 }}>
            Anak anda telah mendaftar untuk <strong style={{ color: '#00d4ff' }}>ZED</strong> — AI Study BFF pertama Malaysia untuk pelajar SPM.
          </p>
        </div>

        {/* What is Zed */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', color: '#00d4ff' }}>🧠 Apa itu ZED?</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: '📚', text: 'Tutor AI peribadi untuk subjek SPM — BM, English, Matematik, Sains & Sejarah' },
              { icon: '🕐', text: 'Tersedia 24/7 — termasuk tengah malam sebelum peperiksaan' },
              { icon: '🧬', text: 'Mengingati topik lemah anak anda dan mengajar semula dengan cara berbeza' },
              { icon: '💬', text: 'Bercakap seperti kawan — sabar, tidak menghukum, sentiada ada' },
              { icon: '📝', text: 'Menyemak jawapan anak anda seperti pemeriksa SPM yang sebenar' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '18px' }}>{item.icon}</span>
                <span style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price comparison */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '16px', color: '#00d4ff' }}>💰 Perbandingan Harga</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.2)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>Pusat Tuisyen</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#ff2d78' }}>{tier === 'FIVE_SUBJECTS' ? 'RM500+' : 'RM450'}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{tier === 'FIVE_SUBJECTS' ? '5 subjek / bulan' : '3 subjek / bulan'}</div>
            </div>
            <div style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>ZED</div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#00d4ff' }}>{tierPrice}</div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>{tierLabel} / bulan</div>
            </div>
          </div>
        </div>

        {/* Zed Fund */}
        <div style={{ ...cardStyle, background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '12px', color: '#7c3aed' }}>🎓 Zed Fund — Tiada Tandingan</h3>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7 }}>
            Setiap kali anak anda merujuk rakan untuk menyertai Zed — mereka mendapat <strong style={{ color: '#7c3aed' }}>RM{tier === 'FIVE_SUBJECTS' ? '10' : '5'} setiap bulan</strong> secara berulang. Wang ini disimpan dalam Zed Fund untuk kegunaan selepas SPM — yuran kolej, laptop, atau lesen memandu.
          </p>
        </div>

        {/* Payment box */}
        <div style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '20px', padding: '28px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Plan dipilih oleh anak anda</div>
          <div style={{ fontSize: '32px', fontWeight: 900, color: '#fff', marginBottom: '4px' }}>{tierPrice}</div>
          <div style={{ fontSize: '14px', color: '#00d4ff', marginBottom: '24px', fontWeight: 600 }}>{tierLabel} • Harga Pengasas</div>

          {error && (
            <div style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)', borderRadius: '12px', padding: '12px', marginBottom: '16px' }}>
              <p style={{ color: '#ff2d78', fontSize: '13px' }}>{error}</p>
            </div>
          )}

          <button
            onClick={handlePay}
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'rgba(0,212,255,0.3)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              border: 'none', color: '#fff',
              padding: '16px', borderRadius: '12px',
              fontSize: '16px', fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 20px rgba(0,212,255,0.3)'
            }}
          >
            {loading ? 'Memproses...' : `Aktifkan Akaun Anak Saya — ${tierPrice} →`}
          </button>

          <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px', lineHeight: 1.6 }}>
            🔒 Pembayaran selamat melalui Billplz. Akaun anak anda akan diaktifkan serta-merta selepas pembayaran berjaya.
          </p>
        </div>

      </div>
    </main>
  );
}