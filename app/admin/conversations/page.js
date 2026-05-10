'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SUBJECT_COLORS = {
  MATH: '#ff2d78',
  ADD_MATH: '#00d4ff',
  SCIENCE: '#10b981',
  BIOLOGY: '#84cc16',
  PHYSICS: '#f59e0b',
  CHEMISTRY: '#a78bfa'
};

const STATUS_COLORS = {
  ACTIVE: '#10b981',
  TRIAL: '#f59e0b',
  PENDING: '#a1a1aa',
  SUSPENDED: '#ff2d78',
  EXPIRED: '#52525b'
};

const glass = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
};

export default function AdminConversations() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ subject: '' });
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });

  useEffect(() => {
    const token = localStorage.getItem('zed_admin_token');
    if (!token) { router.push('/admin'); return; }
    fetchSessions(1);
  }, []);

  const fetchSessions = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('zed_admin_token');
      const params = new URLSearchParams({ page, limit: 20 });
      if (filter.subject) params.append('subject', filter.subject);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/conversations?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSessions(res.data.sessions);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (d) => new Date(d).toLocaleString('en-MY', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <main style={{ background: '#050508', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      <style jsx global>{`
        select option { background: #0a0a12; color: #fff; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ fontSize: '18px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>ZED Admin</div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[
            { label: 'Dashboard', path: '/admin/dashboard' },
            { label: 'Pelajar', path: '/admin/students' },
            { label: 'RAG', path: '/admin/content' },
          ].map(btn => (
            <button key={btn.path} onClick={() => router.push(btn.path)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#71717a', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              {btn.label}
            </button>
          ))}
          <button style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}>
            Perbualan
          </button>
        </div>
      </div>

      <div style={{ padding: '20px 16px', maxWidth: '900px', margin: '0 auto' }}>

        {/* Title + Filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '2px', letterSpacing: '-0.5px' }}>Perbualan Pelajar</h1>
            <p style={{ color: '#71717a', fontSize: '11px' }}>{pagination.total} sesi dijumpai</p>
          </div>
          <select
            value={filter.subject}
            onChange={(e) => { setFilter({ ...filter, subject: e.target.value }); fetchSessions(1); }}
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            <option value="">Semua Subjek</option>
            <option value="MATH">Math</option>
            <option value="ADD_MATH">Add Math</option>
            <option value="SCIENCE">Science</option>
            <option value="BIOLOGY">Biology</option>
            <option value="PHYSICS">Physics</option>
            <option value="CHEMISTRY">Chemistry</option>
          </select>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#71717a', fontSize: '13px' }}>Memuatkan...</div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#71717a', fontSize: '13px' }}>Tiada perbualan dijumpai.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => router.push(`/admin/conversations/${s.id}`)}
                style={{ ...glass, borderRadius: '12px', padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ background: `${SUBJECT_COLORS[s.subject] || '#7c3aed'}12`, border: `1px solid ${SUBJECT_COLORS[s.subject] || '#7c3aed'}25`, borderRadius: '8px', padding: '5px 10px', fontSize: '10px', fontWeight: 800, color: SUBJECT_COLORS[s.subject] || '#7c3aed', letterSpacing: '0.5px' }}>
                    {s.subject}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '13px', marginBottom: '2px', letterSpacing: '-0.3px' }}>{s.student?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '11px', color: '#52525b' }}>{s.student?.mobile}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#00d4ff' }}>{s._count.messages}</div>
                    <div style={{ fontSize: '10px', color: '#52525b' }}>mesej</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', color: '#71717a', marginBottom: '4px' }}>{formatDate(s.updatedAt)}</div>
                    <div style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '100px', background: `${STATUS_COLORS[s.student?.status]}15`, color: STATUS_COLORS[s.student?.status], display: 'inline-block', fontWeight: 800 }}>
                      {s.student?.status}
                    </div>
                  </div>
                  <div style={{ color: '#52525b', fontSize: '16px' }}>›</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '24px' }}>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => fetchSessions(p)} style={{ background: p === pagination.page ? 'linear-gradient(135deg, #00d4ff, #7c3aed)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: p === pagination.page ? 800 : 400, fontFamily: 'Inter, sans-serif' }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}