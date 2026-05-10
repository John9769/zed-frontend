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

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '14px 16px',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'border 0.3s ease'
  };

  const labelStyle = {
    fontSize: '13px',
    color: '#94a3b8',
    marginBottom: '8px',
    display: 'block',
    fontWeight: 600
  };

  if (success) {
    return (
      <main style={{ background: '#070714', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#fff', marginBottom: '16px' }}>Pendaftaran Berjaya!</h2>
          <p style={{ color: '#94a3b8', fontSize: '16px', lineHeight: 1.7, marginBottom: '24px' }}>
            Akaun anda telah berjaya didaftarkan! Cuba Zed secara percuma dengan <strong style={{ color: '#00d4ff' }}>5 mesej percuma</strong>.
            <br /><br />
            Selepas 5 mesej, anda boleh minta kelulusan ibu/bapa untuk teruskan pembelajaran.
          </p>
          <div style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '16px', padding: '20px', marginBottom: '24px' }}>
            <p style={{ color: '#00d4ff', fontSize: '14px', fontWeight: 600 }}>🎯 5 mesej percuma menanti anda!</p>
            <p style={{ color: '#94a3b8', fontSize: '13px', marginTop: '8px' }}>
              Subjek dipilih: <strong style={{ color: '#fff' }}>{selectedSubject?.icon} {selectedSubject?.label}</strong>
            </p>
          </div>
          <button onClick={() => router.push('/login')} style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '14px 40px', borderRadius: '50px', fontSize: '15px', fontWeight: 700, cursor: 'pointer' }}>
            Mula Cuba Zed →
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: '#070714', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '400px', background: 'rgba(0,212,255,0.05)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ width: '100%', maxWidth: '480px', position: 'relative', zIndex: 1 }}>
        <div onClick={() => router.push('/')} style={{ fontSize: '28px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '32px', cursor: 'pointer', display: 'inline-block' }}>
          ZED
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px 32px', backdropFilter: 'blur(12px)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', marginBottom: '8px' }}>
            {step === 1 ? 'Daftar Akaun' : 'Maklumat Ibu/Bapa'}
          </h1>
          <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '32px' }}>
            {step === 1 ? 'Langkah 1/2 — Pilih subjek & maklumat pelajar' : 'Langkah 2/2 — Untuk proses kelulusan kelak'}
          </p>

          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', height: '4px', marginBottom: '32px' }}>
            <div style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', height: '4px', borderRadius: '4px', width: step === 1 ? '50%' : '100%', transition: 'width 0.3s ease' }} />
          </div>

          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Pilih 1 Subjek</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '20px', padding: '3px 10px', fontWeight: 700 }}>
                    🎯 Early Bird RM{EARLY_BIRD_PRICE}/bulan
                  </span>
                  <span style={{ fontSize: '11px', color: '#475569', textDecoration: 'line-through' }}>RM{NORMAL_PRICE}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {SUBJECTS.map(s => (
                    <div
                      key={s.value}
                      onClick={() => setForm({ ...form, subject: s.value })}
                      style={{
                        border: `1px solid ${form.subject === s.value ? '#00d4ff' : 'rgba(255,255,255,0.1)'}`,
                        background: form.subject === s.value ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.03)',
                        borderRadius: '12px',
                        padding: '12px',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{s.icon}</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: form.subject === s.value ? '#00d4ff' : '#fff' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: '11px', color: '#475569', marginTop: '8px' }}>* Boleh tambah subjek lain kemudian</p>
              </div>

              <div><label style={labelStyle}>Nama Penuh</label><input name="studentName" value={form.studentName} onChange={handle} placeholder="Nama anda" style={inputStyle} /></div>
              <div><label style={labelStyle}>Nombor Mobile</label><input name="studentMobile" value={form.studentMobile} onChange={handle} placeholder="0123456789" style={inputStyle} /></div>
              <div><label style={labelStyle}>Emel (Pilihan)</label><input name="studentEmail" value={form.studentEmail} onChange={handle} placeholder="email@contoh.com" style={inputStyle} /></div>
              <div><label style={labelStyle}>Umur</label><input name="studentAge" value={form.studentAge} onChange={handle} placeholder="16" type="number" style={inputStyle} /></div>
              <div><label style={labelStyle}>Password</label><input name="studentPassword" value={form.studentPassword} onChange={handle} placeholder="Minimum 6 aksara" type="password" style={inputStyle} /></div>
              <div><label style={labelStyle}>Sahkan Password</label><input name="confirmPassword" value={form.confirmPassword} onChange={handle} placeholder="Taip semula password" type="password" style={inputStyle} /></div>
              <div><label style={labelStyle}>Kod Jemputan (Pilihan)</label><input name="inviteCode" value={form.inviteCode} onChange={handle} placeholder="Kod dari kawan anda" style={inputStyle} /></div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.15)', borderRadius: '12px', padding: '16px' }}>
                <p style={{ fontSize: '13px', color: '#00d4ff', lineHeight: 1.6 }}>
                  📱 Maklumat ibu/bapa diperlukan untuk proses kelulusan selepas anda mencuba Zed secara percuma.
                </p>
              </div>

              <div><label style={labelStyle}>Nama Ibu/Bapa</label><input name="parentName" value={form.parentName} onChange={handle} placeholder="Nama ibu atau bapa" style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>Hubungan</label>
                <select name="parentRelationship" value={form.parentRelationship} onChange={handle} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="FATHER">Bapa</option>
                  <option value="MOTHER">Ibu</option>
                  <option value="GUARDIAN">Penjaga</option>
                </select>
              </div>
              <div><label style={labelStyle}>Nombor WhatsApp Ibu/Bapa</label><input name="parentWhatsapp" value={form.parentWhatsapp} onChange={handle} placeholder="0123456789" style={inputStyle} /></div>

              <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '10px', fontWeight: 700 }}>Ringkasan Pendaftaran:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ fontSize: '13px', color: '#fff' }}>👤 Nama: <strong>{form.studentName}</strong></div>
                  <div style={{ fontSize: '13px', color: '#fff' }}>📚 Subjek: <strong style={{ color: '#00d4ff' }}>{selectedSubject?.icon} {selectedSubject?.label}</strong></div>
                  <div style={{ fontSize: '13px', color: '#fff' }}>💰 Harga: <strong style={{ color: '#10b981' }}>RM{EARLY_BIRD_PRICE}/bulan</strong> <span style={{ color: '#475569', textDecoration: 'line-through', fontSize: '11px' }}>RM{NORMAL_PRICE}</span></div>
                  <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px' }}>🎯 Harga Early Bird — terhad untuk 10,000 pelajar pertama</div>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)', borderRadius: '12px', padding: '12px 16px', marginTop: '20px' }}>
              <p style={{ color: '#ff2d78', fontSize: '13px' }}>{error}</p>
            </div>
          )}

          <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
            {step === 2 && (
              <button onClick={() => setStep(1)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#94a3b8', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
                ← Kembali
              </button>
            )}
            <button onClick={step === 1 ? handleNext : handleSubmit} disabled={loading} style={{ flex: 1, background: loading ? 'rgba(0,212,255,0.3)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
              {loading ? 'Mendaftar...' : step === 1 ? 'Seterusnya →' : 'Daftar & Cuba Zed Percuma 🚀'}
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#94a3b8' }}>
            Sudah ada akaun?{' '}
            <span onClick={() => router.push('/login')} style={{ color: '#00d4ff', cursor: 'pointer', fontWeight: 600 }}>Login di sini</span>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function RegisterPageWrapper() {
  return (
    <Suspense fallback={<div style={{ background: '#070714', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00d4ff' }}>Loading...</div>}>
      <RegisterPage />
    </Suspense>
  );
}