import { useState, useEffect, useRef } from 'react';
import {
  Zap, ArrowRight, CheckCircle, TrendingUp, Users, Clock,
  Shield, Star, BarChart3, Lightbulb, Target, Rocket,
  MessageSquare, ChevronRight, AlertCircle, Globe
} from 'lucide-react';
import type { Page } from '../types';

interface LandingProps {
  navigate: (to: Page) => void;
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="gradient-text" style={{ fontFamily: 'Syne, sans-serif' }}>
      {count.toLocaleString('fr-FR')}{suffix}
    </span>
  );
}

function DemoScanner({ navigate }: { navigate: (to: Page) => void }) {
  const [problem, setProblem] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [demoResult, setDemoResult] = useState<null | { score: number; verdict: string }>(null);

  const handleDemo = () => {
    if (!problem.trim() || problem.length < 20) return;
    setAnalyzing(true);
    setDemoResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      const score = 55 + Math.floor(Math.random() * 35);
      const verdict = score >= 75 ? 'Forte demande détectée' : score >= 60 ? 'Signal positif détecté' : 'Signal modéré — à valider';
      setDemoResult({ score, verdict });
    }, 2200);
  };

  return (
    <div className="card p-6 max-w-xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
        <span className="ml-2 text-xs" style={{ color: 'var(--text-secondary)' }}>valiquo.ma — scanner</span>
      </div>

      <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
        Décris ton problème (min. 20 caractères)
      </p>
      <textarea
        value={problem}
        onChange={e => setProblem(e.target.value)}
        placeholder="Ex: Les petites épiceries marocaines n'ont pas d'outil simple pour gérer leurs stocks..."
        className="input resize-none mb-3"
        rows={3}
        maxLength={300}
        aria-label="Description du problème"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{problem.length}/300</span>
        <button
          onClick={handleDemo}
          disabled={problem.length < 20 || analyzing}
          className="btn-primary text-xs py-2 px-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? (
            <>
              <div className="w-3 h-3 border border-slate-900 border-t-transparent rounded-full animate-spin" />
              Analyse...
            </>
          ) : (
            <>
              <Zap size={13} />
              Analyser (démo)
            </>
          )}
        </button>
      </div>

      {demoResult && (
        <div
          className="mt-4 p-4 rounded-xl animate-fade-in"
          style={{ background: 'rgba(45, 212, 191, 0.08)', border: '1px solid rgba(45, 212, 191, 0.2)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold" style={{ fontFamily: 'Syne' }}>{demoResult.verdict}</span>
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: 'Syne', color: demoResult.score >= 75 ? 'var(--accent)' : '#FBB024' }}
            >
              {demoResult.score}/100
            </span>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
            Rapport partiel — connecte-toi pour accéder à l&apos;analyse complète (SWOT, plan d&apos;action, contexte marché).
          </p>
          <button
            onClick={() => navigate('scan')}
            className="btn-primary text-xs py-2 px-4 w-full justify-center"
          >
            Voir le rapport complet
            <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  );
}

