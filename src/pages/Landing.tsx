import { useState, useEffect, useRef } from 'react';
import {
  Zap, ArrowRight, CheckCircle, TrendingUp, Users, Clock,
  Shield, Star, BarChart3, Lightbulb, Target, Rocket,
  MessageSquare, ChevronRight, AlertCircle, Globe, Menu, X
} from 'lucide-react';

/* ─── TYPES ─── */
type Page = 'home' | 'scan' | 'register' | 'login';
interface LandingProps { navigate: (to: Page) => void; }

/* ─── GLOBAL STYLES (injected once) ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --navy:      #0D1B2A;
    --navy2:     #142032;
    --navy3:     #1A2B47;
    --mint:      #4FD1C5;
    --mint-dim:  rgba(79,209,197,.11);
    --mint-glow: rgba(79,209,197,.28);
    --slate:     #94A3B8;
    --gray:      #CBD5E1;
    --border:    rgba(79,209,197,.14);
    --border2:   rgba(255,255,255,.06);
    --danger:    #F87171;
    --warn:      #FBBF24;
    --white:     #FFFFFF;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--navy);
    color: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  /* ── NOISE ── */
  body::before {
    content: '';
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='.03'/%3E%3C/svg%3E");
    opacity: .5;
  }

  /* ── TYPOGRAPHY ── */
  .font-syne { font-family: 'Syne', sans-serif !important; }

  /* ── GLOW ORBS ── */
  .orb {
    position: absolute; border-radius: 50%; pointer-events: none;
    filter: blur(80px); opacity: .18;
  }

  /* ── CARDS ── */
  .vcard {
    background: rgba(20,32,50,.7);
    border: 1px solid var(--border);
    border-radius: 16px;
    backdrop-filter: blur(10px);
    transition: border-color .25s, transform .25s, box-shadow .25s;
  }
  .vcard:hover {
    border-color: rgba(79,209,197,.3);
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(0,0,0,.25), 0 0 0 1px rgba(79,209,197,.08);
  }

  /* ── BUTTONS ── */
  .vbtn-primary {
    display: inline-flex; align-items: center; gap: .45rem;
    background: var(--mint); color: var(--navy);
    font-family: 'Syne', sans-serif; font-weight: 700; font-size: .9rem;
    padding: .75rem 1.6rem; border-radius: 9px; border: none; cursor: pointer;
    box-shadow: 0 0 24px var(--mint-glow);
    transition: opacity .2s, transform .2s, box-shadow .2s;
    white-space: nowrap;
  }
  .vbtn-primary:hover { opacity:.88; transform: translateY(-2px); box-shadow: 0 0 40px var(--mint-glow); }
  .vbtn-primary:disabled { opacity:.45; cursor:not-allowed; transform:none; }

  .vbtn-ghost {
    display: inline-flex; align-items: center; gap: .45rem;
    background: transparent; color: var(--white);
    font-family: 'DM Sans', sans-serif; font-weight: 400; font-size: .9rem;
    padding: .75rem 1.6rem; border-radius: 9px;
    border: 1px solid var(--border2); cursor: pointer;
    transition: border-color .2s, color .2s;
    white-space: nowrap;
  }
  .vbtn-ghost:hover { border-color: var(--border); color: var(--mint); }

  /* ── INPUTS ── */
  .vinput {
    width: 100%; background: rgba(13,27,42,.8);
    border: 1px solid var(--border2); border-radius: 9px;
    color: var(--white); font-family: 'DM Sans', sans-serif;
    font-size: .88rem; font-weight: 300; padding: .75rem 1rem;
    outline: none; transition: border-color .2s, box-shadow .2s;
    resize: none;
  }
  .vinput::placeholder { color: var(--slate); opacity:.6; }
  .vinput:focus { border-color: var(--mint); box-shadow: 0 0 0 3px rgba(79,209,197,.1); }

  /* ── SECTION LABEL ── */
  .vlabel {
    display: inline-flex; align-items: center; gap: .5rem;
    font-size: .68rem; font-weight: 700; letter-spacing: .14em;
    text-transform: uppercase; color: var(--mint);
  }
  .vlabel::before {
    content: ''; display: block; width: 16px; height: 1px; background: var(--mint);
  }

  /* ── GRADIENT TEXT ── */
  .vgrad {
    background: linear-gradient(135deg, var(--mint) 0%, #68D9D0 50%, #93E4E0 100%);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }

  /* ── REVEAL ANIMATIONS ── */
  .reveal { opacity: 0; transform: translateY(22px); transition: opacity .65s ease, transform .65s ease; }
  .reveal.on { opacity: 1; transform: translateY(0); }
  .reveal-d1 { transition-delay: .1s !important; }
  .reveal-d2 { transition-delay: .2s !important; }
  .reveal-d3 { transition-delay: .3s !important; }

  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes spin   { to{transform:rotate(360deg)} }
  @keyframes glow   { 0%,100%{box-shadow:0 0 24px var(--mint-glow)} 50%{box-shadow:0 0 48px var(--mint-glow),0 0 80px rgba(79,209,197,.15)} }
  @keyframes scanLine {
    0%  { top: 0%; opacity:1; }
    90% { top: 95%; opacity:1; }
    100%{ top: 95%; opacity:0; }
  }
  @keyframes barGrow { from{width:0} to{width:var(--w)} }
  @keyframes countUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  .anim-fade-up  { animation: fadeUp .7s ease both; }
  .anim-d1 { animation-delay: .1s; }
  .anim-d2 { animation-delay: .2s; }
  .anim-d3 { animation-delay: .3s; }
  .anim-d4 { animation-delay: .4s; }
  .anim-pulse-glow { animation: glow 2.8s ease-in-out infinite; }

  /* ── SWOT ── */
  .swot-s { background:rgba(79,209,197,.07); border:1px solid rgba(79,209,197,.2); }
  .swot-w { background:rgba(248,113,113,.07); border:1px solid rgba(248,113,113,.2); }
  .swot-o { background:rgba(251,191,36,.07); border:1px solid rgba(251,191,36,.2); }
  .swot-t { background:rgba(167,139,250,.07); border:1px solid rgba(167,139,250,.2); }

  /* ── CHAT BUBBLES ── */
  .bubble-ai   { background:rgba(26,43,71,.9); border:1px solid var(--border); border-radius:14px 14px 14px 4px; }
  .bubble-user { background:rgba(79,209,197,.13); border:1px solid rgba(79,209,197,.2); border-radius:14px 14px 4px 14px; }

  /* ── SCAN RESULT CARD ── */
  .score-ring {
    width: 90px; height: 90px; border-radius: 50%;
    background: conic-gradient(var(--mint) 0% calc(var(--pct) * 1%), rgba(255,255,255,.06) calc(var(--pct) * 1%) 100%);
    display: flex; align-items: center; justify-content: center;
    position: relative; flex-shrink: 0;
    filter: drop-shadow(0 0 8px rgba(79,209,197,.35));
  }
  .score-ring::after {
    content:''; position:absolute; inset:8px;
    background:var(--navy2); border-radius:50%;
  }
  .score-ring span {
    position:relative; z-index:1;
    font-family:'Syne',sans-serif; font-size:1.3rem; font-weight:800; color:var(--mint);
  }

  /* ── PRICING HIGHLIGHT ── */
  .plan-featured {
    background: rgba(79,209,197,.06) !important;
    border: 1px solid rgba(79,209,197,.4) !important;
    box-shadow: 0 0 50px rgba(79,209,197,.08);
  }

  /* ── STEP ACTIVE ── */
  .step-active {
    background: rgba(79,209,197,.07) !important;
    border-top: 2px solid var(--mint) !important;
  }

  // /* ── NAV ── */
  // .vnav {
  //   position: fixed; top:0; left:0; right:0; z-index:300;
  //   display:flex; align-items:center; justify-content:space-between;
  //   padding: .95rem 2.5rem;
  //   background: rgba(13,27,42,.8);
  //   backdrop-filter: blur(22px);
  //   border-bottom: 1px solid var(--border);
  //   transition: background .3s;
  // }

  /* ── BADGE ── */
  .badge-mint   { background:var(--mint-dim); border:1px solid var(--border); color:var(--mint); }
  .badge-warn   { background:rgba(251,191,36,.1); border:1px solid rgba(251,191,36,.25); color:var(--warn); }
  .badge-danger { background:rgba(248,113,113,.1); border:1px solid rgba(248,113,113,.25); color:var(--danger); }

  /* ── RESPONSIVE ── */
  @media(max-width:768px){
    .vnav { padding:.9rem 1.2rem; }
    .hide-mobile { display:none !important; }
    .stack-mobile { flex-direction:column !important; align-items:stretch !important; }
    .stack-mobile > * { width:100% !important; text-align:center; justify-content:center; }
  }
  @media(max-width:640px){
    .col2-mobile { grid-template-columns:1fr !important; }
  }
`;

/* ─── HOOK: IntersectionObserver ─── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setOn(true); }, { threshold: .12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, on };
}

/* ─── ANIMATED COUNTER ─── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const { ref, on } = useReveal();
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!on) return;
    let cur = 0; const step = to / 55;
    const t = setInterval(() => {
      cur += step; if (cur >= to) { setVal(to); clearInterval(t); } else setVal(Math.floor(cur));
    }, 1800 / 55);
    return () => clearInterval(t);
  }, [on, to]);
  return <span ref={ref} className="vgrad font-syne">{val.toLocaleString('fr-FR')}{suffix}</span>;
}

/* ─── DEMO SCANNER ─── */
function DemoScanner({ navigate }: { navigate: (to: Page) => void }) {
  const [txt, setTxt] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ score: number; verdict: string; badge: string } | null>(null);

  const analyse = () => {
    if (txt.trim().length < 20 || loading) return;
    setLoading(true); setResult(null);
    setTimeout(() => {
      const s = 58 + Math.floor(Math.random() * 32);
      setLoading(false);
      setResult({
        score: s,
        verdict: s >= 78 ? 'Forte demande détectée' : s >= 64 ? 'Signal positif' : 'Signal modéré',
        badge: s >= 78 ? 'badge-mint' : s >= 64 ? 'badge-warn' : 'badge-danger',
      });
    }, 2400);
  };

  return (
    <div className="vcard" style={{ padding: '1.5rem', maxWidth: 560, margin: '0 auto' }}>
      {/* Window bar */}
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:'1rem' }}>
        <span style={{ width:10,height:10,borderRadius:'50%',background:'#f87171',display:'block' }} />
        <span style={{ width:10,height:10,borderRadius:'50%',background:'#fbbf24',display:'block' }} />
        <span style={{ width:10,height:10,borderRadius:'50%',background:'var(--mint)',display:'block' }} />
        <span style={{ fontSize:'.7rem', color:'var(--slate)', marginLeft:8 }}>valiquo.ma — scanner démo</span>
      </div>

      <label style={{ fontSize:'.78rem', color:'var(--gray)', display:'block', marginBottom:6 }}>
        Décris le problème à résoudre <span style={{ color:'var(--slate)' }}>(min. 20 caractères)</span>
      </label>
      <textarea
        className="vinput"
        rows={3}
        maxLength={300}
        value={txt}
        onChange={e => setTxt(e.target.value)}
        placeholder="Ex : Les petites épiceries marocaines n'ont pas d'outil simple pour gérer leurs stocks..."
      />
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8 }}>
        <span style={{ fontSize:'.7rem', color:'var(--slate)' }}>{txt.length}/300</span>
        <button
          className="vbtn-primary"
          style={{ fontSize:'.82rem', padding:'.6rem 1.2rem' }}
          onClick={analyse}
          disabled={txt.length < 20 || loading}
        >
          {loading
            ? <><span style={{ width:13,height:13,border:'2px solid rgba(13,27,42,.4)',borderTopColor:'var(--navy)',borderRadius:'50%',display:'inline-block',animation:'spin .7s linear infinite' }} /> Analyse...</>
            : <><Zap size={13} /> Analyser (démo)</>}
        </button>
      </div>

      {result && (
        <div
          style={{ marginTop:'1rem', padding:'1rem', borderRadius:10, animation:'fadeUp .5s ease both' }}
          className={result.badge}
        >
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
            <span className="font-syne" style={{ fontWeight:700, fontSize:'.88rem' }}>{result.verdict}</span>
            <span className="font-syne vgrad" style={{ fontWeight:800, fontSize:'1.4rem' }}>{result.score}/100</span>
          </div>
          <p style={{ fontSize:'.75rem', color:'var(--slate)', lineHeight:1.55, marginBottom:'0.8rem' }}>
            Rapport partiel — connecte-toi pour accéder à l'analyse complète (SWOT, plan d'action, contexte marché).
          </p>
          <button
            className="vbtn-primary"
            style={{ width:'100%', justifyContent:'center', fontSize:'.82rem', padding:'.65rem' }}
            onClick={() => navigate('scan')}
          >
            Voir le rapport complet <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   LANDING PAGE
═══════════════════════════════════════════════ */
export default function Landing({ navigate }: LandingProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const statsR   = useReveal();
  const probR    = useReveal();
  const featR    = useReveal();
  const procR    = useReveal();
  const pricingR = useReveal();

  /* Inject styles once */
  useEffect(() => {
    if (document.getElementById('valiquo-styles')) return;
    const el = document.createElement('style');
    el.id = 'valiquo-styles'; el.textContent = STYLES;
    document.head.appendChild(el);
  }, []);

  const obstacles = [
    { icon: <AlertCircle size={22} />, titre: 'Lancer sans valider', desc: '90 % des startups échouent faute de validation marché. Des mois de travail pour un produit que personne ne veut.' },
    { icon: <Clock size={22} />, titre: 'Études trop coûteuses', desc: 'Les études de marché traditionnelles coûtent cher et prennent des semaines — inaccessibles pour la plupart des fondateurs.' },
    { icon: <Globe size={22} />, titre: 'Outils inadaptés au Maroc', desc: 'Les plateformes étrangères ignorent les codes, comportements et dynamiques spécifiques au marché marocain.' },
  ];

  const features = [
    { icon: <BarChart3 size={20} />, titre: 'Score de validation IA', desc: 'Un score 0–100 fondé sur la demande marché, les tendances sectorielles et le contexte local.' },
    { icon: <Shield size={20} />, titre: 'Analyse SWOT complète', desc: 'Forces, faiblesses, opportunités et menaces adaptées à ta géographie et à ton secteur.' },
    { icon: <Target size={20} />, titre: 'Plan d\'action 3 étapes', desc: 'Une roadmap concrète pour valider puis construire ton MVP sans perdre de temps.' },
    { icon: <TrendingUp size={20} />, titre: 'Contexte marché marocain', desc: 'Tendances, comportements et barrières spécifiques à ta ville et ton secteur.' },
    { icon: <MessageSquare size={20} />, titre: 'Coach IA intégré', desc: 'Un assistant pour approfondir l\'analyse, poser des questions, affiner ta stratégie.' },
    { icon: <Lightbulb size={20} />, titre: 'Historique & suivi', desc: 'Conserve tes scans, compare tes idées et suis ta progression.' },
  ];

  const steps = [
    { n: '01', titre: 'Décris le problème', desc: 'Explique en quelques lignes la douleur que tu veux résoudre. Précision = pertinence.' },
    { n: '02', titre: 'Lance le scan IA', desc: 'L\'IA croise signaux locaux, données sectorielles et contexte marocain.' },
    { n: '03', titre: 'Lis ton rapport', desc: 'Score, SWOT, contexte marché — tout est adapté à ta ville et ton secteur.' },
    { n: '04', titre: 'Construis en confiance', desc: 'Suis le plan d\'action pour valider terrain avant d\'investir.' },
  ];

  const plans = [
    {
      name: 'Starter', price: 'Gratuit', unit: 'pour toujours',
      desc: 'Pour tester et valider une première idée.',
      feats: ['3 scans / mois', 'Score + verdict', 'SWOT simplifié', 'Plan d\'action basique', 'Historique 5 scans'],
      cta: 'Commencer gratuitement', featured: false, page: 'register' as Page,
    },
    {
      name: 'Pro', price: '199 MAD', unit: '/mois',
      desc: 'Pour les entrepreneurs avec plusieurs idées en cours.',
      feats: ['Scans illimités', 'SWOT complète', 'Contexte marché détaillé', 'Coach IA illimité', 'Export PDF', 'Historique illimité'],
      cta: 'Démarrer en Pro', featured: true, page: 'register' as Page,
    },
    {
      name: 'Écosystème', price: 'Sur devis', unit: '',
      desc: 'Pour incubateurs, accélérateurs et structures d\'accompagnement.',
      feats: ['Tout le plan Pro', 'Multi-utilisateurs', 'Dashboard analytique', 'Rapports personnalisés', 'API', 'Support dédié'],
      cta: 'Nous contacter', featured: false, page: 'home' as Page,
    },
  ];

  const chatMsgs = [
    { r: 'user', m: 'Mon score est 68/100 — que faire en premier ?' },
    { r: 'ai',   m: 'Avec 68, tu es en zone positive mais ça demande une validation terrain. Mène 10–15 entretiens qualitatifs avec des clients cibles à Casablanca cette semaine. L\'objectif : confirmer que le problème est récurrent et qu\'ils paient pour une solution.' },
    { r: 'user', m: 'Combien facturer ?' },
    { r: 'ai',   m: 'Pour le marché marocain PME, teste 300–500 MAD/mois. Offre 3 mois gratuits à 5 pilotes, évalue la rétention, puis fixe ton prix.' },
  ];

  return (
    <div style={{ position:'relative', zIndex:10 }}>

    
    
      {/* mobile menu */}
      {menuOpen && (
        <div style={{
          position:'fixed', inset:0, zIndex:200, background:'rgba(13,27,42,.97)',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'2rem',
          animation:'fadeIn .2s ease both'
        }}>
          <button style={{ position:'absolute', top:'1.2rem', right:'1.2rem', background:'none', border:'none', color:'var(--white)', cursor:'pointer' }} onClick={() => setMenuOpen(false)}><X size={24}/></button>
          {[['#demo','Démo'],['#features','Fonctionnalités'],['#pricing','Tarifs']].map(([h,l]) => (
            <a key={h} href={h} style={{ color:'var(--white)', textDecoration:'none', fontSize:'1.3rem', fontFamily:'Syne,sans-serif', fontWeight:700 }} onClick={() => setMenuOpen(false)}>{l}</a>
          ))}
          <button className="vbtn-primary" onClick={() => { navigate('register'); setMenuOpen(false); }}>Commencer gratuitement</button>
        </div>
      )}

      {/* ══════════ HERO ══════════ */}
      <section style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', paddingTop:'5.5rem', paddingBottom:'3rem', padding:'5.5rem 1.5rem 3rem', position:'relative', overflow:'hidden' }}>
        {/* orbs */}
        <div className="orb" style={{ width:500,height:500,background:'var(--mint)',top:'-120px',left:'-100px' }} />
        <div className="orb" style={{ width:400,height:400,background:'#6366f1',bottom:'-80px',right:'-80px' }} />

        <div style={{ maxWidth:860, margin:'0 auto', textAlign:'center', position:'relative', zIndex:1 }}>
          {/* badge */}
          <div className="anim-fade-up" style={{ display:'inline-flex', alignItems:'center', gap:'.5rem', background:'rgba(79,209,197,.1)', border:'1px solid rgba(79,209,197,.28)', color:'var(--mint)', padding:'.35rem 1rem', borderRadius:100, fontSize:'.72rem', fontWeight:700, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:'1.8rem' }}>
            <span style={{ width:7,height:7,borderRadius:'50%',background:'var(--mint)',animation:'glow 2s ease-in-out infinite',display:'block' }} />
            IA de validation · Marché marocain · Bêta ouverte
          </div>

          {/* H1 */}
          <h1 className="anim-fade-up anim-d1 font-syne" style={{ fontSize:'clamp(2.4rem,6.5vw,5rem)', fontWeight:800, lineHeight:1.02, letterSpacing:'-.03em', marginBottom:'1.2rem' }}>
            Prouve la demande.
            <br />
            <span className="vgrad">Avant de te lancer.</span>
          </h1>

          {/* sub */}
          <p className="anim-fade-up anim-d2" style={{ color:'var(--slate)', fontSize:'1rem', lineHeight:1.75, maxWidth:520, margin:'0 auto 2.5rem', fontWeight:300 }}>
            Valiquo scanne ton idée sur le marché marocain en 5 minutes — score de validation, SWOT et plan d'action concret avant d'investir un seul dirham.
          </p>

          {/* CTAs */}
          <div className="anim-fade-up anim-d3 stack-mobile" style={{ display:'flex', gap:'.8rem', justifyContent:'center', marginBottom:'3.5rem' }}>
            <button className="vbtn-primary anim-pulse-glow" style={{ fontSize:'.95rem', padding:'.85rem 2rem' }} onClick={() => navigate('scan')}>
              <Zap size={17} /> Scanner mon idée gratuitement
            </button>
            <button className="vbtn-ghost" style={{ fontSize:'.95rem', padding:'.85rem 2rem' }} onClick={() => document.querySelector('#demo')?.scrollIntoView({ behavior:'smooth' })}>
              Voir une démo <ChevronRight size={15} />
            </button>
          </div>

          {/* trust row */}
          <div className="anim-fade-up anim-d4" style={{ display:'flex', flexWrap:'wrap', gap:'1.2rem', justifyContent:'center' }}>
            {[
              { icon:<Star size={13}/>, txt:'100 % gratuit pour commencer' },
              { icon:<Clock size={13}/>, txt:'Résultats en moins de 5 min' },
              { icon:<CheckCircle size={13}/>, txt:'Aucune carte bancaire requise' },
            ].map(({ icon, txt }) => (
              <div key={txt} style={{ display:'flex', alignItems:'center', gap:'.35rem', fontSize:'.78rem', color:'var(--slate)' }}>
                <span style={{ color:'var(--mint)' }}>{icon}</span>{txt}
              </div>
            ))}
          </div>
        </div>

        {/* ── Hero product preview ── */}
        <div className="anim-fade-up anim-d4" style={{ maxWidth:760, width:'100%', margin:'4rem auto 0', padding:'0 1rem', position:'relative', zIndex:1 }}>
          <div className="vcard" style={{ padding:'1.6rem', position:'relative', overflow:'hidden' }}>
            {/* scan line animation */}
            <div style={{ position:'absolute', left:0, right:0, height:2, background:'linear-gradient(90deg,transparent,var(--mint),transparent)', animation:'scanLine 2.8s ease-in-out infinite', opacity:.5 }} />

            <div style={{ fontSize:'.68rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--mint)', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'.4rem' }}>
              <span style={{ width:5,height:5,borderRadius:'50%',background:'var(--mint)',boxShadow:'0 0 6px var(--mint)',display:'block' }} />
              Rapport de validation · Casablanca · Logistique
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'.9rem' }}>
              {/* score */}
              <div style={{ display:'flex', flexDirection:'column', gap:'.6rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'.9rem' }}>
                  <div className="score-ring" style={{ '--pct':'78' } as React.CSSProperties}>
                    <span>78</span>
                  </div>
                  <div>
                    <div className="font-syne" style={{ fontWeight:700, fontSize:'.88rem', marginBottom:'.2rem' }}>Forte demande</div>
                    <div style={{ fontSize:'.72rem', color:'var(--slate)' }}>1 240 signaux détectés</div>
                    <div style={{ display:'flex', gap:'.4rem', flexWrap:'wrap', marginTop:'.5rem' }}>
                      <span className="badge-mint" style={{ fontSize:'.62rem', padding:'.2rem .55rem', borderRadius:100, fontWeight:600 }}>Marché validé</span>
                      <span className="badge-warn" style={{ fontSize:'.62rem', padding:'.2rem .55rem', borderRadius:100, fontWeight:600 }}>B2C</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* swot mini */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'.5rem' }}>
                {[
                  { c:'swot-s', t:'Forces', v:'Besoin récurrent, marché non couvert' },
                  { c:'swot-w', t:'Faiblesses', v:'Besoin de partenariats logistiques' },
                  { c:'swot-o', t:'Opportunités', v:'E-commerce marocain en forte croissance' },
                  { c:'swot-t', t:'Menaces', v:'Entrée potentielle de Google Maps' },
                ].map(({ c, t, v }) => (
                  <div key={t} className={c} style={{ borderRadius:8, padding:'.5rem .6rem' }}>
                    <div style={{ fontSize:'.58rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', marginBottom:'.2rem',
                      color: c==='swot-s'?'var(--mint)':c==='swot-w'?'var(--danger)':c==='swot-o'?'var(--warn)':'#a78bfa' }}>{t}</div>
                    <div style={{ fontSize:'.66rem', color:'var(--gray)', lineHeight:1.4 }}>{v}</div>
                  </div>
                ))}
              </div>

              {/* reco */}
              <div>
                <div style={{ fontSize:'.65rem', fontWeight:700, letterSpacing:'.09em', textTransform:'uppercase', color:'var(--mint)', marginBottom:'.6rem' }}>Plan d'action</div>
                {[
                  'Mener 10 entretiens livreurs à Casablanca cette semaine',
                  'Créer un prototype de localisation simplifié',
                  'Démarcher Glovo Maroc comme premier partenaire',
                ].map((txt, i) => (
                  <div key={i} style={{ display:'flex', gap:'.5rem', alignItems:'flex-start', marginBottom:'.45rem' }}>
                    <div style={{ width:18,height:18,borderRadius:'50%',background:'var(--mint-dim)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:'.05rem' }}>
                      <span className="font-syne" style={{ fontSize:'.55rem', fontWeight:800, color:'var(--mint)' }}>{i+1}</span>
                    </div>
                    <div style={{ fontSize:'.7rem', color:'var(--gray)', lineHeight:1.45 }}>{txt}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STATS ══════════ */}
      <div ref={statsR.ref} style={{ borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', background:'rgba(20,32,50,.5)', backdropFilter:'blur(10px)' }}>
        <div style={{ maxWidth:900, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', padding:'0 1.5rem' }}>
          {[
            { val:90, suf:'%', lbl:'des startups échouent sans PMF' },
            { val:5,  suf:' min', lbl:'pour un rapport complet' },
            { val:0,  suf:' MAD', lbl:'pour commencer' },
            { val:1240, suf:'+', lbl:'signaux analysés par scan' },
          ].map(({ val, suf, lbl }) => (
            <div key={lbl} style={{ textAlign:'center', padding:'2rem 1rem', borderRight:'1px solid var(--border)' }}
              className={statsR.on ? '' : 'reveal'}>
              <div className="font-syne" style={{ fontSize:'clamp(1.6rem,3vw,2.2rem)', fontWeight:800, marginBottom:'.3rem' }}>
                <Counter to={val} suffix={suf} />
              </div>
              <div style={{ fontSize:'.75rem', color:'var(--slate)', lineHeight:1.45 }}>{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ PROBLÈME ══════════ */}
      <section style={{ padding:'5.5rem 1.5rem' }} ref={probR.ref}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <div className="vlabel" style={{ justifyContent:'center', marginBottom:'.7rem' }}>Le problème</div>
            <h2 className="font-syne" style={{ fontSize:'clamp(1.7rem,3.5vw,2.6rem)', fontWeight:800, letterSpacing:'-.025em' }}>
              Pourquoi tant de projets <span className="vgrad">échouent</span> ?
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:'1.1rem' }}>
            {obstacles.map((o, i) => (
              <div key={o.titre} className={`vcard ${probR.on ? `reveal on reveal-d${i+1}` : 'reveal'}`} style={{ padding:'1.8rem' }}>
                <div style={{ width:44,height:44,borderRadius:10,background:'rgba(248,113,113,.1)',color:'var(--danger)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'1rem' }}>
                  {o.icon}
                </div>
                <h3 className="font-syne" style={{ fontWeight:700, fontSize:'.95rem', marginBottom:'.5rem' }}>{o.titre}</h3>
                <p style={{ fontSize:'.83rem', color:'var(--slate)', lineHeight:1.65 }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ DÉMO ══════════ */}
      <section id="demo" style={{ padding:'5.5rem 1.5rem', borderTop:'1px solid var(--border)' }}>
        <div style={{ maxWidth:680, margin:'0 auto', textAlign:'center' }}>
          <div className="vlabel" style={{ justifyContent:'center', marginBottom:'.7rem' }}>Démo interactive</div>
          <h2 className="font-syne" style={{ fontSize:'clamp(1.7rem,3.5vw,2.5rem)', fontWeight:800, letterSpacing:'-.025em', marginBottom:'.8rem' }}>
            Essaie <span className="vgrad">par toi-même</span>
          </h2>
          <p style={{ fontSize:'.88rem', color:'var(--slate)', marginBottom:'2.5rem', lineHeight:1.65 }}>
            Décris un problème et obtiens un aperçu de ce que Valiquo peut faire pour toi.
          </p>
          <DemoScanner navigate={navigate} />
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="features" style={{ padding:'5.5rem 1.5rem', borderTop:'1px solid var(--border)' }} ref={featR.ref}>
        <div style={{ maxWidth:1040, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <div className="vlabel" style={{ justifyContent:'center', marginBottom:'.7rem' }}>Fonctionnalités</div>
            <h2 className="font-syne" style={{ fontSize:'clamp(1.7rem,3.5vw,2.5rem)', fontWeight:800, letterSpacing:'-.025em' }}>
              Tout ce qu'il te faut pour <span className="vgrad">valider</span>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1.1rem' }}>
            {features.map((f, i) => (
              <div key={f.titre} className={`vcard ${featR.on ? `reveal on reveal-d${Math.min(i+1,3)}` : 'reveal'}`} style={{ padding:'1.6rem' }}>
                <div style={{ width:42,height:42,borderRadius:10,background:'var(--mint-dim)',color:'var(--mint)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'.9rem' }}>
                  {f.icon}
                </div>
                <h3 className="font-syne" style={{ fontWeight:700, fontSize:'.9rem', marginBottom:'.45rem' }}>{f.titre}</h3>
                <p style={{ fontSize:'.8rem', color:'var(--slate)', lineHeight:1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ PROCESSUS ══════════ */}
      <section style={{ padding:'5.5rem 1.5rem', borderTop:'1px solid var(--border)' }} ref={procR.ref}>
        <div style={{ maxWidth:1040, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <div className="vlabel" style={{ justifyContent:'center', marginBottom:'.7rem' }}>Le processus</div>
            <h2 className="font-syne" style={{ fontSize:'clamp(1.7rem,3.5vw,2.5rem)', fontWeight:800, letterSpacing:'-.025em' }}>
              De l'idée à la <span className="vgrad">validation</span>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'1rem' }}>
            {steps.map((s, i) => (
              <div key={s.n}
                className={`${i===1?'step-active':''} ${procR.on ? `reveal on reveal-d${Math.min(i+1,3)}` : 'reveal'}`}
                style={{ borderRadius:14, border:'1px solid var(--border)', background:'rgba(20,32,50,.7)', padding:'1.6rem', position:'relative', backdropFilter:'blur(10px)', transition:'border-color .25s' }}>
                <div className="font-syne" style={{ fontSize:'2.2rem', fontWeight:800, color:'rgba(79,209,197,.13)', lineHeight:1, marginBottom:'.8rem' }}>{s.n}</div>
                <h3 className="font-syne" style={{ fontWeight:700, fontSize:'.88rem', marginBottom:'.45rem' }}>{s.titre}</h3>
                <p style={{ fontSize:'.78rem', color:'var(--slate)', lineHeight:1.6 }}>{s.desc}</p>
                {i < 3 && <ChevronRight size={18} style={{ position:'absolute', right:-10, top:'50%', transform:'translateY(-50%)', color:'var(--mint)', display:'none' }} className="hide-mobile" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ COACH IA ══════════ */}
      <section style={{ padding:'5.5rem 1.5rem', borderTop:'1px solid var(--border)' }}>
        <div style={{ maxWidth:680, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'2.5rem' }}>
            <div className="vlabel" style={{ justifyContent:'center', marginBottom:'.7rem' }}>Coach IA</div>
            <h2 className="font-syne" style={{ fontSize:'clamp(1.7rem,3.5vw,2.4rem)', fontWeight:800, letterSpacing:'-.025em' }}>
              Ton mentor <span className="vgrad">24h/24</span>
            </h2>
          </div>
          <div className="vcard" style={{ padding:'1.6rem' }}>
            {/* header */}
            <div style={{ display:'flex', alignItems:'center', gap:'.8rem', marginBottom:'1.2rem', paddingBottom:'1rem', borderBottom:'1px solid var(--border)' }}>
              <div style={{ width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,var(--mint),#68d9d0)',display:'flex',alignItems:'center',justifyContent:'center' }}>
                <span className="font-syne" style={{ fontSize:'.8rem', fontWeight:800, color:'var(--navy)' }}>V</span>
              </div>
              <div>
                <div className="font-syne" style={{ fontSize:'.85rem', fontWeight:700 }}>Coach Valiquo</div>
                <div style={{ fontSize:'.68rem', color:'var(--mint)', display:'flex', alignItems:'center', gap:'.3rem' }}>
                  <span style={{ width:5,height:5,borderRadius:'50%',background:'var(--mint)',display:'block' }} /> En ligne · Disponible 24h/24
                </div>
              </div>
              <div style={{ marginLeft:'auto' }}>
                <button className="vbtn-primary" style={{ fontSize:'.75rem', padding:'.45rem .9rem' }} onClick={() => navigate('scan')}>
                  Accéder
                </button>
              </div>
            </div>
            {/* messages */}
            <div style={{ display:'flex', flexDirection:'column', gap:'.75rem', marginBottom:'1rem' }}>
              {chatMsgs.map((m, i) => (
                <div key={i} style={{ display:'flex', justifyContent: m.r==='user' ? 'flex-end' : 'flex-start' }}>
                  <div className={m.r==='ai' ? 'bubble-ai' : 'bubble-user'} style={{ maxWidth:'82%', padding:'.65rem .9rem', fontSize:'.78rem', lineHeight:1.55, color: m.r==='user' ? 'var(--mint)' : 'var(--gray)' }}>
                    {m.m}
                  </div>
                </div>
              ))}
            </div>
            {/* input mock */}
            <div style={{ display:'flex', gap:'.6rem', padding:'.7rem', background:'rgba(13,27,42,.5)', borderRadius:9, border:'1px solid var(--border)' }}>
              <span style={{ flex:1, fontSize:'.78rem', color:'var(--slate)', display:'flex', alignItems:'center' }}>Pose ta question au Coach IA...</span>
              <button className="vbtn-primary" style={{ fontSize:'.75rem', padding:'.4rem .8rem' }} onClick={() => navigate('scan')}>Envoyer</button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ PRICING ══════════ */}
      <section id="pricing" style={{ padding:'5.5rem 1.5rem', borderTop:'1px solid var(--border)' }} ref={pricingR.ref}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <div className="vlabel" style={{ justifyContent:'center', marginBottom:'.7rem' }}>Tarifs</div>
            <h2 className="font-syne" style={{ fontSize:'clamp(1.7rem,3.5vw,2.5rem)', fontWeight:800, letterSpacing:'-.025em' }}>
              Simple et <span className="vgrad">transparent</span>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'1.1rem', alignItems:'start' }}>
            {plans.map((p, i) => (
              <div key={p.name}
                className={`${p.featured ? 'plan-featured' : 'vcard'} ${pricingR.on ? `reveal on reveal-d${i+1}` : 'reveal'}`}
                style={{ borderRadius:16, padding:'1.8rem', position:'relative', backdropFilter:'blur(10px)' }}>
                {p.featured && (
                  <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', background:'var(--mint)', color:'var(--navy)', fontSize:'.65rem', fontWeight:700, fontFamily:'Syne,sans-serif', padding:'.25rem .8rem', borderRadius:100, letterSpacing:'.05em' }}>
                    ⚡ Populaire
                  </div>
                )}
                <div className="font-syne" style={{ fontSize:'.72rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', color:'var(--slate)', marginBottom:'.8rem' }}>{p.name}</div>
                <div style={{ display:'flex', alignItems:'baseline', gap:'.3rem', marginBottom:'.3rem' }}>
                  <span className="font-syne" style={{ fontSize:p.price==='Sur devis'?'1.5rem':'2.4rem', fontWeight:800, color: p.featured ? 'var(--mint)' : 'var(--white)', letterSpacing:'-.02em' }}>{p.price}</span>
                  {p.unit && <span style={{ fontSize:'.8rem', color:'var(--slate)' }}>{p.unit}</span>}
                </div>
                <p style={{ fontSize:'.78rem', color:'var(--slate)', lineHeight:1.55, marginBottom:'1.3rem' }}>{p.desc}</p>
                <div style={{ height:1, background:'var(--border)', marginBottom:'1.2rem' }} />
                <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'.55rem', marginBottom:'1.4rem' }}>
                  {p.feats.map(f => (
                    <li key={f} style={{ display:'flex', alignItems:'flex-start', gap:'.5rem', fontSize:'.8rem', color:'var(--slate)' }}>
                      <CheckCircle size={13} style={{ color:'var(--mint)', marginTop:'.1rem', flexShrink:0 }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={p.featured ? 'vbtn-primary' : 'vbtn-ghost'}
                  style={{ width:'100%', justifyContent:'center', fontSize:'.85rem' }}
                  onClick={() => navigate(p.page)}
                >
                  {p.cta} <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ CTA FINAL ══════════ */}
      <section style={{ padding:'5.5rem 1.5rem', borderTop:'1px solid var(--border)' }}>
        <div style={{ maxWidth:780, margin:'0 auto' }}>
          <div style={{ borderRadius:24, padding:'4rem 2.5rem', textAlign:'center', background:'linear-gradient(135deg,rgba(79,209,197,.07),rgba(99,102,241,.05))', border:'1px solid rgba(79,209,197,.18)', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, background:'radial-gradient(circle at 50% 0%,rgba(79,209,197,.12),transparent 65%)', pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ width:60,height:60,borderRadius:16,background:'rgba(79,209,197,.13)',color:'var(--mint)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.5rem' }}>
                <Rocket size={26} />
              </div>
              <h2 className="font-syne" style={{ fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:800, letterSpacing:'-.025em', marginBottom:'.8rem' }}>
                Prouve que ton idée<br/><span className="vgrad">mérite d'exister.</span>
              </h2>
              <p style={{ color:'var(--slate)', fontSize:'.9rem', marginBottom:'2rem', lineHeight:1.65 }}>
                Rejoins les entrepreneurs marocains qui valident avant de construire.<br/>Gratuit · Sans carte bancaire · Résultats en 5 min.
              </p>
              <div className="stack-mobile" style={{ display:'flex', gap:'.8rem', justifyContent:'center' }}>
                <button className="vbtn-primary anim-pulse-glow" style={{ fontSize:'.95rem', padding:'.85rem 2rem' }} onClick={() => navigate('scan')}>
                  <Zap size={17} /> Scanner mon idée maintenant
                </button>
                <div style={{ display:'flex', alignItems:'center', gap:'.5rem', fontSize:'.78rem', color:'var(--slate)' }}>
                  <Users size={14} /><span>1 240+ entrepreneurs inscrits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ borderTop:'1px solid var(--border)', padding:'2.5rem 1.5rem', maxWidth:1040, margin:'0 auto', display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'2rem' }}>
        <div>
          <div className="font-syne" style={{ fontWeight:800, fontSize:'1.1rem', marginBottom:'.7rem' }}>
            Vali<span style={{ color:'var(--mint)' }}>quo</span>
          </div>
          <p style={{ fontSize:'.78rem', color:'var(--slate)', lineHeight:1.65, maxWidth:220 }}>
            La plateforme qui transforme les frustrations du quotidien en opportunités business validées pour les entrepreneurs marocains.
          </p>
        </div>
        {[
          { h:'Produit', links:['Fonctionnalités','Tarifs','Coach IA','Partenaires'] },
          { h:'Ressources', links:['Blog','Guides','Centre d\'aide'] },
          { h:'Légal', links:['Confidentialité','CGU','Contact'] },
        ].map(col => (
          <div key={col.h}>
            <div className="font-syne" style={{ fontSize:'.7rem', fontWeight:700, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:'.9rem', color:'var(--white)' }}>{col.h}</div>
            <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'.5rem' }}>
              {col.links.map(l => (
                <li key={l}><a href="#" style={{ fontSize:'.78rem', color:'var(--slate)', textDecoration:'none', transition:'color .2s' }}
                  onMouseEnter={e=>(e.currentTarget.style.color='var(--mint)')}
                  onMouseLeave={e=>(e.currentTarget.style.color='var(--slate)')}>{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </footer>
      <div style={{ borderTop:'1px solid var(--border)', padding:'1.2rem 1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'.5rem' }}>
        <p style={{ fontSize:'.72rem', color:'var(--slate)' }}>© 2026 Valiquo · Casablanca, Maroc</p>
        <p style={{ fontSize:'.72rem', color:'var(--slate)' }}>contact@valiquo.ma</p>
      </div>

    </div>
  );
}