import { useState, useEffect, useRef } from 'react';
import {
  Zap, MapPin, Briefcase, ArrowRight, Copy, RotateCcw,
  Clock, CheckCircle, TrendingUp, Shield, AlertTriangle, Target,
  ChevronDown, History, User, LogIn
} from 'lucide-react';
import { simulateScan } from '../lib/scanSimulator';
import { supabase } from '../lib/supabase';
import type { ScanResult, Scan, Page } from '../types';

const VILLES = ['National', 'Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir', 'Meknès'];
const SECTEURS = [
  '', 'Tech & Digital', 'E-commerce', 'Foodtech', 'Edtech', 'Fintech', 'Santé', 'Agriculture',
  'Immobilier', 'Transport & Logistique', 'Tourisme', 'Mode & Textile', 'Énergie', 'Autre',
];

const LOADER_STEPS = [
  'Analyse du problème...',
  'Évaluation du marché marocain...',
  'Construction du SWOT...',
  'Génération du plan d\'action...',
];

interface ScoreCircleProps {
  score: number;
}

function ScoreCircle({ score }: ScoreCircleProps) {
  const [displayed, setDisplayed] = useState(0);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (displayed / 100) * circumference;

  useEffect(() => {
    const start = Date.now();
    const duration = 1500;
    const frame = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.floor(eased * score));
      if (progress < 1) requestAnimationFrame(frame);
    };
    const id = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(id);
  }, [score]);

  const color = score >= 75 ? 'var(--accent)' : score >= 55 ? '#FBB024' : '#EF4444';

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--border)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r="45" fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'none', filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold" style={{ fontFamily: 'Syne', color }}>{displayed}</span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>/100</span>
      </div>
    </div>
  );
}

interface ScanResultViewProps {
  result: ScanResult;
  problem: string;
  onReset: () => void;
  onCopy: () => void;
  onNavigate: (to: Page) => void;
}

