'use client';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const SUBJECTS = [
  { value: 'MATH', label: 'Matematik', icon: '📐' },
  { value: 'ADD_MATH', label: 'Add Matematik', icon: '🧮' },
  { value: 'SCIENCE', label: 'Sains', icon: '🔬' },
  { value: 'BIOLOGY', label: 'Biologi', icon: '🧬' },
  { value: 'PHYSICS', label: 'Fizik', icon: '⚡' },
  { value: 'CHEMISTRY', label: 'Kimia', icon: '⚗️' }
];

const EARLY_BIRD_PRICE = 19.99;
const NORMAL_PRICE = 29.99;

const glass = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
};

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '10px',
  padding: '12px 14px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'Inter, sans-serif'
};

const labelStyle = {
  fontSize: '12px',
  color: '#71717a',
  marginBottom: '6px',
  display: 'block',
  fontWeight: 700,
  letterSpacing: '0.5px'
};

function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultSubject = searchParams.get('subject') || 'MATH';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    studentName: '',
    studentEmail: '',
    studentMobile: '',
    studentAge: '',
    studentPassword: '',
    confirmPassword: '',
    parentName: '',
    parentWhatsapp: '',
    parentRelationship: 'FATHER',
    inviteCode: '',
    subject: defaultSubject
  });

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const validateStep1 = () => {
    if (!form.subject) return 'Sila pilih satu subjek.';
    if (!form.studentName) return 'Sila masukkan nama anda.';
    if (!form.studentMobile) return 'Sila masukkan nombor mobile anda.';
    if (form.studentMobile.length < 10) return 'Nombor mobile tidak sah.';
    if (!form.studentPassword) return 'Sila masukkan password.';
    if (form.studentPassword.length < 6) return 'Password mesti sekurang-kurangnya 6 aksara.';
    if (form.studentPassword !== form.confirmPassword) return 'Password tidak sepadan.';
    return null;
  };

  const validateStep2 = () => {
    if (!form.parentName) return 'Sila masukkan nama ibu/bapa.';
    if (!form.parentWhatsapp) return 'Sila masukkan nombor WhatsApp ibu/bapa.';
    if (form.parentWhatsapp.length < 10) return 'Nombor WhatsApp tidak sah.';
    return null;
  };

  const handleNext = () => {
    const err = validateStep1();
    if (err) return setError(err);
    setStep(2);
  };

  const handleSubmit = async () => {
    const err = validateStep2();
    if (err) return setError(err);
    setLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        studentName: form.studentName,
        studentEmail: form.studentEmail,
        studentMobile: form.studentMobile,
        studentAge: form.studentAge,
        studentPassword: form.studentPassword,
        parentName: form.parentName,
        parentWhatsapp: form.parentWhatsapp,
        parentRelationship: form.parentRelationship,
        inviteCode: form.inviteCode,
        subject: form.subject
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Pendaftaran gagal. Sila cuba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const selectedSubject = SUBJECTS.find(s => s.value === form.subject);

  if (success) {
    return (
      <main style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '8px', letterSpacing: '-1px' }}>Pendaftaran Berjaya!</h2>
          <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
            Akaun anda telah didaftarkan! Cuba Zed secara percuma dengan <strong style={{ color: '#00d4ff' }}>5 mesej percuma</strong>. Selepas itu, minta kelulusan ibu/bapa untuk teruskan.
          </p>
          <div style={{ ...glass, borderRadius: '16px', padding: '16px', marginBottom: '20px', border: '1px solid rgba(0,212,255,0.2)' }}>
            <p style={{ color: '#00d4ff', fontSize: '13px', fontWeight: 700 }}>🎯 5 mesej percuma menanti anda!</p>
            <p style={{ color: '#71717a', fontSize: '12px', marginTop: '6px' }}>
              Subjek: <strong style={{ color: '#fff' }}>{selectedSubject?.icon} {selectedSubject?.label}</strong>
            </p>
          </div>
          <button onClick={() => router.push('/login')} style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '14px 32px', borderRadius: '12px', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>
            Mula Cuba Zed →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: '#050508', minHeight: '100vh', padding: '20px', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <style jsx global>{`
        input::placeholder, textarea::placeholder { color: #52525b; }
        input:focus, select:focus { border-color: rgba(0,212,255,0.4) !important; }
        select option { background: #0a0a12; color: #fff; }
      `}</style>

      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Logo */}
        <div onClick={() => router.push('/')} style={{ fontSize: '22px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '20px', cursor: 'pointer', display: 'inline-block' }}>
          ZED
        </div>

        {/* Card */}
        <div style={{ ...glass, borderRadius: '20px', padding: '28px 24px' }}>

          {/* Header */}
          <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginBottom: '4px', letterSpacing: '-0.5px' }}>
            {step === 1 ? 'Daftar Akaun' : 'Maklumat Ibu/Bapa'}
          </h1>
          <p style={{ fontSize: '12px', color: '#71717a', marginBottom: '20px', fontWeight: 600 }}>
            {step === 1 ? 'Langkah 1/2 — Pilih subjek & maklumat pelajar' : 'Langkah 2/2 — Untuk proses kelulusan kelak'}
          </p>

          {/* Progress */}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '3px', marginBottom: '24px' }}>
            <div style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', height: '3px', borderRadius: '4px', width: step === 1 ? '50%' : '100%', transition: 'width 0.3s ease' }} />
          </div>

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Subject picker */}
              <div>
                <label style={labelStyle}>PILIH 1 SUBJEK</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '10px', background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '100px', padding: '3px 10px', fontWeight: 800 }}>
                    🎯 Early Bird RM{EARLY_BIRD_PRICE}/bulan
                  </span>
                  <span style={{ fontSize: '10px', color: '#52525b', textDecoration: 'line-through' }}>RM{NORMAL_PRICE}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {SUBJECTS.map(s => (
                    <div
                      key={s.value}
                      onClick={() => setForm({ ...form, subject: s.value })}
                      style={{
                        border: `1px solid ${form.subject === s.value ? '#00d4ff' : 'rgba(255,255,255,0.08)'}`,
                        background: form.subject === s.value ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.03)',
                        borderRadius: '10px',
                        padding: '10px 6px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '18px', marginBottom: '4px' }}>{s.icon}</div>
                      <div style={{ fontSize: '10px', fontWeight: 700, color: form.subject === s.value ? '#00d4ff' : '#a1a1aa' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '10px', color: '#52525b', marginTop: '6px' }}>* Boleh tambah subjek lain kemudian</p>
              </div>

              <div><label style={labelStyle}>NAMA PENUH</label><input name="studentName" value={form.studentName} onChange={handle} placeholder="Nama anda" style={inputStyle} /></div>
              <div><label style={labelStyle}>NOMBOR MOBILE</label><input name="studentMobile" value={form.studentMobile} onChange={handle} placeholder="0123456789" style={inputStyle} /></div>
              <div><label style={labelStyle}>EMEL (PILIHAN)</label><input name="studentEmail" value={form.studentEmail} onChange={handle} placeholder="email@contoh.com" style={inputStyle} /></div>
              <div><label style={labelStyle}>UMUR</label><input name="studentAge" value={form.studentAge} onChange={handle} placeholder="16" type="number" style={inputStyle} /></div>
              <div><label style={labelStyle}>PASSWORD</label><input name="studentPassword" value={form.studentPassword} onChange={handle} placeholder="Minimum 6 aksara" type="password" style={inputStyle} /></div>
              <div><label style={labelStyle}>SAHKAN PASSWORD</label><input name="confirmPassword" value={form.confirmPassword} onChange={handle} placeholder="Taip semula password" type="password" style={inputStyle} /></div>
              <div><label style={labelStyle}>KOD JEMPUTAN (PILIHAN)</label><input name="inviteCode" value={form.inviteCode} onChange={handle} placeholder="Kod dari kawan anda" style={inputStyle} /></div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '10px', padding: '12px 14px' }}>
                <p style={{ fontSize: '12px', color: '#00d4ff', lineHeight: 1.5 }}>
                  📱 Maklumat ibu/bapa diperlukan untuk proses kelulusan selepas anda mencuba Zed secara percuma.
                </p>
              </div>

              <div><label style={labelStyle}>NAMA IBU/BAPA</label><input name="parentName" value={form.parentName} onChange={handle} placeholder="Nama ibu atau bapa" style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>HUBUNGAN</label>
                <select name="parentRelationship" value={form.parentRelationship} onChange={handle} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="FATHER">Bapa</option>
                  <option value="MOTHER">Ibu</option>
                  <option value="GUARDIAN">Penjaga</option>
                </select>
              </div>
              <div><label style={labelStyle}>WHATSAPP IBU/BAPA</label><input name="parentWhatsapp" value={form.parentWhatsapp} onChange={handle} placeholder="0123456789" style={inputStyle} /></div>

              {/* Summary */}
              <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '10px', fontWeight: 800, letterSpacing: '0.5px' }}>RINGKASAN PENDAFTARAN</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '12px', color: '#a1a1aa' }}>👤 <span style={{ color: '#fff', fontWeight: 700 }}>{form.studentName}</span></div>
                  <div style={{ fontSize: '12px', color: '#a1a1aa' }}>📚 <span style={{ color: '#00d4ff', fontWeight: 700 }}>{selectedSubject?.icon} {selectedSubject?.label}</span></div>
                  <div style={{ fontSize: '12px', color: '#a1a1aa' }}>💰 <span style={{ color: '#10b981', fontWeight: 700 }}>RM{EARLY_BIRD_PRICE}/bulan</span> <span style={{ color: '#52525b', textDecoration: 'line-through', fontSize: '11px' }}>RM{NORMAL_PRICE}</span></div>
                  <div style={{ fontSize: '10px', color: '#f59e0b', marginTop: '4px' }}>🎯 Harga Early Bird — terhad 10,000 pelajar pertama</div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.2)', borderRadius: '10px', padding: '10px 14px', marginTop: '16px' }}>
              <p style={{ color: '#ff2d78', fontSize: '12px' }}>{error}</p>
            </div>
          )}

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            {step === 2 && (
              <button onClick={() => setStep(1)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#a1a1aa', padding: '13px', borderRadius: '10px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                ← Kembali
              </button>
            )}
            <button onClick={step === 1 ? handleNext : handleSubmit} disabled={loading} style={{ flex: 1, background: loading ? 'rgba(0,212,255,0.2)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '13px', borderRadius: '10px', fontSize: '14px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Mendaftar...' : step === 1 ? 'Seterusnya →' : 'Daftar & Cuba Percuma 🚀'}
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '12px', color: '#71717a' }}>
            Sudah ada akaun?{' '}
            <span onClick={() => router.push('/login')} style={{ color: '#00d4ff', cursor: 'pointer', fontWeight: 700 }}>Login di sini</span>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={<div style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d4ff', fontFamily: 'Inter, sans-serif' }}>Loading...</div>}>
      <RegisterPage />
    </Suspense>
  );
}