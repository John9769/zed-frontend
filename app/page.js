'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main style={{ background: '#070714', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif', overflowX: 'hidden' }}>

      {/* NAVBAR */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: scrolled ? 'rgba(7,7,20,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? '1px solid rgba(0,212,255,0.1)' : 'none', transition: 'all 0.3s ease' }}>
        <div style={{ fontSize: '24px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ZED</div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button onClick={() => router.push('/login')} style={{ background: 'transparent', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff', padding: '8px 24px', borderRadius: '50px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Login</button>
          <button onClick={() => router.push('/register')} style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '8px 24px', borderRadius: '50px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, boxShadow: '0 0 20px rgba(0,212,255,0.4)' }}>Join Zed</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 32px 80px', background: 'radial-gradient(ellipse at top, #0d0d2b 0%, #070714 60%), radial-gradient(ellipse at bottom right, #1a0533 0%, transparent 60%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'rgba(0,212,255,0.08)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '400px', height: '400px', background: 'rgba(124,58,237,0.1)', borderRadius: '50%', filter: 'blur(100px)' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', alignItems: 'center', gap: '60px', position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-block', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '50px', padding: '6px 16px', fontSize: '12px', color: '#00d4ff', fontWeight: 600, marginBottom: '24px', letterSpacing: '2px' }}>
              🇲🇾 MALAYSIA'S FIRST AI STUDY BFF
            </div>
            <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 900, lineHeight: 1.1, marginBottom: '24px' }}>
              Meet{' '}
              <span style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ZED</span>
              <br />Your SPM{' '}
              <span style={{ background: 'linear-gradient(135deg, #ff2d78, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BFF</span>
            </h1>
            <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '16px', maxWidth: '480px' }}>
              Zed bukan sekadar AI tutor. Dia memahami bila anda penat, malas, atau stress — dan tetap ada untuk anda. 24/7. Tak pernah marah.
            </p>
            <p style={{ fontSize: '15px', color: '#00d4ff', marginBottom: '40px', fontWeight: 600 }}>
              ✦ Belajar SPM • Dapat duit balik • Tabung masa depan
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <button onClick={() => router.push('/register')} style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '16px 40px', borderRadius: '50px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 30px rgba(0,212,255,0.4)' }}>
                Daftar Sekarang →
              </button>
              <button onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '16px 40px', borderRadius: '50px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
                Tengok Harga
              </button>
            </div>

            <div style={{ marginTop: '48px', display: 'flex', gap: '32px' }}>
              {[
                { number: '10,000', label: 'Slots Pengasas' },
                { number: 'RM5', label: 'Kredit / Subjek / Rujukan' },
                { number: '24/7', label: 'Zed Sedia' }
              ].map((stat, i) => (
                <div key={i}>
                  <div style={{ fontSize: '24px', fontWeight: 900, color: '#00d4ff' }}>{stat.number}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative', order: -1 }}>
            <div style={{ position: 'relative', width: '420px', height: '520px', borderRadius: '24px', overflow: 'hidden', border: '1px solid rgba(0,212,255,0.2)', boxShadow: '0 0 60px rgba(0,212,255,0.2), 0 0 120px rgba(124,58,237,0.15)' }}>
              <video autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} poster="/assets/Zed.png">
                <source src="/assets/Zed.mp4" type="video/mp4" />
              </video>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '120px', background: 'linear-gradient(transparent, rgba(7,7,20,0.9))' }} />
              <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                <div style={{ fontSize: '14px', color: '#00d4ff', fontWeight: 700 }}>ZED</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>AI Study BFF untuk SPM anda 🧠</div>
              </div>
            </div>
            <div style={{ position: 'absolute', top: '20px', right: '-20px', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '12px', padding: '12px 16px', backdropFilter: 'blur(12px)' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎓</div>
              <div style={{ fontSize: '11px', color: '#00d4ff', fontWeight: 700 }}>First Adopter</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>10,000 slots sahaja</div>
            </div>
            <div style={{ position: 'absolute', bottom: '60px', left: '-20px', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', borderRadius: '12px', padding: '12px 16px', backdropFilter: 'blur(12px)' }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>💰</div>
              <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 700 }}>Zed Fund</div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>Tabung masa depan anda</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 32px', position: 'relative' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontSize: '12px', color: '#00d4ff', fontWeight: 700, letterSpacing: '3px', marginBottom: '16px' }}>MACAM MANA ZED WORKS</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900 }}>Simple je.<br /><span style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>4 langkah.</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
            {[
              { step: '01', icon: '📝', title: 'Daftar', desc: 'Pilih 1 subjek pada RM19.99/bulan. Isi nama, mobile, dan nombor WhatsApp ibu atau ayah.' },
              { step: '02', icon: '📱', title: 'Parent Approve', desc: 'Zed hantar WhatsApp ke parent anda. Dia buka link, baca pasal Zed, dan bayar.' },
              { step: '03', icon: '🧠', title: 'Mula Belajar', desc: 'Akaun terus aktif. Login dan mula chat dengan Zed untuk subjek anda. Tambah subjek bila-bila masa.' },
              { step: '04', icon: '💰', title: 'Refer & Earn', desc: 'Share referral code anda. Setiap subjek yang kawan subscribe — anda dapat RM5 setiap bulan.' }
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '20px', padding: '32px 24px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '64px', fontWeight: 900, color: 'rgba(0,212,255,0.06)', position: 'absolute', top: '16px', right: '16px', lineHeight: 1 }}>{item.step}</div>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ZED FUND */}
      <section style={{ padding: '100px 32px', background: 'radial-gradient(ellipse at center, #0d0533 0%, #070714 70%)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px' }}>💰</div>
          <div style={{ fontSize: '12px', color: '#7c3aed', fontWeight: 700, letterSpacing: '3px', marginBottom: '16px' }}>ZED FUND — TIADA TANDINGAN DI DUNIA</div>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 44px)', fontWeight: 900, marginBottom: '24px' }}>
            Belajar SPM.<br />
            <span style={{ background: 'linear-gradient(135deg, #ff2d78, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dapat duit balik.</span>
            <br />Tabung masa depan.
          </h2>
          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.8, marginBottom: '48px' }}>
            Refer kawan subscribe 3 subjek = RM15 sebulan masuk akaun anda. Dalam setahun, boleh ada RM180+ dalam Zed Fund. Lepas SPM — guna untuk yuran kolej, laptop, lesen memandu. Tiada pusat tuisyen mana-mana di Malaysia yang buat ni.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '48px' }}>
            {[
              { label: 'Setiap subjek', credit: 'RM5 / bulan', color: '#00d4ff' },
              { label: 'Kawan subscribe 3 subjek', credit: 'RM15 / bulan', color: '#7c3aed' },
              { label: '10 kawan × 3 subjek', credit: 'RM150 / bulan', color: '#ff2d78' }
            ].map((item, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}30`, borderRadius: '16px', padding: '24px 16px' }}>
                <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>{item.label}</div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: item.color }}>{item.credit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ fontSize: '12px', color: '#00d4ff', fontWeight: 700, letterSpacing: '3px', marginBottom: '16px' }}>HARGA PENGASAS — 10,000 SLOT SAHAJA</div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900 }}>
              Tuisyen 1 subjek = RM100+/bulan.{' '}
              <span style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Zed?</span>
            </h2>
          </div>

          {/* Single subject card */}
          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '24px', padding: '48px 40px', textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', padding: '4px 24px', borderRadius: '50px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                🎯 EARLY BIRD — TERHAD 10,000 PELAJAR PERTAMA
              </div>

              <div style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '8px' }}>Harga per subjek</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ fontSize: '48px', fontWeight: 900, color: '#00d4ff', lineHeight: 1 }}>RM19.99</div>
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>/bulan • Early Bird</div>
              <div style={{ fontSize: '13px', color: '#475569', textDecoration: 'line-through', marginBottom: '32px' }}>Harga biasa RM29.99/bulan</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px', textAlign: 'left' }}>
                {[
                  '✓ Pilih 1 subjek — Math, Add Math, Science, Biology, Physics atau Chemistry',
                  '✓ Zed BFF 24/7 — sabar, tak pernah marah',
                  '✓ Silibus KSSM Form 4 & Form 5',
                  '✓ SPM Past Year Checker',
                  '✓ Zed Fund RM5/subjek/rujukan',
                  '✓ Tambah subjek lain bila-bila masa'
                ].map((f, i) => (
                  <div key={i} style={{ fontSize: '14px', color: '#94a3b8' }}>{f}</div>
                ))}
              </div>

              <button onClick={() => router.push('/register')} style={{ width: '100%', background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 20px rgba(0,212,255,0.3)' }}>
                Cuba Zed Percuma →
              </button>
              <p style={{ fontSize: '12px', color: '#475569', marginTop: '12px' }}>5 mesej percuma. Tiada kad kredit diperlukan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '48px 32px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
        <div style={{ fontSize: '28px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>ZED</div>
        <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Malaysia's First AI Educational BFF untuk pelajar SPM.</p>
        <p style={{ fontSize: '12px', color: 'rgba(148,163,184,0.4)' }}>© 2026 Zed. All rights reserved.</p>
      </footer>

    </main>
  );
}