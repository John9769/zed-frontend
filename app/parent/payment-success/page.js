'use client';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const SUBJECT_LABELS = {
  MATH: { label: 'Matematik', icon: '📐' },
  ADD_MATH: { label: 'Add Matematik', icon: '🧮' },
  SCIENCE: { label: 'Sains', icon: '🔬' },
  BIOLOGY: { label: 'Biologi', icon: '🧬' },
  PHYSICS: { label: 'Fizik', icon: '⚡' },
  CHEMISTRY: { label: 'Kimia', icon: '⚗️' }
};

function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject');
  const subjectInfo = subject ? SUBJECT_LABELS[subject] : null;

  const glass = {
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255,255,255,0.08)',
  };

  return (
    <main style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', width: '100%' }}>

        <div style={{ fontSize: '56px', marginBottom: '12px' }}>🎉</div>

        <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', marginBottom: '8px', letterSpacing: '-1px' }}>
          Pembayaran Berjaya!
        </h1>
        <p style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '20px' }}>
          Akaun anak anda telah diaktifkan. Zed sudah bersedia untuk menjadi BFF belajar mereka. 🧠
        </p>

        {subjectInfo && (
          <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
            <div style={{ fontSize: '28px', marginBottom: '6px' }}>{subjectInfo.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#a78bfa', letterSpacing: '-0.5px' }}>{subjectInfo.label} — Diaktifkan!</div>
          </div>
        )}

        <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '14px', padding: '16px', marginBottom: '12px' }}>
          <p style={{ color: '#00d4ff', fontSize: '12px', lineHeight: 1.6 }}>
            Sila minta anak anda login di <strong>zed-frontend-pi.vercel.app</strong> menggunakan nombor mobile dan password yang didaftarkan.
          </p>
        </div>

        <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '14px', padding: '16px', marginBottom: '24px' }}>
          <p style={{ color: '#10b981', fontSize: '12px', lineHeight: 1.6 }}>
            💡 Anak anda boleh tambah subjek lain pada bila-bila masa dari dashboard mereka.
          </p>
        </div>

        <img src="/assets/Zed.png" alt="Zed" style={{ width: '72px', height: '72px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(0,212,255,0.3)', boxShadow: '0 0 20px rgba(0,212,255,0.15)', marginBottom: '10px' }} />
        <p style={{ fontSize: '12px', color: '#71717a' }}>
          "Hai! Saya Zed. Jom kita buat SPM sama-sama!" 🚀
        </p>

      </div>
    </main>
  );
}

export default function PaymentSuccessWrapper() {
  return (
    <Suspense fallback={<div style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d4ff', fontFamily: 'Inter, sans-serif' }}>Loading...</div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}