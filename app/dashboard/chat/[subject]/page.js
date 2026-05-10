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

  // ============================================================
  // HANDLE FILE UPLOAD
  // ============================================================
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Hanya fail JPG, PNG, WEBP atau PDF dibenarkan.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Fail terlalu besar. Maksimum 10MB.');
      return;
    }

    setUploading(true);

    // Show preview
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const { extractedText, fileName, fileType, url } = res.data;

      // Add upload message to chat
      setMessages(prev => [...prev, {
        role: 'STUDENT',
        content: `[Upload: ${fileName}]`,
        fileUrl: url,
        fileType,
        timestamp: new Date()
      }]);

      // Auto send to Zed with extracted text
      const autoMessage = extractedText
        ? `Saya upload dokumen ini untuk Zed semak. Ini kandungannya:\n\n${extractedText.substring(0, 2000)}`
        : `Saya upload fail: ${fileName}. Tolong Zed tengok dan bantu saya.`;

      await sendToZed(autoMessage);

    } catch (err) {
      console.error('Upload error:', err);
      setMessages(prev => [...prev, {
        role: 'ZED',
        content: 'Alamak, ada masalah dengan upload tu. Cuba lagi ye! 🙏',
        timestamp: new Date()
      }]);
      setUploadPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ============================================================
  // SEND TO ZED — CORE FUNCTION
  // ============================================================
  const sendToZed = async (messageToSend) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/zed/chat`,
        { sessionId, message: messageToSend, subject },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSessionId(res.data.sessionId);
      setMessages(prev => [...prev, {
        role: 'ZED',
        content: res.data.reply,
        timestamp: new Date()
      }]);

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
        setMessages(prev => [...prev, {
          role: 'ZED',
          content: 'Alamak, Zed ada masalah teknikal sekejap. Cuba lagi ye! 🙏',
          timestamp: new Date()
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // REQUEST PARENT APPROVAL
  // ============================================================
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

  // ============================================================
  // SEND MESSAGE
  // ============================================================
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    setUploadPreview(null);
    setMessages(prev => [...prev, {
      role: 'STUDENT',
      content: userMessage,
      timestamp: new Date()
    }]);
    await sendToZed(userMessage);
  };

  return (
    <main style={{ background: '#070714', height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      {/* Header */}
      <div style={{
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(7,7,20,0.95)',
        borderBottom: `1px solid ${color}20`,
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/dashboard')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px', padding: '4px' }}>←</button>
          <img src="/assets/Zed.png" alt="Zed" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${color}50` }} />
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800 }}>ZED</div>
            <div style={{ fontSize: '11px', color: color }}>{subjectLabels[subject]} • Online</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>{student?.name}</div>
          {student?.status === 'TRIAL' && !trialExhausted && (
            <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: 600 }}>
              🎯 Cuba percuma: {5 - trialMessages} lagi
            </div>
          )}
        </div>
      </div>

      {/* Trial Exhausted Banner */}
      {trialExhausted && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
          border: '1px solid rgba(0,212,255,0.3)',
          padding: '20px 24px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '20px', marginBottom: '8px' }}>🚀</div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '6px' }}>
            Cuba percuma anda dah habis!
          </div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
            Zed dah tunjukkan cara dia mengajar. Sekarang minta ibu/bapa subscribe untuk teruskan perjalanan SPM anda!
          </div>
          <button
            onClick={requestApproval}
            style={{
              background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
              border: 'none', color: '#fff',
              padding: '12px 32px',
              borderRadius: '50px',
              fontSize: '14px', fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0,212,255,0.4)'
            }}
          >
            📲 Dapatkan Kelulusan Ibu Bapa
          </button>
        </div>
      )}

      {/* Milestone Toast */}
      {milestone && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
          borderRadius: '50px', padding: '12px 24px',
          fontSize: '14px', fontWeight: 700, color: '#fff',
          zIndex: 1000, boxShadow: '0 0 30px rgba(0,212,255,0.4)'
        }}>
          🏆 {milestone}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            flexDirection: msg.role === 'STUDENT' ? 'row-reverse' : 'row',
            alignItems: 'flex-end',
            gap: '10px'
          }}>
            {msg.role === 'ZED' && (
              <img src="/assets/Zed.png" alt="Zed" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${color}40`, flexShrink: 0 }} />
            )}
            <div style={{
              maxWidth: '70%',
              background: msg.role === 'STUDENT' ? 'linear-gradient(135deg, #00d4ff20, #7c3aed20)' : 'rgba(255,255,255,0.05)',
              border: msg.role === 'STUDENT' ? `1px solid ${color}30` : '1px solid rgba(255,255,255,0.08)',
              borderRadius: msg.role === 'STUDENT' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              padding: '14px 18px'
            }}>
              {/* File preview in message */}
              {msg.fileUrl && msg.fileType === 'image' && (
                <img src={msg.fileUrl} alt="upload" style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', marginBottom: '8px' }} />
              )}
              {msg.fileUrl && msg.fileType === 'pdf' && (
                <div style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.2)', borderRadius: '8px', padding: '10px 14px', marginBottom: '8px', fontSize: '13px', color: '#ff2d78' }}>
                  📄 {msg.content.replace('[Upload: ', '').replace(']', '')}
                </div>
              )}
              {!msg.fileUrl && (
                <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#fff', margin: 0, whiteSpace: 'pre-wrap' }}>
                  {msg.content}
                </p>
              )}
              <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px', textAlign: msg.role === 'STUDENT' ? 'right' : 'left' }}>
                {msg.timestamp?.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Typing / uploading indicator */}
        {(loading || uploading) && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            <img src="/assets/Zed.png" alt="Zed" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${color}40` }} />
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px 20px 20px 4px', padding: '14px 18px' }}>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '6px' }}>
                {uploading ? 'Zed sedang baca dokumen anda...' : 'Zed sedang berfikir...'}
              </div>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '6px', height: '6px', borderRadius: '50%',
                    background: color, opacity: 0.6,
                    animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Upload Preview */}
      {uploadPreview && (
        <div style={{
          padding: '8px 24px',
          background: 'rgba(7,7,20,0.95)',
          borderTop: `1px solid ${color}10`
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {uploadPreview.type === 'image' ? (
              <img src={uploadPreview.url} alt="preview" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${color}30` }} />
            ) : (
              <div style={{ width: '48px', height: '48px', background: 'rgba(255,45,120,0.1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📄</div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: '#fff', fontWeight: 600 }}>{uploadPreview.name}</div>
              <div style={{ fontSize: '11px', color: '#00d4ff' }}>Zed sedang membaca...</div>
            </div>
            <button onClick={() => setUploadPreview(null)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '18px' }}>×</button>
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{
        padding: '16px 24px',
        background: 'rgba(7,7,20,0.95)',
        borderTop: `1px solid ${color}20`,
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', maxWidth: '800px', margin: '0 auto' }}>

          {/* Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || loading}
            style={{
              background: uploading ? 'rgba(0,212,255,0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${color}30`,
              color: uploading ? '#00d4ff' : '#94a3b8',
              width: '48px', height: '48px',
              borderRadius: '14px',
              fontSize: '20px',
              cursor: uploading || loading ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.3s ease'
            }}
            title="Upload soalan atau dokumen"
          >
            📎
          </button>

          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={`Tanya Zed tentang ${subjectLabels[subject]} atau upload soalan anda...`}
            rows={1}
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${color}30`,
              borderRadius: '16px',
              padding: '14px 18px',
              color: '#fff',
              fontSize: '14px',
              outline: 'none',
              resize: 'none',
              fontFamily: 'Inter, sans-serif',
              lineHeight: 1.5
            }}
          />

          <button
            onClick={sendMessage}
            disabled={loading || uploading || !input.trim()}
            style={{
              background: loading || uploading || !input.trim() ? 'rgba(0,212,255,0.2)' : `linear-gradient(135deg, ${color}, #7c3aed)`,
              border: 'none', color: '#fff',
              width: '48px', height: '48px',
              borderRadius: '14px',
              fontSize: '20px',
              cursor: loading || uploading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: loading ? 'none' : `0 0 16px ${color}40`
            }}
          >
            ↑
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
          📎 Upload soalan • Enter untuk hantar • Shift+Enter untuk baris baru
        </p>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
      `}</style>

    </main>
  );
}