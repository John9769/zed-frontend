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
  const [sessionId, setSessionId] = useState(null);
  const [milestone, setMilestone] = useState(null);
  const messagesEndRef = useRef(null);

  const subjectLabels = {
    BM: 'Bahasa Melayu',
    ENGLISH: 'English',
    MATH: 'Mathematics',
    SCIENCE: 'Science',
    SEJARAH: 'Sejarah'
  };

  const subjectColors = {
    BM: '#00d4ff',
    ENGLISH: '#7c3aed',
    MATH: '#ff2d78',
    SCIENCE: '#10b981',
    SEJARAH: '#f59e0b'
  };

  const color = subjectColors[subject] || '#00d4ff';

  useEffect(() => {
    const stored = localStorage.getItem('zed_student');
    const t = localStorage.getItem('zed_token');
    if (!stored || !t) { router.push('/login'); return; }
    setStudent(JSON.parse(stored));
    setToken(t);

    // Welcome message from Zed
    setMessages([{
      role: 'ZED',
      content: `Hai! Jom kita tackle ${subjectLabels[subject]} hari ni. 💪 Apa yang anda nak belajar atau tanya? Boleh tanya apa-apa je — Zed sedia!`,
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'STUDENT', content: userMessage, timestamp: new Date() }]);
    setLoading(true);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/zed/chat`,
        { sessionId, message: userMessage, subject },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSessionId(res.data.sessionId);
      setMessages(prev => [...prev, { role: 'ZED', content: res.data.reply, timestamp: new Date() }]);

      if (res.data.milestones?.length > 0) {
        setMilestone(res.data.milestones[0]);
        setTimeout(() => setMilestone(null), 5000);
      }

    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'ZED',
        content: 'Alamak, Zed ada masalah teknikal sekejap. Cuba lagi ye! 🙏',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
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
          <button
            onClick={() => router.push('/dashboard')}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px', padding: '4px' }}
          >
            ←
          </button>
          <img src="/assets/Zed.png" alt="Zed" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: `2px solid ${color}50` }} />
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800 }}>ZED</div>
            <div style={{ fontSize: '11px', color: color }}>
              {subjectLabels[subject]} • Online
            </div>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
          {student?.name}
        </div>
      </div>

      {/* Milestone Toast */}
      {milestone && (
        <div style={{
          position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
          borderRadius: '50px', padding: '12px 24px',
          fontSize: '14px', fontWeight: 700, color: '#fff',
          zIndex: 1000, boxShadow: '0 0 30px rgba(0,212,255,0.4)',
          animation: 'fadeIn 0.3s ease'
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
            {/* Avatar */}
            {msg.role === 'ZED' && (
              <img src="/assets/Zed.png" alt="Zed" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${color}40`, flexShrink: 0 }} />
            )}

            {/* Bubble */}
            <div style={{
              maxWidth: '70%',
              background: msg.role === 'STUDENT'
                ? 'linear-gradient(135deg, #00d4ff20, #7c3aed20)'
                : 'rgba(255,255,255,0.05)',
              border: msg.role === 'STUDENT'
                ? `1px solid ${color}30`
                : '1px solid rgba(255,255,255,0.08)',
              borderRadius: msg.role === 'STUDENT'
                ? '20px 20px 4px 20px'
                : '20px 20px 20px 4px',
              padding: '14px 18px'
            }}>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#fff', margin: 0, whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </p>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px', textAlign: msg.role === 'STUDENT' ? 'right' : 'left' }}>
                {msg.timestamp?.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
            <img src="/assets/Zed.png" alt="Zed" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${color}40` }} />
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px 20px 20px 4px', padding: '14px 18px' }}>
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

      {/* Input */}
      <div style={{
        padding: '16px 24px',
        background: 'rgba(7,7,20,0.95)',
        borderTop: `1px solid ${color}20`,
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end', maxWidth: '800px', margin: '0 auto' }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={`Tanya Zed tentang ${subjectLabels[subject]}...`}
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
            disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim() ? 'rgba(0,212,255,0.2)' : `linear-gradient(135deg, ${color}, #7c3aed)`,
              border: 'none', color: '#fff',
              width: '48px', height: '48px',
              borderRadius: '14px',
              fontSize: '20px', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: loading ? 'none' : `0 0 16px ${color}40`
            }}
          >
            ↑
          </button>
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', marginTop: '8px' }}>
          Enter untuk hantar • Shift+Enter untuk baris baru
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