export default function Landing({ navigate }: LandingProps) {
  const featuresRef = useInView();
  const processRef = useInView();
  const pricingRef = useInView();
  const statsRef = useInView();
  const problemRef = useInView();

  const obstacles = [
    {
      icon: <AlertCircle size={24} />,
      titre: 'Lancer sans valider',
      desc: '90% des startups échouent par manque de validation marché. La plupart dépensent des mois à développer un produit que personne ne veut acheter.',
    },
    {
      icon: <Clock size={24} />,
      titre: 'Perdre du temps et de l\'argent',
      desc: 'Les études de marché traditionnelles coûtent cher et prennent des semaines. Les entrepreneurs manquent d\'un outil rapide et accessible.',
    },
    {
      icon: <Globe size={24} />,
      titre: 'Méconnaître le marché local',
      desc: 'Le marché marocain a ses propres codes, comportements et dynamiques. Les outils étrangers ne reflètent pas cette réalité de terrain.',
    },
  ];

  const features = [
    {
      icon: <BarChart3 size={22} />,
      titre: 'Score de validation IA',
      desc: 'Un score de 0 à 100 basé sur la demande marché, les tendances sectorielles et le contexte local marocain.',
    },
    {
      icon: <Shield size={22} />,
      titre: 'Analyse SWOT complète',
      desc: 'Forces, faiblesses, opportunités et menaces spécifiques à votre contexte géographique et sectoriel.',
    },
    {
      icon: <Target size={22} />,
      titre: 'Plan d\'action en 3 étapes',
      desc: 'Un roadmap concret et actionnable pour valider puis construire ton produit minimum viable.',
    },
    {
      icon: <TrendingUp size={22} />,
      titre: 'Contexte marché marocain',
      desc: 'Données économiques, tendances et signaux spécifiques à ta ville et à ton secteur d\'activité.',
    },
    {
      icon: <MessageSquare size={22} />,
      titre: 'Coach IA intégré',
      desc: 'Un assistant IA pour approfondir ton analyse, poser tes questions et affiner ta stratégie de validation.',
    },
    {
      icon: <Lightbulb size={22} />,
      titre: 'Historique & suivi',
      desc: 'Conserve tous tes scans, compare l\'évolution de tes idées et suis ta progression dans le temps.',
    },
  ];

  const steps = [
    { num: '01', titre: 'Décris le problème', desc: 'Explique le problème que tu veux résoudre en quelques lignes. Plus tu es précis, plus l\'analyse est pertinente.' },
    { num: '02', titre: 'Lance le scan IA', desc: 'Notre IA analyse le problème au prisme du marché marocain en croisant données sectorielles et signaux locaux.' },
    { num: '03', titre: 'Lis ton rapport', desc: 'Reçois un score, un SWOT détaillé et un contexte marché adapté à ta ville et ton secteur.' },
    { num: '04', titre: 'Construis en confiance', desc: 'Suis le plan d\'action recommandé pour valider sur le terrain avant d\'investir en développement.' },
  ];

  const plans = [
    {
      name: 'Starter',
      price: 'Gratuit',
      priceNote: 'Pour toujours',
      desc: 'Parfait pour tester et valider une première idée.',
      features: ['3 scans par mois', 'Score + verdict', 'SWOT simplifié', 'Plan d\'action basique', 'Historique 5 scans'],
      cta: 'Commencer gratuitement',
      highlighted: false,
    },
    {
      name: 'Pro',
      price: '199 MAD',
      priceNote: '/mois',
      desc: 'Pour les entrepreneurs sérieux avec plusieurs idées en cours.',
      features: ['Scans illimités', 'Analyse SWOT complète', 'Contexte marché détaillé', 'Coach IA illimité', 'Export PDF', 'Historique illimité'],
      cta: 'Démarrer en Pro',
      highlighted: true,
    },
    {
      name: 'Écosystème',
      price: 'Sur devis',
      priceNote: '',
      desc: 'Pour les incubateurs, accélérateurs et structures d\'accompagnement.',
      features: ['Tout le plan Pro', 'Multi-utilisateurs', 'Dashboard analytique', 'Rapports personnalisés', 'Intégrations API', 'Support dédié'],
      cta: 'Nous contacter',
      highlighted: false,
    },
  ];

  return (
    <div className="relative z-10">
      <section className="min-h-screen flex flex-col items-center justify-center pt-20 pb-16">
        <div className="container text-center">
          <div className="animate-fade-in-up">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-8"
              style={{
                background: 'rgba(45, 212, 191, 0.1)',
                border: '1px solid rgba(45, 212, 191, 0.3)',
                color: 'var(--accent)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              IA de validation · Marché marocain
            </div>
          </div>

          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 animate-fade-in-up delay-100"
            style={{ fontFamily: 'Syne, sans-serif', maxWidth: '900px', margin: '0 auto 1.5rem' }}
          >
            Prouve la demande.
            <br />
            <span className="gradient-text">Avant de te lancer.</span>
          </h1>

          <p
            className="text-base md:text-lg mb-10 max-w-xl mx-auto animate-fade-in-up delay-200"
            style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}
          >
            Valiquo scanne ton idée de startup sur le marché marocain en 5 minutes. Score de validation, SWOT, plan d&apos;action — tout ce qu&apos;il faut avant d&apos;investir.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-in-up delay-300">
            <button
              onClick={() => navigate('scan')}
              className="btn-primary text-base py-4 px-8 animate-pulse-glow"
            >
              <Zap size={18} />
              Scanner mon idée gratuitement
            </button>
            <button
              onClick={() => document.querySelector('#demo')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-secondary text-base py-4 px-8"
            >
              Voir une démo
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto animate-fade-in-up delay-400">
            {[
              { icon: <Star size={16} />, text: '1 240+ entrepreneurs marocains' },
              { icon: <Clock size={16} />, text: 'Résultats en moins de 5 minutes' },
              { icon: <CheckCircle size={16} />, text: '100% gratuit pour commencer' },
            ].map(item => (
              <div
                key={item.text}
                className="flex items-center justify-center gap-2 text-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                <span style={{ color: 'var(--accent)' }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-16"
        style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
        ref={statsRef.ref}
      >
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 90, suffix: '%', label: 'des startups échouent sans validation' },
              { value: 5, suffix: ' min', label: 'pour obtenir votre analyse complète' },
              { value: 0, suffix: ' MAD', label: 'pour commencer avec Valiquo' },
              { value: 1240, suffix: '+', label: 'signaux marché analysés' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-3xl md:text-4xl font-extrabold mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" ref={problemRef.ref}>
        <div className="container">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Le problème</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Syne' }}>
              Pourquoi tant de projets échouent ?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {obstacles.map((o, i) => (
              <div
                key={o.titre}
                className={`card p-6 ${problemRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}
                >
                  {o.icon}
                </div>
                <h3 className="font-bold text-base mb-2" style={{ fontFamily: 'Syne' }}>{o.titre}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="py-16">
        <div className="container">
          <div className="text-center mb-10">
            <p className="section-label mb-3">Démo interactive</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Syne' }}>
              Essaie par toi-même
            </h2>
            <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Décris un problème et vois un aperçu de ce que Valiquo peut faire pour toi.
            </p>
          </div>
          <DemoScanner navigate={navigate} />
        </div>
      </section>

      <section id="features" className="py-24" ref={featuresRef.ref}>
        <div className="container">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Fonctionnalités</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Syne' }}>
              Tout ce qu&apos;il te faut pour valider
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.titre}
                className={`card p-6 ${featuresRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--accent)' }}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ fontFamily: 'Syne' }}>{f.titre}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24" ref={processRef.ref}>
        <div className="container">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Le processus</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Syne' }}>
              De l&apos;idée à la validation
            </h2>
            <p className="text-sm mt-3 max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Un processus simple, clair et actionnable en 4 étapes.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div
                key={s.num}
                className={`relative p-6 rounded-2xl ${processRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  animationDelay: `${i * 0.15}s`,
                }}
              >
                <div
                  className="text-4xl font-extrabold mb-4"
                  style={{ fontFamily: 'Syne', color: 'rgba(45, 212, 191, 0.15)' }}
                >
                  {s.num}
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ fontFamily: 'Syne' }}>{s.titre}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.desc}</p>
                {i < steps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-8 -right-3 w-6"
                    style={{ color: 'var(--accent)' }}
                  >
                    <ChevronRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          <div className="card p-8 md:p-10 max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--accent)' }}
              >
                <MessageSquare size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm" style={{ fontFamily: 'Syne' }}>Coach IA Valiquo</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Disponible 24h/24</p>
              </div>
              <div
                className="ml-auto flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--accent)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                En ligne
              </div>
            </div>
            <div className="space-y-3">
              {[
                { role: 'user', msg: 'Mon score est de 68/100, que dois-je faire en premier ?' },
                { role: 'assistant', msg: 'Avec un score de 68, tu es dans une zone de signal positif mais qui demande une validation terrain. Je te recommande de mener 10 à 15 entretiens qualitatifs avec des clients potentiels dans les 2 prochaines semaines. Cible des entrepreneurs ou gérants de petites structures à Casablanca. L\'objectif : confirmer que le problème est récurrent et qu\'ils sont prêts à payer pour une solution.' },
                { role: 'user', msg: 'Combien facturer pour mon offre ?' },
                { role: 'assistant', msg: 'Pour le marché marocain PME, commence avec une fourchette test de 300 à 500 MAD/mois. Propose d\'abord 3 mois gratuits à 5 pilotes, puis évalue leur rétention avant de fixer ton prix définitif.' },
              ].map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className="max-w-xs md:max-w-sm text-xs rounded-2xl px-4 py-3 leading-relaxed"
                    style={{
                      background: m.role === 'user' ? 'rgba(45, 212, 191, 0.15)' : 'rgba(51, 65, 85, 0.6)',
                      color: m.role === 'user' ? 'var(--accent)' : 'var(--text-primary)',
                      borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    }}
                  >
                    {m.msg}
                  </div>
                </div>
              ))}
            </div>
            <div
              className="mt-4 flex items-center gap-3 p-3 rounded-xl text-xs"
              style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border)' }}
            >
              <span style={{ color: 'var(--text-secondary)' }}>Pose ta question au Coach IA...</span>
              <button
                onClick={() => navigate('scan')}
                className="ml-auto btn-primary text-xs py-1.5 px-3"
              >
                Accéder
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-24" ref={pricingRef.ref}>
        <div className="container">
          <div className="text-center mb-14">
            <p className="section-label mb-3">Tarifs</p>
            <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Syne' }}>
              Simple et transparent
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <div
                key={plan.name}
                className={`relative p-6 rounded-2xl ${pricingRef.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{
                  background: plan.highlighted ? 'rgba(45, 212, 191, 0.06)' : 'var(--bg-card)',
                  border: plan.highlighted ? '1px solid rgba(45, 212, 191, 0.4)' : '1px solid var(--border)',
                  animationDelay: `${i * 0.1}s`,
                  boxShadow: plan.highlighted ? '0 0 40px rgba(45, 212, 191, 0.1)' : 'none',
                }}
              >
                {plan.highlighted && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'var(--accent)', color: '#0F172A' }}
                  >
                    Populaire
                  </div>
                )}
                <h3 className="font-bold mb-1" style={{ fontFamily: 'Syne' }}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span
                    className="text-3xl font-extrabold"
                    style={{ fontFamily: 'Syne', color: plan.highlighted ? 'var(--accent)' : 'var(--text-primary)' }}
                  >
                    {plan.price}
                  </span>
                  {plan.priceNote && (
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{plan.priceNote}</span>
                  )}
                </div>
                <p className="text-xs mb-5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{plan.desc}</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-xs">
                      <CheckCircle size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--accent)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate(plan.name === 'Écosystème' ? 'home' : 'register')}
                  className={plan.highlighted ? 'btn-primary w-full justify-center' : 'btn-secondary w-full justify-center'}
                >
                  {plan.cta}
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container">
          <div
            className="rounded-3xl p-10 md:p-16 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(45, 212, 191, 0.08) 0%, rgba(96, 165, 250, 0.06) 100%)',
              border: '1px solid rgba(45, 212, 191, 0.2)',
            }}
          >
            <div
              className="absolute inset-0 opacity-5"
              style={{
                background: 'radial-gradient(circle at 50% 50%, var(--accent) 0%, transparent 70%)',
              }}
            />
            <div className="relative">
              <div
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 mx-auto"
                style={{ background: 'rgba(45, 212, 191, 0.15)', color: 'var(--accent)' }}
              >
                <Rocket size={28} />
              </div>
              <h2
                className="text-3xl md:text-5xl font-extrabold mb-4"
                style={{ fontFamily: 'Syne' }}
              >
                Prouve que ton idée
                <br />
                <span className="gradient-text">mérite d&apos;exister</span>
              </h2>
              <p className="text-sm md:text-base max-w-md mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
                Rejoins les entrepreneurs marocains qui valident avant de construire. Gratuit, rapide, sans risque.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => navigate('scan')} className="btn-primary text-base py-4 px-10 animate-pulse-glow">
                  <Zap size={18} />
                  Scanner mon idée maintenant
                </button>
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Users size={14} />
                  <span>1 240+ entrepreneurs déjà inscrits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
