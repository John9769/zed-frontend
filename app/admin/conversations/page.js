'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SUBJECT_COLORS = {
  MATH: '#3b82f6',
  SCIENCE: '#10b981',
  BM: '#f59e0b',
  ENGLISH: '#8b5cf6',
  SEJARAH: '#ef4444'
};

const STATUS_COLORS = {
  ACTIVE: '#10b981',
  TRIAL: '#f59e0b',
  PENDING: '#94a3b8',
  SUSPENDED: '#ef4444',
  EXPIRED: '#64748b'
};

export default function AdminConversations() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ subject: '', studentId: '' });
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

  const navStyle = { display: 'flex', gap: '8px' };
  const navBtn = (label, path) => (
    <button onClick={() => router.push(path)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}>
      {label}
    </button>
  );

  return (
    <main style={{ background: '#070714', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#fff' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '18px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          ZED Admin
        </div>
        <div style={navStyle}>
          {navBtn('Dashboard', '/admin/dashboard')}
          {navBtn('Pelajar', '/admin/students')}
          {navBtn('Kandungan RAG', '/admin/content')}
          <button style={{ background: 'linear-gradient(135deg, #00d4ff22, #7c3aed22)', border: '1px solid #7c3aed55', color: '#a78bfa', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', fontWeight: 700 }}>
            Perbualan
          </button>
        </div>
      </div>

      <div style={{ padding: '32px' }}>

        {/* Title + Filter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '4px' }}>Perbualan Pelajar</h1>
            <p style={{ color: '#94a3b8', fontSize: '13px' }}>{pagination.total} sesi dijumpai</p>
          </div>
          <select
            value={filter.subject}
            onChange={(e) => setFilter({ ...filter, subject: e.target.value })}
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer' }}
          >
            <option value="">Semua Subjek</option>
            <option value="MATH">Math</option>
            <option value="SCIENCE">Science</option>
            <option value="BM">BM</option>
            <option value="ENGLISH">English</option>
            <option value="SEJARAH">Sejarah</option>
          </select>
        </div>

        {/* Sessions List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>Memuatkan...</div>
        ) : sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', color: '#94a3b8' }}>Tiada perbualan dijumpai.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => router.push(`/admin/conversations/${s.id}`)}
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Subject Badge */}
                  <div style={{ background: `${SUBJECT_COLORS[s.subject]}22`, border: `1px solid ${SUBJECT_COLORS[s.subject]}44`, borderRadius: '10px', padding: '8px 14px', fontSize: '12px', fontWeight: 700, color: SUBJECT_COLORS[s.subject], minWidth: '80px', textAlign: 'center' }}>
                    {s.subject}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{s.student?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{s.student?.mobile}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: '#00d4ff' }}>{s._count.messages}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>mesej</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>{formatDate(s.updatedAt)}</div>
                    <div style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', background: `${STATUS_COLORS[s.student?.status]}22`, color: STATUS_COLORS[s.student?.status], display: 'inline-block' }}>
                      {s.student?.status}
                    </div>
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '18px' }}>›</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => fetchSessions(p)} style={{ background: p === pagination.page ? 'linear-gradient(135deg, #00d4ff, #7c3aed)' : 'rgba(255,255,255,0.05)', border: 'none', color: '#fff', width: '36px', height: '36px', borderRadius: '8px', cursor: 'pointer', fontWeight: p === pagination.page ? 700 : 400 }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}