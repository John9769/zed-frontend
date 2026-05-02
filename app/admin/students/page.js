'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AdminStudents() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('zed_admin_token');
    if (!token) { router.push('/admin'); return; }
    fetchStudents(token);
  }, [page, statusFilter]);

  const fetchStudents = async (token) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.append('status', statusFilter);
      if (search) params.append('search', search);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/students?${params}`, {
        headers: { Authorization: `Bearer ${token || localStorage.getItem('zed_admin_token')}` }
      });
      setStudents(res.data.students);
      setTotal(res.data.pagination.total);
    } catch (err) {
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (studentId, action) => {
    const token = localStorage.getItem('zed_admin_token');
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/students/${studentId}/${action}`;
      await axios.put(url, {}, { headers: { Authorization: `Bearer ${token}` } });
      fetchStudents(token);
    } catch (err) {
      alert('Tindakan gagal.');
    }
  };

  const statusColor = { ACTIVE: '#10b981', PENDING: '#f59e0b', SUSPENDED: '#ff2d78', EXPIRED: '#94a3b8' };

  return (
    <main style={{ background: '#070714', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      <nav style={{ padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(7,7,20,0.95)', borderBottom: '1px solid rgba(0,212,255,0.1)', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/admin/dashboard')} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '20px' }}>←</button>
          <div style={{ fontSize: '18px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Pengurusan Pelajar</div>
        </div>
        <div style={{ fontSize: '14px', color: '#94a3b8' }}>Jumlah: {total}</div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px' }}>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchStudents()}
            placeholder="Cari nama atau mobile..."
            style={{ flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px 16px', color: '#fff', fontSize: '14px', outline: 'none' }}
          />
          {['', 'ACTIVE', 'PENDING', 'SUSPENDED', 'EXPIRED'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ background: statusFilter === s ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${statusFilter === s ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.1)'}`, color: statusFilter === s ? '#00d4ff' : '#94a3b8', padding: '10px 16px', borderRadius: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
              {s || 'Semua'}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Loading...</div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>
              <div>Pelajar</div>
              <div>Plan</div>
              <div>Status</div>
              <div>First Adopter</div>
              <div>Tindakan</div>
            </div>

            {students.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>Tiada pelajar dijumpai.</div>
            ) : (
              students.map((s, i) => (
                <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', padding: '16px 20px', borderBottom: i < students.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{s.name}</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8' }}>{s.mobile}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Parent: {s.parent?.name}</div>
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                    {s.subscription?.tier === 'FIVE_SUBJECTS' ? '5 Subjek' : s.subscription?.tier === 'THREE_SUBJECTS' ? '3 Subjek' : '—'}
                  </div>
                  <div>
                    <span style={{ background: `${statusColor[s.status]}15`, border: `1px solid ${statusColor[s.status]}30`, color: statusColor[s.status], padding: '4px 10px', borderRadius: '50px', fontSize: '11px', fontWeight: 700 }}>
                      {s.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: s.isFirstAdopter ? '#00d4ff' : '#94a3b8' }}>
                    {s.isFirstAdopter ? '⭐ Ya' : '—'}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {s.status === 'ACTIVE' && (
                      <button onClick={() => handleAction(s.id, 'suspend')} style={{ background: 'rgba(255,45,120,0.1)', border: '1px solid rgba(255,45,120,0.2)', color: '#ff2d78', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>
                        Gantung
                      </button>
                    )}
                    {(s.status === 'PENDING' || s.status === 'SUSPENDED') && (
                      <button onClick={() => handleAction(s.id, 'activate')} style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>
                        Aktifkan
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {total > 20 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '24px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>← Prev</button>
            <span style={{ padding: '8px 16px', color: '#94a3b8', fontSize: '14px' }}>Halaman {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Next →</button>
          </div>
        )}
      </div>
    </main>
  );
}