'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

const SUBJECT_COLORS = {
  MATH: '#3b82f6',
  SCIENCE: '#10b981',
  BM: '#f59e0b',
  ENGLISH: '#8b5cf6',
  SEJARAH: '#ef4444'
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
    <main style={{ background: '#070714', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#94a3b8' }}>
      Memuatkan perbualan...
    </main>
  );

  if (!session) return (
    <main style={{ background: '#070714', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif', color: '#ef4444' }}>
      Sesi tidak dijumpai.
    </main>
  );

  const subjectColor = SUBJECT_COLORS[session.subject] || '#7c3aed';

  return (
    <main style={{ background: '#070714', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#fff', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', position: 'sticky', top: 0, background: '#070714', zIndex: 10 }}>
        <button onClick={() => router.push('/admin/conversations')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '8px 14px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
          ← Balik
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 900, fontSize: '16px' }}>{session.student?.name}</span>
            <span style={{ background: `${subjectColor}22`, border: `1px solid ${subjectColor}44`, color: subjectColor, fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
              {session.subject}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
            {session.student?.mobile} · {session.messages.length} mesej
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '800px', width: '100%', margin: '0 auto' }}>

        {session.messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '80px' }}>Tiada mesej dalam sesi ini.</div>
        ) : (
          session.messages.map((msg) => {
            const isZed = msg.role === 'ZED';
            return (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: isZed ? 'flex-start' : 'flex-end' }}>
                <div style={{ fontSize: '11px', color: '#475569', marginBottom: '4px', paddingLeft: isZed ? '4px' : '0', paddingRight: isZed ? '0' : '4px' }}>
                  {isZed ? '🤖 Zed' : `👤 ${session.student?.name}`} · {formatTime(msg.createdAt)}
                </div>
                <div style={{
                  maxWidth: '72%',
                  background: isZed ? 'rgba(124,58,237,0.12)' : 'rgba(0,212,255,0.08)',
                  border: isZed ? '1px solid rgba(124,58,237,0.25)' : '1px solid rgba(0,212,255,0.2)',
                  borderRadius: isZed ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  color: isZed ? '#c4b5fd' : '#e2e8f0',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {msg.content}
                </div>
                {msg.tokens && (
                  <div style={{ fontSize: '10px', color: '#334155', marginTop: '2px', paddingRight: isZed ? '0' : '4px', paddingLeft: isZed ? '4px' : '0' }}>
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