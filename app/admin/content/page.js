'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const glass = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
};

const inputStyle = {
  width: '100%', background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
  padding: '10px 14px', color: '#fff', fontSize: '13px', outline: 'none',
  fontFamily: 'Inter, sans-serif'
};

const labelStyle = {
  fontSize: '10px', color: '#71717a', marginBottom: '6px',
  display: 'block', fontWeight: 800, letterSpacing: '0.5px'
};

const subjects = ['MATH', 'ADD_MATH', 'SCIENCE', 'BIOLOGY', 'PHYSICS', 'CHEMISTRY'];
const forms = ['FORM_4', 'FORM_5'];

export default function AdminContent() {
  const router = useRouter();
  const [tab, setTab] = useState('subject');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [contentForm, setContentForm] = useState({
    subject: 'MATH', form: 'FORM_4',
    chapter: '', topic: '', title: '', body: '', source: ''
  });

  const [questionForm, setQuestionForm] = useState({
    subject: 'MATH', form: 'FORM_4',
    year: '2024', questionNo: '', question: '', markingScheme: '', marks: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('zed_admin_token');
    if (!token) router.push('/admin');
  }, []);

  const handleContent = (e) => setContentForm({ ...contentForm, [e.target.name]: e.target.value });
  const handleQuestion = (e) => setQuestionForm({ ...questionForm, [e.target.name]: e.target.value });

  const submitContent = async () => {
    const token = localStorage.getItem('zed_admin_token');
    setLoading(true); setError(''); setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/content/subject`, contentForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Kandungan berjaya ditambah!');
      setContentForm({ subject: 'MATH', form: 'FORM_4', chapter: '', topic: '', title: '', body: '', source: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal menambah kandungan.');
    } finally {
      setLoading(false);
    }
  };

  const submitQuestion = async () => {
    const token = localStorage.getItem('zed_admin_token');
    setLoading(true); setError(''); setSuccess('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/content/questions`, questionForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Soalan berjaya ditambah!');
      setQuestionForm({ subject: 'MATH', form: 'FORM_4', year: '2024', questionNo: '', question: '', markingScheme: '', marks: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal menambah soalan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ background: '#050508', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      <style jsx global>{`
        select option { background: #0a0a12; color: #fff; }
        input::placeholder, textarea::placeholder { color: #52525b; }
        input:focus, textarea:focus, select:focus { border-color: rgba(0,212,255,0.3) !important; }
      `}</style>

      <nav style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(5,5,8,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => router.push('/admin/dashboard')} style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '18px' }}>←</button>
        <div style={{ fontSize: '16px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>Kandungan RAG</div>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '20px 16px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {[{ key: 'subject', label: '📚 Kandungan Silibus' }, { key: 'question', label: '📝 Soalan Tahun Lalu' }].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setSuccess(''); setError(''); }}
              style={{ background: tab === t.key ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${tab === t.key ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.08)'}`, color: tab === t.key ? '#00d4ff' : '#71717a', padding: '8px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
              {t.label}
            </button>
          ))}
        </div>

        {success && (
          <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px' }}>
            <p style={{ color: '#10b981', fontSize: '12px' }}>✅ {success}</p>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.2)', borderRadius: '10px', padding: '10px 14px', marginBottom: '16px' }}>
            <p style={{ color: '#ff2d78', fontSize: '12px' }}>{error}</p>
          </div>
        )}

        {/* Subject Content Form */}
        {tab === 'subject' && (
          <div style={{ ...glass, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '-0.3px' }}>Tambah Kandungan Silibus SPM</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={labelStyle}>SUBJEK</label>
                <select name="subject" value={contentForm.subject} onChange={handleContent} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>TINGKATAN</label>
                <select name="form" value={contentForm.form} onChange={handleContent} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {forms.map(f => <option key={f} value={f}>{f.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>BAB (CHAPTER)</label>
              <input name="chapter" value={contentForm.chapter} onChange={handleContent} placeholder="Contoh: Chapter 3: Quadratic Functions" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>TOPIK</label>
              <input name="topic" value={contentForm.topic} onChange={handleContent} placeholder="Contoh: Solving Quadratic Equations" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>TAJUK</label>
              <input name="title" value={contentForm.title} onChange={handleContent} placeholder="Tajuk ringkas" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>KANDUNGAN (BODY)</label>
              <textarea name="body" value={contentForm.body} onChange={handleContent} placeholder="Teks kandungan pembelajaran..." rows={8} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div>
              <label style={labelStyle}>SUMBER (PILIHAN)</label>
              <input name="source" value={contentForm.source} onChange={handleContent} placeholder="Contoh: KSSM Mathematics Form 5 Textbook p.21" style={inputStyle} />
            </div>

            <button onClick={submitContent} disabled={loading} style={{ background: loading ? 'rgba(0,212,255,0.2)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Menyimpan...' : 'Tambah Kandungan →'}
            </button>
          </div>
        )}

        {/* Past Year Question Form */}
        {tab === 'question' && (
          <div style={{ ...glass, borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '-0.3px' }}>Tambah Soalan Tahun Lalu SPM</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div>
                <label style={labelStyle}>SUBJEK</label>
                <select name="subject" value={questionForm.subject} onChange={handleQuestion} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>TINGKATAN</label>
                <select name="form" value={questionForm.form} onChange={handleQuestion} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {forms.map(f => <option key={f} value={f}>{f.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>TAHUN SPM</label>
                <input name="year" value={questionForm.year} onChange={handleQuestion} placeholder="2024" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
              <div>
                <label style={labelStyle}>NO. SOALAN (PILIHAN)</label>
                <input name="questionNo" value={questionForm.questionNo} onChange={handleQuestion} placeholder="Contoh: Section B, Q2(a)" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>MARKAH</label>
                <input name="marks" value={questionForm.marks} onChange={handleQuestion} placeholder="5" type="number" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>SOALAN</label>
              <textarea name="question" value={questionForm.question} onChange={handleQuestion} placeholder="Teks soalan SPM..." rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div>
              <label style={labelStyle}>SKEMA PEMARKAHAN</label>
              <textarea name="markingScheme" value={questionForm.markingScheme} onChange={handleQuestion} placeholder="Jawapan yang dijangka oleh pemeriksa..." rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <button onClick={submitQuestion} disabled={loading} style={{ background: loading ? 'rgba(124,58,237,0.2)' : 'linear-gradient(135deg, #7c3aed, #ff2d78)', border: 'none', color: '#fff', padding: '12px', borderRadius: '10px', fontSize: '13px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Menyimpan...' : 'Tambah Soalan →'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}