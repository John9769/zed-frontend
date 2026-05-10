'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const glass = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.08)',
};

const statusColor = {
  ACTIVE: '#10b981',
  TRIAL: '#00d4ff',
  PENDING: '#f59e0b',
  SUSPENDED: '#ff2d78',
  EXPIRED: '#52525b'
};

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
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/students/${studentId}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchStudents(token);
    } catch (err) {
      alert('Tindakan gagal.');
    }
  };

  return (
    <main style={{ background: '#050508', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      <style jsx global>{`
        input::placeholder { color: #52525b; }
        input:focus { border-color: rgba(0,212,255,0.3) !important; outline: none; }
        select option { background: #0a0a12; color: #fff; }
      `}</style>

      {/* Nav */}
      <nav style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(5,5,8,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => router.push('/admin/dashboard')} style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '18px' }}>←</button>
          <div style={{ fontSize: '16px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.5px' }}>Pengurusan Pelajar</div>
        </div>
        <div style={{ fontSize: '11px', color: '#71717a', fontWeight: 700 }}>Jumlah: {total}</div>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px 16px' }}>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchStudents()}
            placeholder="Cari nama atau mobile..."
            style={{ flex: 1, minWidth: '180px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '8px 12px', color: '#fff', fontSize: '12px', fontFamily: 'Inter, sans-serif' }}
          />
          {['', 'ACTIVE', 'TRIAL', 'PENDING', 'SUSPENDED', 'EXPIRED'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ background: statusFilter === s ? 'rgba(0,212,255,0.08)' : 'rgba(255,255,255,0.03)', border: `1px solid ${statusFilter === s ? 'rgba(0,212,255,0.25)' : 'rgba(255,255,255,0.08)'}`, color: statusFilter === s ? '#00d4ff' : '#71717a', padding: '8px 12px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', fontWeight: statusFilter === s ? 800 : 400, fontFamily: 'Inter, sans-serif' }}>
              {s || 'Semua'}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#71717a', padding: '40px', fontSize: '13px' }}>Loading...</div>
        ) : (
          <div style={{ ...glass, borderRadius: '14px', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '10px 16px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '9px', color: '#52525b', fontWeight: 800, letterSpacing: '0.5px' }}>
              <div>PELAJAR</div>
              <div>SUBJEK</div>
              <div>STATUS</div>
              <div>ADOPTER</div>
              <div>TINDAKAN</div>
            </div>

            {students.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#71717a', fontSize: '13px' }}>Tiada pelajar dijumpai.</div>
            ) : (
              students.map((s, i) => (
                <div key={s.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr', padding: '12px 16px', borderBottom: i < students.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', alignItems: 'center', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#fff', marginBottom: '2px' }}>{s.name}</div>
                    <div style={{ fontSize: '10px', color: '#71717a' }}>{s.mobile}</div>
                    <div style={{ fontSize: '10px', color: '#52525b' }}>Parent: {s.parent?.name}</div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#a1a1aa' }}>
                    {s.subscriptions?.length > 0
                      ? s.subscriptions.map(sub => sub.subject).join(', ')
                      : '—'}
                  </div>
                  <div>
                    <span style={{ background: `${statusColor[s.status] || '#52525b'}12`, border: `1px solid ${statusColor[s.status] || '#52525b'}25`, color: statusColor[s.status] || '#52525b', padding: '3px 8px', borderRadius: '100px', fontSize: '9px', fontWeight: 800, letterSpacing: '0.3px' }}>
                      {s.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: s.isFirstAdopter ? '#00d4ff' : '#52525b', fontWeight: s.isFirstAdopter ? 800 : 400 }}>
                    {s.isFirstAdopter ? '⭐ Ya' : '—'}
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {s.status === 'ACTIVE' && (
                      <button onClick={() => handleAction(s.id, 'suspend')} style={{ background: 'rgba(255,45,120,0.06)', border: '1px solid rgba(255,45,120,0.15)', color: '#ff2d78', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                        Gantung
                      </button>
                    )}
                    {(s.status === 'PENDING' || s.status === 'SUSPENDED' || s.status === 'TRIAL') && (
                      <button onClick={() => handleAction(s.id, 'activate')} style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', cursor: 'pointer', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
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
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ ...glass, color: '#a1a1aa', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontFamily: 'Inter, sans-serif', border: '1px solid rgba(255,255,255,0.08)' }}>← Prev</button>
            <span style={{ padding: '7px 14px', color: '#71717a', fontSize: '12px' }}>Halaman {page}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= total} style={{ ...glass, color: '#a1a1aa', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontFamily: 'Inter, sans-serif', border: '1px solid rgba(255,255,255,0.08)' }}>Next →</button>
          </div>
        )}
      </div>
    </main>
  );
}