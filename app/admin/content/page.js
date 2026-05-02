'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AdminContent() {
  const router = useRouter();
  const [tab, setTab] = useState('subject');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [contentForm, setContentForm] = useState({
    subject: 'MATH', form: 'FORM_5',
    chapter: '', topic: '', title: '', body: '', source: ''
  });

  const [questionForm, setQuestionForm] = useState({
    subject: 'MATH', form: 'FORM_5',
    year: '2023', questionNo: '', question: '', markingScheme: '', marks: ''
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
      setContentForm({ subject: 'MATH', form: 'FORM_5', chapter: '', topic: '', title: '', body: '', source: '' });
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
      setQuestionForm({ subject: 'MATH', form: 'FORM_5', year: '2023', questionNo: '', question: '', markingScheme: '', marks: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal menambah soalan.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
    padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none',
    fontFamily: 'Inter, sans-serif'
  };

  const labelStyle = { fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block', fontWeight: 600 };

  const subjects = ['BM', 'ENGLISH', 'MATH', 'SCIENCE', 'SEJARAH'];
  const forms = ['FORM_4', 'FORM_5'];

  return (
    <main style={{ background: '#070714', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      <nav style={{ padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(7,7,20,0.95)', borderBottom: '1px solid rgba(0,212,255,0.1)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => router.push('/admin/dashboard')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}>←</button>
        <div style={{ fontSize: '18px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Kandungan RAG</div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
          {[{ key: 'subject', label: '📚 Kandungan Silibus' }, { key: 'question', label: '📝 Soalan Tahun Lalu' }].map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setSuccess(''); setError(''); }} style={{ background: tab === t.key ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${tab === t.key ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.1)'}`, color: tab === t.key ? '#00d4ff' : '#94a3b8', padding: '10px 20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
              {t.label}
            </button>
          ))}
        </div>

        {success && (
          <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
            <p style={{ color: '#10b981', fontSize: '14px' }}>✅ {success}</p>
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.3)', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px' }}>
            <p style={{ color: '#ff2d78', fontSize: '14px' }}>{error}</p>
          </div>
        )}

        {/* Subject Content Form */}
        {tab === 'subject' && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px' }}>Tambah Kandungan Silibus SPM</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Subjek</label>
                <select name="subject" value={contentForm.subject} onChange={handleContent} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tingkatan</label>
                <select name="form" value={contentForm.form} onChange={handleContent} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {forms.map(f => <option key={f} value={f}>{f.replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Bab (Chapter)</label>
              <input name="chapter" value={contentForm.chapter} onChange={handleContent} placeholder="Contoh: Bab 3: Fungsi Kuadratik" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Topik</label>
              <input name="topic" value={contentForm.topic} onChange={handleContent} placeholder="Contoh: Penyelesaian Persamaan Kuadratik" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Tajuk</label>
              <input name="title" value={contentForm.title} onChange={handleContent} placeholder="Tajuk ringkas" style={inputStyle} />
            </div>

            <div>
              <label style={labelStyle}>Kandungan (Body)</label>
              <textarea name="body" value={contentForm.body} onChange={handleContent} placeholder="Teks kandungan pembelajaran — boleh copy dari buku teks..." rows={8} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div>
              <label style={labelStyle}>Sumber (Pilihan)</label>
              <input name="source" value={contentForm.source} onChange={handleContent} placeholder="Contoh: Buku Teks KSSM Matematik Tingkatan 5 m.s 21" style={inputStyle} />
            </div>

            <button onClick={submitContent} disabled={loading} style={{ background: loading ? 'rgba(0,212,255,0.3)' : 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Menyimpan...' : 'Tambah Kandungan →'}
            </button>
          </div>
        )}

        {/* Past Year Question Form */}
        {tab === 'question' && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px' }}>Tambah Soalan Tahun Lalu SPM</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Subjek</label>
                <select name="subject" value={questionForm.subject} onChange={handleQuestion} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tingkatan</label>
                <select name="form" value={questionForm.form} onChange={handleQuestion} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {forms.map(f => <option key={f} value={f}>{f.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tahun SPM</label>
                <input name="year" value={questionForm.year} onChange={handleQuestion} placeholder="2023" style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>No. Soalan (Pilihan)</label>
                <input name="questionNo" value={questionForm.questionNo} onChange={handleQuestion} placeholder="Contoh: Bahagian B, S2(a)" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Markah</label>
                <input name="marks" value={questionForm.marks} onChange={handleQuestion} placeholder="5" type="number" style={inputStyle} />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Soalan</label>
              <textarea name="question" value={questionForm.question} onChange={handleQuestion} placeholder="Teks soalan SPM..." rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <div>
              <label style={labelStyle}>Skema Pemarkahan</label>
              <textarea name="markingScheme" value={questionForm.markingScheme} onChange={handleQuestion} placeholder="Jawapan yang dijangka oleh pemeriksa..." rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <button onClick={submitQuestion} disabled={loading} style={{ background: loading ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7c3aed, #ff2d78)', border: 'none', color: '#fff', padding: '14px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? 'Menyimpan...' : 'Tambah Soalan →'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}