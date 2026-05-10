'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

const SUBJECT_COLORS = {
  MATH: '#ff2d78',
  ADD_MATH: '#00d4ff',
  SCIENCE: '#10b981',
  BIOLOGY: '#84cc16',
  PHYSICS: '#f59e0b',
  CHEMISTRY: '#a78bfa'
};

export default function ConversationDetail() {
  const router = useRouter();
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('zed_admin_token');
    if (!token) { router.push('/admin'); return; }
    fetchSession();
  }, [sessionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session]);

  const fetchSession = async () => {
    try {
      const token = localStorage.getItem('zed_admin_token');
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/conversations/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSession(res.data.session);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (d) => new Date(d).toLocaleString('en-MY', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

  if (loading) return (
    <main style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#71717a', fontSize: '13px' }}>
      Memuatkan perbualan...
    </main>
  );

  if (!session) return (
    <main style={{ background: '#050508', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#ff2d78', fontSize: '13px' }}>
      Sesi tidak dijumpai.
    </main>
  );

  const subjectColor = SUBJECT_COLORS[session.subject] || '#7c3aed';

  return (
    <main style={{ background: '#050508', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#fff', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(12px)', zIndex: 10 }}>
        <button onClick={() => router.push('/admin/conversations')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#71717a', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          ← Balik
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 900, fontSize: '14px', letterSpacing: '-0.3px' }}>{session.student?.name}</span>
            <span style={{ background: `${subjectColor}15`, border: `1px solid ${subjectColor}30`, color: subjectColor, fontSize: '10px', fontWeight: 800, padding: '2px 8px', borderRadius: '100px', letterSpacing: '0.5px' }}>
              {session.subject}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#52525b', marginTop: '2px' }}>
            {session.student?.mobile} · {session.messages.length} mesej
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '700px', width: '100%', margin: '0 auto' }}>

        {session.messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#71717a', padding: '60px', fontSize: '13px' }}>Tiada mesej dalam sesi ini.</div>
        ) : (
          session.messages.map((msg) => {
            const isZed = msg.role === 'ZED';
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isZed ? 'flex-start' : 'flex-end' }}>
                <div style={{ fontSize: '10px', color: '#52525b', marginBottom: '3px', paddingLeft: isZed ? '4px' : '0', paddingRight: isZed ? '0' : '4px' }}>
                  {isZed ? '🤖 Zed' : `👤 ${session.student?.name}`} · {formatTime(msg.createdAt)}
                </div>
                <div style={{
                  maxWidth: '75%',
                  background: isZed ? 'rgba(124,58,237,0.08)' : 'rgba(0,212,255,0.06)',
                  border: isZed ? '1px solid rgba(124,58,237,0.15)' : '1px solid rgba(0,212,255,0.15)',
                  borderRadius: isZed ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  lineHeight: 1.6,
                  color: isZed ? '#c4b5fd' : '#e2e8f0',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {msg.content}
                </div>
                {msg.tokens && (
                  <div style={{ fontSize: '9px', color: '#3f3f46', marginTop: '2px', paddingRight: isZed ? '0' : '4px', paddingLeft: isZed ? '4px' : '0' }}>
                    {msg.tokens} tokens
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </main>
  );
}