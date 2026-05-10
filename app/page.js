'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const glassStyle = {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  };

  return (
    <main style={{ background: '#050508', minHeight: '100vh', color: '#fff', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' }}>
      
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
        .btn-hover:hover { transform: translateY(-2px); filter: brightness(1.2); transition: all 0.2s; }
        @media (max-width: 480px) {
            .hero-btns { flex-direction: row !important; gap: 8px !important; }
            .hero-btns button { padding: 12px 16px !important; font-size: 13px !important; flex: 1; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, 
        padding: scrolled ? '10px 20px' : '20px 20px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        background: scrolled ? 'rgba(5,5,8,0.8)' : 'transparent', 
        backdropFilter: scrolled ? 'blur(10px)' : 'none', 
        transition: 'all 0.3s ease' 
      }}>
        <div style={{ fontSize: '22px', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ZED</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => router.push('/login')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>Login</button>
          <button onClick={() => router.push('/register')} style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 700 }}>Join Zed</button>
        </div>
      </nav>

      {/* HERO SECTION - REENGINEERED SPACING */}
      <section style={{ 
        padding: '80px 20px 40px', 
        background: 'radial-gradient(circle at 50% 0%, #15152e 0%, #050508 50%)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          
          {/* SS1: Badge pushed UP */}
          <div style={{ display: 'inline-flex', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '100px', padding: '6px 14px', fontSize: '10px', color: '#00d4ff', fontWeight: 800, marginBottom: '16px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            🇲🇾 Malaysia's First AI Study BFF
          </div>

          {/* SS1: Heading pushed UP */}
          <h1 style={{ fontSize: 'clamp(40px, 10vw, 72px)', fontWeight: 900, lineHeight: 0.9, marginBottom: '20px', letterSpacing: '-2px' }}>
            Meet <span style={{ background: 'linear-gradient(to right, #00d4ff, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ZED</span><br />
            Your SPM <span style={{ background: 'linear-gradient(to right, #ff2d78, #ff82b2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BFF</span>
          </h1>

          {/* SS1: Video pushed UP */}
          <div style={{ maxWidth: '400px', margin: '0 auto 30px', ...glassStyle, borderRadius: '24px', padding: '6px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
            <video autoPlay muted playsInline style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: '18px' }} poster="/assets/Zed.png">
              <source src="/assets/Zed.mp4" type="video/mp4" />
            </video>
          </div>

          {/* SS2: Text and Buttons Refined */}
          <p style={{ fontSize: '16px', color: '#a1a1aa', lineHeight: 1.5, marginBottom: '20px', maxWidth: '500px', margin: '0 auto 20px' }}>
            Zed bukan sekadar AI tutor. Dia memahami bila anda penat, malas, atau stress — dan tetap ada untuk anda. 24/7. Tak pernah marah.
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
            <span style={{ color: '#00d4ff', fontSize: '18px' }}>✦</span>
            <p style={{ fontSize: '14px', color: '#00d4ff', fontWeight: 700, margin: 0 }}>
              Belajar SPM • Dapat duit balik • Tabung masa depan
            </p>
          </div>

          {/* SS2: Side-by-Side Buttons */}
          <div className="hero-btns" style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
            <button className="btn-hover" onClick={() => router.push('/register')} style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '16px 32px', borderRadius: '12px', fontSize: '15px', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,212,255,0.2)' }}>
              Daftar Sekarang →
            </button>
            <button className="btn-hover" onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '16px 32px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>
              Tengok Harga
            </button>
          </div>

          {/* Compact Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
            {[
              { n: '10,000', l: 'SLOTS PENGASAS' },
              { n: 'RM5', l: 'KREDIT/SUBJEK' },
              { n: '24/7', l: 'ZED SEDIA' }
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: '20px', fontWeight: 900 }}>{s.n}</div>
                <div style={{ fontSize: '9px', color: '#71717a', fontWeight: 800, letterSpacing: '1px' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS - REDUCED GAPS */}
      <section style={{ padding: '40px 20px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '11px', color: '#00d4ff', fontWeight: 800, letterSpacing: '3px', marginBottom: '8px' }}>MACAM MANA ZED WORKS</div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1px' }}>Simple je. <span style={{ color: '#7c3aed' }}>4 langkah.</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { s: '01', i: '📝', t: 'Daftar', d: 'Pilih 1 subjek pada RM19.99/bulan. Isi nama, mobile, dan nombor WhatsApp ibu atau ayah.' },
              { s: '02', i: '📱', t: 'Parent Approve', d: 'Zed hantar WhatsApp ke parent anda. Dia buka link, baca pasal Zed, dan bayar.' },
              { s: '03', i: '🧠', t: 'Mula Belajar', d: 'Akaun terus aktif. Login dan mula chat dengan Zed untuk subjek anda.' },
              { s: '04', i: '💰', t: 'Refer & Earn', d: 'Share referral code anda. Setiap subjek kawan subscribe — anda dapat RM5 sebulan.' }
            ].map((item, i) => (
              <div key={i} style={{ ...glassStyle, padding: '24px', borderRadius: '20px' }}>
                <div style={{ fontSize: '32px', fontWeight: 900, color: 'rgba(255,255,255,0.03)', position: 'absolute', top: '10px', right: '15px' }}>{item.s}</div>
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{item.i}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '8px' }}>{item.t}</h3>
                <p style={{ fontSize: '13px', color: '#a1a1aa', lineHeight: 1.4 }}>{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SS3: ZED FUND - TIGHTENED & REFORMATTED */}
      <section style={{ padding: '60px 20px', background: 'linear-gradient(to bottom, #050508, #0d0525, #050508)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          {/* SS3: Pushed up to cover unused space */}
          <div style={{ fontSize: '48px', marginBottom: '10px' }}>💰</div>
          <div style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 800, letterSpacing: '3px', marginBottom: '16px' }}>ZED FUND — TIADA TANDINGAN DI DUNIA</div>
          
          {/* SS3: Center aligned, separate lines, world-class typography */}
          <h2 style={{ fontSize: 'clamp(28px, 8vw, 48px)', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '24px' }}>
            Belajar SPM.<br />
            <span style={{ background: 'linear-gradient(135deg, #ff2d78, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dapat Duit Balik.</span><br />
            Tabung Masa Depan.
          </h2>

          <p style={{ fontSize: '15px', color: '#a1a1aa', lineHeight: 1.6, marginBottom: '32px' }}>
            Refer kawan subscribe 3 subjek = RM15 sebulan masuk akaun anda. Dalam setahun, boleh ada RM180+ dalam Zed Fund. Lepas SPM — guna untuk yuran kolej, laptop, lesen memandu.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {[
              { l: 'Per Subjek', c: 'RM5', clr: '#00d4ff' },
              { l: '3 Subjek', c: 'RM15', clr: '#7c3aed' },
              { l: '10 Kawan', c: 'RM150', clr: '#ff2d78' }
            ].map((item, i) => (
              <div key={i} style={{ ...glassStyle, borderRadius: '12px', padding: '16px 8px' }}>
                <div style={{ fontSize: '10px', color: '#71717a', fontWeight: 700, marginBottom: '4px' }}>{item.l}</div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: item.clr }}>{item.c}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SS4: PRICING - REMOVED TOP SPACE, REDUCED FONT */}
      <section id="pricing" style={{ padding: '40px 20px 80px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
          {/* SS4: Pushed up */}
          <div style={{ fontSize: '11px', color: '#00d4ff', fontWeight: 800, letterSpacing: '3px', marginBottom: '12px' }}>HARGA PENGASAS — 10,000 SLOT SAHAJA</div>
          <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '30px', letterSpacing: '-1px' }}>
            Tuisyen 1 subjek = RM100+/bulan. <span style={{ color: '#00d4ff' }}>Zed?</span>
          </h2>
          
          <div style={{ maxWidth: '400px', margin: '0 auto', ...glassStyle, borderRadius: '24px', padding: '40px 24px', position: 'relative', border: '1px solid rgba(0,212,255,0.3)' }}>
            <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', padding: '4px 16px', borderRadius: '100px', fontSize: '10px', fontWeight: 900, whiteSpace: 'nowrap' }}>
              🎯 EARLY BIRD SPECIAL
            </div>
            <div style={{ fontSize: '13px', color: '#71717a', fontWeight: 600 }}>Harga per subjek</div>
            
            {/* SS4: Reduced font size from 64px to 48px */}
            <div style={{ fontSize: '48px', fontWeight: 900, color: '#fff', lineHeight: 1, margin: '8px 0 4px' }}>RM19.99</div>
            
            <div style={{ fontSize: '14px', color: '#00d4ff', fontWeight: 700, marginBottom: '4px' }}>/bulan • Early Bird</div>
            <div style={{ fontSize: '12px', color: '#444', textDecoration: 'line-through', marginBottom: '24px', fontWeight: 700 }}>Harga biasa RM29.99/bulan</div>
            
            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
              {[
                '✓ Math, Add Math, Science, Bio, Physics, Chem',
                '✓ Zed BFF 24/7 — Sabar & Tak Marah',
                '✓ Silibus KSSM Form 4 & Form 5',
                '✓ SPM Past Year Checker',
                '✓ Zed Fund RM5/subjek/rujukan'
              ].map((f, i) => (
                <div key={i} style={{ fontSize: '13px', color: '#a1a1aa', display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#00d4ff' }}>✓</span> {f.replace('✓ ', '')}
                </div>
              ))}
            </div>
            
            <button onClick={() => router.push('/register')} style={{ width: '100%', background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', border: 'none', color: '#fff', padding: '16px', borderRadius: '12px', fontSize: '15px', fontWeight: 800, cursor: 'pointer' }}>
              Cuba Zed Percuma →
            </button>
            <p style={{ fontSize: '11px', color: '#555', marginTop: '12px' }}>5 mesej percuma. Tiada kad kredit diperlukan.</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '40px 20px', borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
        <div style={{ fontSize: '20px', fontWeight: 900, color: '#00d4ff', marginBottom: '8px' }}>ZED</div>
        <p style={{ fontSize: '12px', color: '#71717a' }}>© 2026 Zed. All rights reserved.</p>
      </footer>

    </main>
  );
}