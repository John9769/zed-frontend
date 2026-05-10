'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

export default function ZedChat() {
  const router = useRouter();
  const { subject } = useParams();
  const [student, setStudent] = useState(null);
  const [token, setToken] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [milestone, setMilestone] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [trialExhausted, setTrialExhausted] = useState(false);
  const [trialMessages, setTrialMessages] = useState(0);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const subjectLabels = {
    MATH: 'Mathematics',
    ADD_MATH: 'Additional Mathematics',
    SCIENCE: 'Science',
    BIOLOGY: 'Biology',
    PHYSICS: 'Physics',
    CHEMISTRY: 'Chemistry',
    SEJARAH: 'Sejarah'
  };

  const subjectColors = {
    MATH: '#ff2d78',
    ADD_MATH: '#00d4ff',
    SCIENCE: '#10b981',
    BIOLOGY: '#84cc16',
    PHYSICS: '#f59e0b',
    CHEMISTRY: '#a78bfa',
    SEJARAH: '#f59e0b'
  };

  const color = subjectColors[subject] || '#00d4ff';

  useEffect(() => {
    const stored = localStorage.getItem('zed_student');
    const t = localStorage.getItem('zed_token');
    if (!stored || !t) { router.push('/login'); return; }
    const parsed = JSON.parse(stored);
    setStudent(parsed);
    setTrialMessages(parsed.trialMessages || 0);
    setToken(t);
    setMessages([{
      role: 'ZED',
      content: `Hai! Jom kita tackle ${subjectLabels[subject]} hari ni. 💪 Apa yang anda nak belajar atau tanya? Boleh upload soalan atau gambar exercise book anda juga! Zed sedia! 📎`,
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) { alert('Hanya fail JPG, PNG, WEBP atau PDF dibenarkan.'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('Fail terlalu besar. Maksimum 10MB.'); return; }
    setUploading(true);
    if (file.type !== 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => setUploadPreview({ type: 'image', url: e.target.result, name: file.name });
      reader.readAsDataURL(file);
    } else {
      setUploadPreview({ type: 'pdf', name: file.name });
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload/document`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      const { extractedText, fileName, fileType, url } = res.data;
      setMessages(prev => [...prev, { role: 'STUDENT', content: `[Upload: ${fileName}]`, fileUrl: url, fileType, timestamp: new Date() }]);
      const autoMessage = extractedText
        ? `Saya upload dokumen ini untuk Zed semak. Ini kandungannya:\n\n${extractedText.substring(0, 2000)}`
        : `Saya upload fail: ${fileName}. Tolong Zed tengok dan bantu saya.`;
      await sendToZed(autoMessage);
    } catch (err) {
      console.error('Upload error:', err);
      setMessages(prev => [...prev, { role: 'ZED', content: 'Alamak, ada masalah dengan upload tu. Cuba lagi ye! 🙏', timestamp: new Date() }]);
      setUploadPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const sendToZed = async (messageToSend) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/zed/chat`,
        { sessionId, message: messageToSend, subject },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessionId(res.data.sessionId);
      setMessages(prev => [...prev, { role: 'ZED', content: res.data.reply, timestamp: new Date() }]);
      if (res.data.milestones?.length > 0) {
        setMilestone(res.data.milestones[0]);
        setTimeout(() => setMilestone(null), 5000);
      }
      if (res.data.trialMessages !== undefined) {
        setTrialMessages(res.data.trialMessages);
        const stored = localStorage.getItem('zed_student');
        if (stored) {
          const parsed = JSON.parse(stored);
          parsed.trialMessages = res.data.trialMessages;
          localStorage.setItem('zed_student', JSON.stringify(parsed));
        }
      }
    } catch (err) {
      if (err.response?.data?.error === 'TRIAL_EXHAUSTED') {
        setTrialExhausted(true);
      } else {
        setMessages(prev => [...prev, { role: 'ZED', content: 'Alamak, Zed ada masalah teknikal sekejap. Cuba lagi ye! 🙏', timestamp: new Date() }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const requestApproval = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/request-approval`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('WhatsApp telah dihantar kepada ibu/bapa anda! Sila tunggu kelulusan mereka. 🙏');
      router.push('/dashboard');
    } catch (err) {
      alert('Gagal hantar WhatsApp. Sila cuba lagi.');
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setUploadPreview(null);
    setMessages(prev => [...prev, { role: 'STUDENT', content: userMessage, timestamp: new Date() }]);
    await sendToZed(userMessage);
  };

  return (
    <main style={{ background: '#050508', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        textarea::placeholder { color: #52525b; }
        textarea:focus { outline: none; }
      `}</style>

      {/* Header */}
      <div style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,5,8,0.95)', borderBottom: `1px solid ${color}15`, backdropFilter: 'blur(12px)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '18px', padding: '4px' }}>←</button>
          <img src="/assets/Zed.png" alt="Zed" style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${color}40` }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '-0.3px' }}>ZED</div>
            <div style={{ fontSize: '10px', color: color, fontWeight: 700 }}>{subjectLabels[subject]} • Online</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: '#71717a' }}>{student?.name}</div>
          {student?.status === 'TRIAL' && !trialExhausted && (
            <div style={{ fontSize: '10px', color: '#f59e0b', fontWeight: 700 }}>🎯 {5 - trialMessages} mesej berbaki</div>
          )}
        </div>
      </div>

      {/* Trial Exhausted Banner */}
      {trialExhausted && (
        <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', padding: '16px 20px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: '18px', marginBottom: '6px' }}>🚀</div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>Cuba percuma anda dah habis!</div>
          <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '12px' }}>Minta ibu/bapa subscribe untuk teruskan perjalanan SPM anda!</div>
          <button onClick={requestApproval} style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '10px 24px', borderRadius: '10px', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}>
            📲 Dapatkan Kelulusan Ibu Bapa
          </button>
        </div>
      )}

      {/* Milestone Toast */}
      {milestone && (
        <div style={{ position: 'fixed', top: '70px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', borderRadius: '100px', padding: '10px 20px', fontSize: '12px', fontWeight: 800, color: '#fff', zIndex: 1000 }}>
          🏆 {milestone}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: msg.role === 'STUDENT' ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '8px' }}>
            {msg.role === 'ZED' && (
              <img src="/assets/Zed.png" alt="Zed" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${color}30`, flexShrink: 0 }} />
            )}
            <div style={{
              maxWidth: '75%',
              background: msg.role === 'STUDENT' ? `${color}15` : 'rgba(255,255,255,0.04)',
              border: msg.role === 'STUDENT' ? `1px solid ${color}25` : '1px solid rgba(255,255,255,0.07)',
              borderRadius: msg.role === 'STUDENT' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              padding: '10px 14px'
            }}>
              {msg.fileUrl && msg.fileType === 'image' && (
                <img src={msg.fileUrl} alt="upload" style={{ width: '100%', maxWidth: '260px', borderRadius: '8px', marginBottom: '6px' }} />
              )}
              {msg.fileUrl && msg.fileType === 'pdf' && (
                <div style={{ background: 'rgba(255,45,120,0.08)', border: '1px solid rgba(255,45,120,0.15)', borderRadius: '8px', padding: '8px 12px', marginBottom: '6px', fontSize: '12px', color: '#ff2d78' }}>
                  📄 {msg.content.replace('[Upload: ', '').replace(']', '')}
                </div>
              )}
              {!msg.fileUrl && (
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#fff', margin: 0, whiteSpace: 'pre-wrap' }}>{msg.content}</p>
              )}
              <div style={{ fontSize: '9px', color: '#52525b', marginTop: '4px', textAlign: msg.role === 'STUDENT' ? 'right' : 'left' }}>
                {msg.timestamp?.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {(loading || uploading) && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
            <img src="/assets/Zed.png" alt="Zed" style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${color}30` }} />
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px 16px 16px 4px', padding: '10px 14px' }}>
              <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '5px' }}>
                {uploading ? 'Zed sedang baca dokumen anda...' : 'Zed sedang berfikir...'}
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, opacity: 0.6, animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Upload Preview */}
      {uploadPreview && (
        <div style={{ padding: '8px 16px', background: 'rgba(5,5,8,0.95)', borderTop: `1px solid ${color}10`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {uploadPreview.type === 'image'
              ? <img src={uploadPreview.url} alt="preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '8px' }} />
              : <div style={{ width: '40px', height: '40px', background: 'rgba(255,45,120,0.08)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📄</div>
            }
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: '#fff', fontWeight: 600 }}>{uploadPreview.name}</div>
              <div style={{ fontSize: '10px', color: '#00d4ff' }}>Zed sedang membaca...</div>
            </div>
            <button onClick={() => setUploadPreview(null)} style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '16px' }}>×</button>
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '10px 16px', background: 'rgba(5,5,8,0.95)', borderTop: `1px solid ${color}15`, backdropFilter: 'blur(12px)', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', maxWidth: '800px', margin: '0 auto' }}>
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || loading}
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}20`, color: uploading ? color : '#71717a', width: '40px', height: '40px', borderRadius: '10px', fontSize: '18px', cursor: uploading || loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            📎
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={`Tanya Zed tentang ${subjectLabels[subject]}...`}
            rows={1}
            style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: `1px solid ${color}20`, borderRadius: '12px', padding: '10px 14px', color: '#fff', fontSize: '13px', outline: 'none', resize: 'none', fontFamily: 'Inter, sans-serif', lineHeight: 1.5 }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || uploading || !input.trim()}
            style={{ background: loading || uploading || !input.trim() ? 'rgba(0,212,255,0.15)' : `linear-gradient(135deg, ${color}, #7c3aed)`, border: 'none', color: '#fff', width: '40px', height: '40px', borderRadius: '10px', fontSize: '16px', cursor: loading || uploading || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
          >
            ↑
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '10px', color: '#52525b', marginTop: '6px' }}>
          📎 Upload soalan • Enter hantar • Shift+Enter baris baru • Zed AI — semak semula dengan guru untuk kepastian 📚
        </p>
      </div>

    </main>
  );
}