'use client';
import { useRouter } from 'next/navigation';

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <main style={{ background: '#070714', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: '480px' }}>
        <div style={{ fontSize: '72px', marginBottom: '24px' }}>🎉</div>
        <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>
          Pembayaran Berjaya!
        </h1>
        <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '32px' }}>
          Akaun anak anda telah diaktifkan. Zed sudah bersedia untuk menjadi BFF belajar mereka. 🧠
        </p>
        <div style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '16px', padding: '20px', marginBottom: '32px' }}>
          <p style={{ color: '#00d4ff', fontSize: '14px', lineHeight: 1.7 }}>
            Sila minta anak anda login di <strong>zed.my</strong> menggunakan nombor mobile dan password yang didaftarkan.
          </p>
        </div>
        <img src="/assets/Zed.png" alt="Zed" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(0,212,255,0.4)', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }} />
        <p style={{ fontSize: '14px', color: '#94a3b8', marginTop: '16px' }}>
          "Hai! Saya Zed. Jom kita buat SPM sama-sama!" 🚀
        </p>
      </div>
    </main>
  );
}