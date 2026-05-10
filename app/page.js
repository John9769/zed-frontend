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

  // World-Class Design System Constants
  const colors = {
    bg: '#030303',
    card: 'rgba(255, 255, 255, 0.03)',
    border: 'rgba(255, 255, 255, 0.08)',
    primary: '#00d4ff',
    secondary: '#7c3aed',
    accent: '#ff2d78',
    textMuted: '#a1a1aa'
  };

  const glassEffect = {
    background: colors.card,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: `1px solid ${colors.border}`,
  };

  return (
    <main style={{ background: colors.bg, minHeight: '100vh', color: '#fff', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' }}>
      
      {/* GLOBAL REFINEMENTS */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        button { transition: transform 0.2s ease, filter 0.2s ease !important; }
        button:hover { transform: translateY(-1px); filter: brightness(1.2); }
        button:active { transform: translateY(0px); }
        .feature-card:hover { border-color: ${colors.primary}40 !important; transform: translateY(-2px); }
        @media (max-width: 768px) {
          .desktop-video { display: none !important; }
          .mobile-video { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-video { display: none !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, 
        padding: scrolled ? '12px 32px' : '24px 32px', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        background: scrolled ? 'rgba(3, 3, 3, 0.7)' : 'transparent', 
        backdropFilter: scrolled ? 'blur(20px)' : 'none', 
        borderBottom: scrolled ? `1px solid ${colors.border}` : 'none', 
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
      }}>
        <div style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-1.5px', background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ZED</div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => router.push('/login')} style={{ background: 'transparent', border: `1px solid ${colors.border}`, color: '#fff', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Login</button>
          <button onClick={() => router.push('/register')} style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, border: 'none', color: '#fff', padding: '10px 24px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px', fontWeight: 700, boxShadow: `0 4px 20px ${colors.primary}30` }}>Join Zed</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{ 
        minHeight: '90vh', padding: '140px 24px 60px', 
        background: 'radial-gradient(circle at 50% 0%, #111122 0%, #030303 60%)',
        position: 'relative' 
      }}>
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '35vw', height: '35vw', background: `${colors.primary}08`, borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px', flexWrap: 'wrap' }}>
            
            <div style={{ flex: '1.2', minWidth: '320px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: `${colors.primary}15`, border: `1px solid ${colors.primary}30`, borderRadius: '100px', padding: '6px 14px', fontSize: '11px', color: colors.primary, fontWeight: 800, marginBottom: '24px', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                🇲🇾 Malaysia's First AI Study BFF
              </div>

              <h1 style={{ fontSize: 'clamp(42px, 7vw, 84px)', fontWeight: 900, lineHeight: 1, marginBottom: '24px', letterSpacing: '-3px' }}>
                Meet{' '}
                <span style={{ background: `linear-gradient(to right, ${colors.primary}, ${colors.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ZED</span>
                <br />Your SPM{' '}
                <span style={{ background: `linear-gradient(to right, ${colors.accent}, #ff82b2)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BFF</span>
              </h1>

              {/* MOBILE VIDEO */}
              <div className="mobile-video" style={{ marginBottom: '32px' }}>
                <div style={{ ...glassEffect, borderRadius: '24px', overflow: 'hidden', padding: '6px' }}>
                  <video autoPlay muted playsInline style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '18px' }} poster="/assets/Zed.png">
                    <source src="/assets/Zed.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>

              <p style={{ fontSize: '18px', color: colors.textMuted, lineHeight: 1.6, marginBottom: '24px', maxWidth: '500px' }}>
                Zed bukan sekadar AI tutor. Dia memahami bila anda penat, malas, atau stress — dan tetap ada untuk anda. 24/7. Tak pernah marah.
              </p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: colors.primary, boxShadow: `0 0 12px ${colors.primary}` }} />
                <p style={{ fontSize: '15px', color: colors.primary, fontWeight: 700, margin: 0 }}>
                  ✦ Belajar SPM • Dapat duit balik • Tabung masa depan
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button onClick={() => router.push('/register')} style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, border: 'none', color: '#fff', padding: '16px 36px', borderRadius: '14px', fontSize: '16px', fontWeight: 800, cursor: 'pointer', boxShadow: `0 10px 30px ${colors.primary}30` }}>
                  Daftar Sekarang →
                </button>
                <button onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })} style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${colors.border}`, color: '#fff', padding: '16px 36px', borderRadius: '14px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}>
                  Tengok Harga
                </button>
              </div>

              <div style={{ marginTop: '48px', display: 'flex', gap: '32px' }}>
                {[
                  { number: '10,000', label: 'Slots Pengasas' },
                  { number: 'RM5', label: 'Kredit/Subjek' },
                  { number: '24/7', label: 'Zed Sedia' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div style={{ fontSize: '24px', fontWeight: 900, color: '#fff' }}>{stat.number}</div>
                    <div style={{ fontSize: '11px', color: colors.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* DESKTOP VIDEO */}
            <div className="desktop-video" style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', position: 'relative' }}>
              <div style={{ ...glassEffect, padding: '10px', borderRadius: '32px', width: '380px', position: 'relative', zIndex: 2 }}>
                 <video autoPlay muted playsInline style={{ width: '100%', height: '520px', objectFit: 'cover', borderRadius: '24px' }} poster="/assets/Zed.png">
                  <source src="/assets/Zed.mp4" type="video/mp4" />
                </video>
              </div>
              {/* Floating Element 1 */}
              <div style={{ position: 'absolute', top: '40px', right: '-30px', ...glassEffect, borderRadius: '16px', padding: '16px', zIndex: 3, width: '140px' }}>
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>🎓</div>
                <div style={{ fontSize: '12px', color: colors.primary, fontWeight: 800 }}>First Adopter</div>
                <div style={{ fontSize: '10px', color: colors.textMuted }}>10,000 slots sahaja</div>
              </div>
              {/* Floating Element 2 */}
              <div style={{ position: 'absolute', bottom: '60px', left: '-20px', ...glassEffect, borderRadius: '16px', padding: '16px', zIndex: 3, border: `1px solid ${colors.secondary}40` }}>
                <div style={{ fontSize: '20px', marginBottom: '4px' }}>💰</div>
                <div style={{ fontSize: '12px', color: colors.secondary, fontWeight: 800 }}>Zed Fund</div>
                <div style={{ fontSize: '10px', color: colors.textMuted }}>Tabung masa depan</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontSize: '13px', color: colors.primary, fontWeight: 800, letterSpacing: '4px', marginBottom: '12px' }}>MACAM MANA ZED WORKS</div>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-2px' }}>
              Simple je. <span style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>4 langkah.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { step: '01', icon: '📝', title: 'Daftar', desc: 'Pilih 1 subjek pada RM19.99/bulan. Isi nama, mobile, dan nombor WhatsApp ibu atau ayah.' },
              { step: '02', icon: '📱', title: 'Parent Approve', desc: 'Zed hantar WhatsApp ke parent anda. Dia buka link, baca pasal Zed, dan bayar.' },
              { step: '03', icon: '🧠', title: 'Mula Belajar', desc: 'Akaun terus aktif. Login dan mula chat dengan Zed untuk subjek anda. Tambah subjek bila-bila masa.' },
              { step: '04', icon: '💰', title: 'Refer & Earn', desc: 'Share referral code anda. Setiap subjek yang kawan subscribe — anda dapat RM5 setiap bulan.' }
            ].map((item, i) => (
              <div key={i} className="feature-card" style={{ ...glassEffect, padding: '32px', borderRadius: '24px', position: 'relative', transition: 'all 0.3s ease' }}>
                <div style={{ fontSize: '50px', fontWeight: 900, color: 'rgba(255,255,255,0.03)', position: 'absolute', top: '10px', right: '20px' }}>{item.step}</div>
                <div style={{ fontSize: '36px', marginBottom: '20px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '19px', fontWeight: 700, marginBottom: '12px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: colors.textMuted, lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ZED FUND */}
      <section style={{ padding: '100px 24px', background: `radial-gradient(circle at center, #0d0525 0%, ${colors.bg} 100%)` }}>
        <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '20px' }}>💰</div>
          <div style={{ fontSize: '12px', color: colors.secondary, fontWeight: 800, letterSpacing: '4px', marginBottom: '16px' }}>ZED FUND — TIADA TANDINGAN DI DUNIA</div>
          <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 900, marginBottom: '24px', lineHeight: 1.1, letterSpacing: '-2px' }}>
            Belajar SPM. <span style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Dapat duit balik.</span><br/>Tabung masa depan.
          </h2>
          <p style={{ fontSize: '17px', color: colors.textMuted, lineHeight: 1.7, marginBottom: '40px' }}>
            Refer kawan subscribe 3 subjek = RM15 sebulan masuk akaun anda. Dalam setahun, boleh ada RM180+ dalam Zed Fund. Lepas SPM — guna untuk yuran kolej, laptop, lesen memandu. Tiada pusat tuisyen mana-mana di Malaysia yang buat ni.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
            {[
              { label: 'Setiap subjek', credit: 'RM5/bulan', color: colors.primary },
              { label: 'Kawan 3 subjek', credit: 'RM15/bulan', color: colors.secondary },
              { label: '10 kawan × 3', credit: 'RM150/bulan', color: colors.accent }
            ].map((item, i) => (
              <div key={i} style={{ ...glassEffect, borderRadius: '20px', padding: '24px 16px', border: `1px solid ${item.color}30` }}>
                <div style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '8px', fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: item.color }}>{item.credit}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ fontSize: '13px', color: colors.primary, fontWeight: 800, letterSpacing: '4px', marginBottom: '16px' }}>HARGA PENGASAS — 10,000 SLOT SAHAJA</div>
            <h2 style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-1.5px' }}>
              Tuisyen 1 subjek = RM100+/bulan. <span style={{ color: colors.primary }}>Zed?</span>
            </h2>
          </div>
          
          <div style={{ maxWidth: '440px', margin: '0 auto' }}>
            <div style={{ ...glassEffect, borderRadius: '32px', padding: '50px 32px', textAlign: 'center', position: 'relative', border: `1px solid ${colors.primary}40` }}>
              <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, padding: '8px 24px', borderRadius: '100px', fontSize: '11px', fontWeight: 900, whiteSpace: 'nowrap', boxShadow: `0 4px 20px rgba(0,0,0,0.6)` }}>
                🎯 EARLY BIRD — TERHAD 10,000 PELAJAR PERTAMA
              </div>
              <div style={{ fontSize: '14px', color: colors.textMuted, marginBottom: '8px', fontWeight: 600 }}>Harga per subjek</div>
              <div style={{ fontSize: '64px', fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: '4px', letterSpacing: '-3px' }}>RM19.99</div>
              <div style={{ fontSize: '15px', color: colors.primary, marginBottom: '4px', fontWeight: 800 }}>/bulan • Early Bird</div>
              <div style={{ fontSize: '14px', color: '#444', textDecoration: 'line-through', marginBottom: '32px', fontWeight: 600 }}>Harga biasa RM29.99/bulan</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px', textAlign: 'left' }}>
                {[
                  '✓ Pilih 1 subjek — Math, Add Math, Science, Biology, Physics atau Chemistry',
                  '✓ Zed BFF 24/7 — sabar, tak pernah marah',
                  '✓ Silibus KSSM Form 4 & Form 5',
                  '✓ SPM Past Year Checker',
                  '✓ Zed Fund RM5/subjek/rujukan',
                  '✓ Tambah subjek lain bila-bila masa'
                ].map((f, i) => (
                  <div key={i} style={{ fontSize: '14px', color: colors.textMuted, display: 'flex', gap: '12px', lineHeight: 1.4 }}>
                    <span style={{ color: colors.primary, fontWeight: 900 }}>✓</span> <span>{f.replace('✓ ', '')}</span>
                  </div>
                ))}
              </div>
              
              <button onClick={() => router.push('/register')} style={{ width: '100%', background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, border: 'none', color: '#fff', padding: '20px', borderRadius: '16px', fontSize: '16px', fontWeight: 800, cursor: 'pointer', boxShadow: `0 10px 30px ${colors.primary}20` }}>
                Cuba Zed Percuma →
              </button>
              <p style={{ fontSize: '12px', color: '#555', marginTop: '18px', fontWeight: 600 }}>5 mesej percuma. Tiada kad kredit diperlukan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '64px 24px', borderTop: `1px solid ${colors.border}`, textAlign: 'center', background: '#010101' }}>
        <div style={{ fontSize: '28px', fontWeight: 900, letterSpacing: '-1.5px', background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>ZED</div>
        <p style={{ fontSize: '14px', color: colors.textMuted, marginBottom: '8px', maxWidth: '400px', margin: '0 auto 12px', lineHeight: 1.6 }}>Malaysia's First AI Educational BFF untuk pelajar SPM.</p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.2)', fontWeight: 500 }}>© 2026 Zed. All rights reserved.</p>
      </footer>

    </main>
  );
}