function ScanResultView({ result, problem, onReset, onCopy, onNavigate }: ScanResultViewProps) {
  const swotSections = [
    { key: 'forces', label: 'Forces', icon: <TrendingUp size={16} />, color: 'var(--accent)', bg: 'rgba(45, 212, 191, 0.08)', border: 'rgba(45, 212, 191, 0.2)' },
    { key: 'faiblesses', label: 'Faiblesses', icon: <Shield size={16} />, color: '#EF4444', bg: 'rgba(239, 68, 68, 0.08)', border: 'rgba(239, 68, 68, 0.2)' },
    { key: 'opportunites', label: 'Opportunités', icon: <Zap size={16} />, color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.08)', border: 'rgba(96, 165, 250, 0.2)' },
    { key: 'menaces', label: 'Menaces', icon: <AlertTriangle size={16} />, color: '#FBB024', bg: 'rgba(251, 176, 36, 0.08)', border: 'rgba(251, 176, 36, 0.2)' },
  ] as const;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="card p-6 text-center">
        <p className="section-label mb-4">Score de validation</p>
        <ScoreCircle score={result.score} />
        <h2 className="text-xl font-bold mt-4 mb-2" style={{ fontFamily: 'Syne' }}>{result.verdict}</h2>
        <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: 'var(--text-secondary)' }}>
          {result.resume}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {result.badges.map(b => (
            <span key={b.label} className={`badge-${b.type}`}>{b.label}</span>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
          <Shield size={16} style={{ color: 'var(--accent)' }} />
          Analyse SWOT
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {swotSections.map(s => {
            const items = result.swot[s.key];
            return (
              <div
                key={s.key}
                className="p-4 rounded-xl"
                style={{ background: s.bg, border: `1px solid ${s.border}` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <span className="text-xs font-semibold" style={{ color: s.color }}>{s.label}</span>
                </div>
                <ul className="space-y-1.5">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background: s.color }} />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
          <MapPin size={16} style={{ color: 'var(--accent)' }} />
          Contexte marché
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{result.contexte}</p>
      </div>

      <div className="card p-6">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
          <Target size={16} style={{ color: 'var(--accent)' }} />
          Plan d&apos;action recommandé
        </h3>
        <div className="space-y-4">
          {result.plan.map((step, i) => (
            <div key={step.step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'rgba(45, 212, 191, 0.15)', color: 'var(--accent)', border: '1px solid rgba(45, 212, 191, 0.3)' }}
                >
                  {step.step}
                </div>
                {i < result.plan.length - 1 && (
                  <div className="w-px flex-1 mt-2" style={{ background: 'var(--border)' }} />
                )}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold" style={{ fontFamily: 'Syne' }}>{step.titre}</h4>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--accent)' }}>
                    {step.duree}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button onClick={onReset} className="btn-secondary flex-1 justify-center">
          <RotateCcw size={15} />
          Nouveau scan
        </button>
        <button onClick={onCopy} className="btn-secondary flex-1 justify-center">
          <Copy size={15} />
          Copier le rapport
        </button>
        <button onClick={() => onNavigate('dashboard')} className="btn-primary flex-1 justify-center">
          <Zap size={15} />
          Coach IA
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

interface ScanHistoryViewProps {
  scans: Scan[];
  onSelect: (scan: Scan) => void;
  currentId?: string;
}

function ScanHistoryView({ scans, onSelect, currentId }: ScanHistoryViewProps) {
  if (scans.length === 0) return null;

  return (
    <div className="card p-5">
      <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
        <History size={16} style={{ color: 'var(--accent)' }} />
        Derniers scans
      </h3>
      <div className="space-y-2">
        {scans.map(scan => {
          const color = scan.score >= 75 ? 'var(--accent)' : scan.score >= 55 ? '#FBB024' : '#EF4444';
          const isActive = scan.id === currentId;
          return (
            <button
              key={scan.id}
              onClick={() => onSelect(scan)}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200"
              style={{
                background: isActive ? 'rgba(45, 212, 191, 0.08)' : 'rgba(15, 23, 42, 0.4)',
                border: `1px solid ${isActive ? 'rgba(45, 212, 191, 0.3)' : 'var(--border)'}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{ background: 'rgba(15, 23, 42, 0.5)', color, fontFamily: 'Syne', border: `1px solid ${color}30` }}
              >
                {scan.score}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{scan.problem.slice(0, 50)}...</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  {scan.ville} · {new Date(scan.created_at).toLocaleDateString('fr-MA')}
                </p>
              </div>
              <ArrowRight size={14} style={{ color: 'var(--text-secondary)', flexShrink: 0 }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ScanProps {
  navigate: (to: Page) => void;
  user: { id: string; email: string; prenom?: string } | null;
}

export default function ScanPage({ navigate, user }: ScanProps) {
  const [problem, setProblem] = useState('');
  const [ville, setVille] = useState('National');
  const [secteur, setSecteur] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaderStep, setLoaderStep] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [currentScanId, setCurrentScanId] = useState<string | undefined>();
  const [history, setHistory] = useState<Scan[]>([]);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) loadHistory();
  }, [user]);

  const loadHistory = async () => {
    const { data } = await supabase
      .from('scans')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setHistory(data as Scan[]);
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim() || problem.length < 20) return;
    setLoading(true);
    setResult(null);
    setCurrentScanId(undefined);
    setLoaderStep(0);

    const stepInterval = setInterval(() => {
      setLoaderStep(prev => Math.min(prev + 1, LOADER_STEPS.length - 1));
    }, 700);

    await new Promise(res => setTimeout(res, 3000));
    clearInterval(stepInterval);
    setLoaderStep(LOADER_STEPS.length - 1);

    const scanResult = simulateScan(problem, ville, secteur);
    setResult(scanResult);
    setLoading(false);

    if (user) {
      const { data } = await supabase
        .from('scans')
        .insert({
          user_id: user.id,
          problem,
          ville,
          secteur,
          score: scanResult.score,
          result: scanResult,
        })
        .select()
        .maybeSingle();
      if (data) {
        setCurrentScanId(data.id);
        loadHistory();
      }
    }

    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleReset = () => {
    setResult(null);
    setProblem('');
    setVille('National');
    setSecteur('');
    setCurrentScanId(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopy = () => {
    if (!result) return;
    const text = [
      `=== RAPPORT VALIQUO ===`,
      `Score: ${result.score}/100 — ${result.verdict}`,
      ``,
      result.resume,
      ``,
      `FORCES:`,
      ...result.swot.forces.map(f => `• ${f.text}`),
      ``,
      `FAIBLESSES:`,
      ...result.swot.faiblesses.map(f => `• ${f.text}`),
      ``,
      `OPPORTUNITÉS:`,
      ...result.swot.opportunites.map(f => `• ${f.text}`),
      ``,
      `MENACES:`,
      ...result.swot.menaces.map(f => `• ${f.text}`),
      ``,
      `CONTEXTE MARCHÉ:`,
      result.contexte,
      ``,
      `PLAN D'ACTION:`,
      ...result.plan.map(p => `${p.step}. ${p.titre}\n   ${p.description}`),
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectHistory = (scan: Scan) => {
    setProblem(scan.problem);
    setVille(scan.ville);
    setSecteur(scan.secteur);
    setResult(scan.result as ScanResult);
    setCurrentScanId(scan.id);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 relative z-10">
      <div className="container max-w-3xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <p className="section-label mb-3">Scanner IA</p>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ fontFamily: 'Syne' }}>
            Décris le problème.
            <br />
            <span className="gradient-text">On trouve la preuve.</span>
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Analyse en 5 minutes · Score · SWOT · Plan d&apos;action
          </p>
          {!user && (
            <div
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-xs"
              style={{ background: 'rgba(251, 176, 36, 0.1)', border: '1px solid rgba(251, 176, 36, 0.3)', color: '#FBB024' }}
            >
              <User size={13} />
              Mode invité — tes scans ne seront pas sauvegardés.{' '}
              <button
                onClick={() => navigate('login')}
                className="underline flex items-center gap-1"
              >
                <LogIn size={11} />
                Se connecter
              </button>
            </div>
          )}
          {user && (
            <div
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-xs"
              style={{ background: 'rgba(45, 212, 191, 0.08)', border: '1px solid rgba(45, 212, 191, 0.2)', color: 'var(--accent)' }}
            >
              <CheckCircle size={13} />
              Connecté en tant que {user.prenom || user.email.split('@')[0]}
            </div>
          )}
        </div>

        {!result && !loading && (
          <div className="space-y-5">
            <form onSubmit={handleScan} className="card p-6 animate-fade-in-up delay-100 space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium" htmlFor="problem-input">
                    Décris le problème que tu veux résoudre
                  </label>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {problem.length}/600
                  </span>
                </div>
                <textarea
                  id="problem-input"
                  value={problem}
                  onChange={e => setProblem(e.target.value)}
                  placeholder="Ex: Les petites épiceries et supérettes marocaines n'ont pas accès à un outil simple et abordable pour gérer leurs stocks, leurs commandes fournisseurs et leur caisse. Elles perdent de l'argent à cause des ruptures et de la désorganisation..."
                  className="input resize-none leading-relaxed"
                  rows={5}
                  maxLength={600}
                  required
                  aria-label="Description du problème"
                  style={{ fontSize: '0.875rem' }}
                />
                {problem.length > 0 && problem.length < 20 && (
                  <p className="text-xs mt-1" style={{ color: '#FBB024' }}>
                    Minimum 20 caractères pour une analyse précise.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-2" htmlFor="ville-scan">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} style={{ color: 'var(--accent)' }} />
                      Ville / Région
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="ville-scan"
                      value={ville}
                      onChange={e => setVille(e.target.value)}
                      className="select"
                    >
                      {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" htmlFor="secteur-scan">
                    <span className="flex items-center gap-1">
                      <Briefcase size={12} style={{ color: 'var(--accent)' }} />
                      Secteur <span style={{ color: 'var(--text-secondary)' }}>(optionnel)</span>
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      id="secteur-scan"
                      value={secteur}
                      onChange={e => setSecteur(e.target.value)}
                      className="select"
                    >
                      {SECTEURS.map(s => <option key={s} value={s}>{s || 'Tous les secteurs'}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={problem.length < 20}
                className="btn-primary w-full justify-center text-base py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              >
                <Zap size={18} />
                Lancer le scan IA
                <ArrowRight size={16} />
              </button>
            </form>

            <ScanHistoryView
              scans={history}
              onSelect={handleSelectHistory}
              currentId={currentScanId}
            />
          </div>
        )}

        {loading && (
          <div className="card p-10 text-center animate-fade-in">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse-glow"
              style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--accent)' }}
            >
              <Zap size={28} />
            </div>
            <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'Syne' }}>Analyse en cours...</h3>
            <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
              {LOADER_STEPS[loaderStep]}
            </p>
            <div className="space-y-3 max-w-xs mx-auto">
              {LOADER_STEPS.map((step, i) => (
                <div key={step} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500"
                    style={{
                      background: i <= loaderStep ? 'rgba(45, 212, 191, 0.15)' : 'rgba(51, 65, 85, 0.3)',
                      border: `1px solid ${i <= loaderStep ? 'rgba(45, 212, 191, 0.4)' : 'var(--border)'}`,
                    }}
                  >
                    {i < loaderStep ? (
                      <CheckCircle size={13} style={{ color: 'var(--accent)' }} />
                    ) : i === loaderStep ? (
                      <div className="w-3 h-3 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
                    ) : (
                      <Clock size={11} style={{ color: 'var(--text-secondary)' }} />
                    )}
                  </div>
                  <span
                    className="text-xs"
                    style={{ color: i <= loaderStep ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {result && !loading && (
          <div ref={resultRef} className="space-y-5">
            {copied && (
              <div
                className="fixed bottom-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in z-50"
                style={{ background: 'var(--accent)', color: '#0F172A' }}
              >
                <CheckCircle size={15} />
                Rapport copié dans le presse-papiers
              </div>
            )}
            <ScanResultView
              result={result}
              problem={problem}
              onReset={handleReset}
              onCopy={handleCopy}
              onNavigate={navigate}
            />
            <ScanHistoryView
              scans={history}
              onSelect={handleSelectHistory}
              currentId={currentScanId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
