'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const glass = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
};

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

  if (loading) return (
    <main style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#00d4ff', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>Loading wallet...</div>
    </main>
  );

  return (
    <main style={{ background: '#050508', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* Nav */}
      <nav style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(5,5,8,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => router.push('/dashboard')} style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '18px' }}>←</button>
        <div style={{ fontSize: '16px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>Zed Fund & Credits</div>
      </nav>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: '20px 16px' }}>

        {error && <div style={{ color: '#ff2d78', marginBottom: '12px', fontSize: '12px' }}>{error}</div>}

        {/* Wallet Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
          <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#71717a', marginBottom: '6px', fontWeight: 800, letterSpacing: '0.5px' }}>KREDIT SEMASA</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#00d4ff', letterSpacing: '-1px' }}>RM{data?.wallet?.balance?.toFixed(2) || '0.00'}</div>
            <div style={{ fontSize: '10px', color: data?.wallet?.escrowLocked ? '#ff2d78' : '#10b981', marginTop: '6px', fontWeight: 700 }}>
              {data?.wallet?.escrowLocked ? '🔒 Dalam Escrow' : '✅ Boleh Digunakan'}
            </div>
          </div>
          <div style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: '14px', padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#71717a', marginBottom: '6px', fontWeight: 800, letterSpacing: '0.5px' }}>ZED FUND</div>
            <div style={{ fontSize: '28px', fontWeight: 900, color: '#7c3aed', letterSpacing: '-1px' }}>RM{data?.wallet?.fundBalance?.toFixed(2) || '0.00'}</div>
            <div style={{ fontSize: '10px', color: '#71717a', marginTop: '6px', fontWeight: 700 }}>💰 Tabung Masa Depan</div>
          </div>
        </div>

        {/* Monthly earning */}
        <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.12)', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#71717a', marginBottom: '4px', fontWeight: 800, letterSpacing: '0.5px' }}>PENDAPATAN BULANAN</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#10b981', letterSpacing: '-1px' }}>RM{data?.referrals?.monthlyEarning?.toFixed(2) || '0.00'}<span style={{ fontSize: '12px', color: '#71717a', fontWeight: 600 }}>/bulan</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#fff' }}>{data?.referrals?.activeCount || 0}</div>
              <div style={{ fontSize: '10px', color: '#71717a', fontWeight: 700 }}>RUJUKAN AKTIF</div>
            </div>
          </div>
        </div>

        {/* Referral code */}
        <div style={{ ...glass, borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', fontWeight: 800, marginBottom: '12px', letterSpacing: '0.5px' }}>🔗 KOD RUJUKAN ANDA</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ flex: 1, background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '10px', padding: '12px', textAlign: 'center', fontSize: '18px', fontWeight: 900, color: '#00d4ff', letterSpacing: '3px' }}>
              {JSON.parse(localStorage.getItem('zed_student') || '{}')?.referralCode || '—'}
            </div>
            <button onClick={copyCode} style={{ background: copying ? '#10b981' : 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '12px 16px', borderRadius: '10px', fontWeight: 800, cursor: 'pointer', fontSize: '12px', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}>
              {copying ? '✓ Disalin!' : 'Copy'}
            </button>
          </div>
          <p style={{ fontSize: '11px', color: '#71717a', lineHeight: 1.5 }}>
            Share kod ini dengan kawan anda. Setiap kawan yang mendaftar dan membayar — anda dapat <strong style={{ color: '#00d4ff' }}>RM5 setiap bulan</strong> secara berulang!
          </p>
        </div>

        {/* Active referrals */}
        {data?.referrals?.friends?.length > 0 && (
          <div style={{ ...glass, borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, marginBottom: '12px', letterSpacing: '0.5px' }}>👥 RUJUKAN AKTIF</div>
            {data.referrals.friends.map((ref, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < data.referrals.friends.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ fontSize: '12px', color: '#a1a1aa' }}>👤 {ref.friendName}</div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#10b981' }}>+RM{ref.totalMonthly?.toFixed(2)}/bulan</div>
              </div>
            ))}
          </div>
        )}

        {/* Recent transactions */}
        {data?.recentTransactions?.length > 0 && (
          <div style={{ ...glass, borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, marginBottom: '12px', letterSpacing: '0.5px' }}>📋 TRANSAKSI TERKINI</div>
            {data.recentTransactions.map((tx, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < data.recentTransactions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#fff' }}>{tx.type.replace(/_/g, ' ')}</div>
                  <div style={{ fontSize: '10px', color: '#71717a' }}>{new Date(tx.createdAt).toLocaleDateString('en-MY')}</div>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#10b981' }}>+RM{tx.amount.toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}

        {/* Escrow info */}
        {data?.wallet?.escrowLocked && (
          <div style={{ background: 'rgba(255,45,120,0.04)', border: '1px solid rgba(255,45,120,0.12)', borderRadius: '14px', padding: '16px' }}>
            <div style={{ fontSize: '12px', color: '#a1a1aa', lineHeight: 1.6 }}>
              🔒 <strong style={{ color: '#fff' }}>Kenapa kredit saya dikunci?</strong><br />
              Kredit anda selamat dalam escrow. Zed akan melepaskan dana apabila anda telah aktif dan memenuhi syarat minimum. Terus refer kawan dan belajar! 💪
            </div>
          </div>
        )}

      </div>
    </main>
  );
}