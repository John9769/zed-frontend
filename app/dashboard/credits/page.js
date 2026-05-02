'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CreditsPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('zed_token');
    const student = localStorage.getItem('zed_student');
    if (!token || !student) { router.push('/login'); return; }
    fetchCredits(token);
  }, []);

  const fetchCredits = async (token) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/credit/my-credits`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(res.data);
    } catch (err) {
      setError('Gagal memuatkan wallet.');
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    const student = JSON.parse(localStorage.getItem('zed_student'));
    navigator.clipboard.writeText(student?.referralCode);
    setCopying(true);
    setTimeout(() => setCopying(false), 2000);
  };

  const cardStyle = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '24px',
    marginBottom: '16px'
  };

  if (loading) return (
    <main style={{ background: '#070714', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#00d4ff' }}>Loading wallet...</div>
    </main>
  );

  return (
    <main style={{ background: '#070714', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(7,7,20,0.95)', borderBottom: '1px solid rgba(0,212,255,0.1)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <div style={{ fontSize: '18px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Zed Fund & Credits</div>
      </nav>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>

        {error && <div style={{ color: '#ff2d78', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        {/* Wallet Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>KREDIT SEMASA</div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#00d4ff' }}>RM{data?.wallet?.balance?.toFixed(2) || '0.00'}</div>
            <div style={{ fontSize: '11px', color: data?.wallet?.escrowLocked ? '#ff2d78' : '#10b981', marginTop: '8px' }}>
              {data?.wallet?.escrowLocked ? '🔒 Dalam Escrow' : '✅ Boleh Digunakan'}
            </div>
          </div>
          <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: '20px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px', fontWeight: 600 }}>ZED FUND</div>
            <div style={{ fontSize: '36px', fontWeight: 900, color: '#7c3aed' }}>RM{data?.wallet?.fundBalance?.toFixed(2) || '0.00'}</div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>💰 Tabung Masa Depan</div>
          </div>
        </div>

        {/* Monthly earning */}
        <div style={{ ...cardStyle, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '4px' }}>Pendapatan Bulanan Dari Rujukan</div>
              <div style={{ fontSize: '28px', fontWeight: 900, color: '#10b981' }}>RM{data?.referrals?.monthlyEarning?.toFixed(2) || '0.00'}/bulan</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>{data?.referrals?.active || 0}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8' }}>Rujukan Aktif</div>
            </div>
          </div>
        </div>

        {/* Referral code */}
        <div style={cardStyle}>
          <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '16px' }}>🔗 Kod Rujukan Anda</div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ flex: 1, background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '12px', padding: '14px', textAlign: 'center', fontSize: '20px', fontWeight: 900, color: '#00d4ff', letterSpacing: '3px' }}>
              {JSON.parse(localStorage.getItem('zed_student') || '{}')?.referralCode || '—'}
            </div>
            <button onClick={copyCode} style={{ background: copying ? '#10b981' : 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '14px 20px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '13px', transition: 'all 0.3s ease' }}>
              {copying ? '✓ Disalin!' : 'Copy'}
            </button>
          </div>
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.6 }}>
            Share kod ini dengan kawan anda. Setiap kawan yang mendaftar dan membayar — anda dapat <strong style={{ color: '#00d4ff' }}>RM5 atau RM10 setiap bulan</strong> secara berulang!
          </p>
        </div>

        {/* Active referrals */}
        {data?.referrals?.details?.length > 0 && (
          <div style={cardStyle}>
            <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '16px' }}>👥 Rujukan Aktif</div>
            {data.referrals.details.map((ref, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < data.referrals.details.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ fontSize: '14px', color: '#fff' }}>👤 {ref.friendName}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#10b981' }}>+RM{ref.creditAmount}/bulan</div>
              </div>
            ))}
          </div>
        )}

        {/* Recent transactions */}
        {data?.recentTransactions?.length > 0 && (
          <div style={cardStyle}>
            <div style={{ fontSize: '14px', fontWeight: 800, marginBottom: '16px' }}>📋 Transaksi Terkini</div>
            {data.recentTransactions.map((tx, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < data.recentTransactions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div>
                  <div style={{ fontSize: '13px', color: '#fff' }}>{tx.type.replace(/_/g, ' ')}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(tx.createdAt).toLocaleDateString('en-MY')}</div>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#10b981' }}>+RM{tx.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Escrow info */}
        {data?.wallet?.escrowLocked && (
          <div style={{ background: 'rgba(255,45,120,0.05)', border: '1px solid rgba(255,45,120,0.15)', borderRadius: '16px', padding: '20px' }}>
            <div style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.7 }}>
              🔒 <strong style={{ color: '#fff' }}>Kenapa kredit saya dikunci?</strong><br />
              Kredit anda selamat dalam escrow. Zed akan melepaskan dana apabila anda telah aktif dan memenuhi syarat minimum. Terus refer kawan dan belajar! 💪
            </div>
          </div>
        )}

      </div>
    </main>
  );
}