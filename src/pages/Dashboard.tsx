import { useState, useEffect, useRef } from 'react';
import {
  Zap, ArrowRight, TrendingUp, Clock, BarChart3, MessageSquare,
  Send, LogOut, User, MapPin, Star, History, ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Scan, Page } from '../types';

interface DashboardProps {
  navigate: (to: Page) => void;
  user: { id: string; email: string; prenom: string; nom: string; ville: string } | null;
  onSignOut: () => void;
}

const COACH_RESPONSES: Record<string, string> = {
  default: 'Bonjour ! Je suis ton Coach IA Valiquo. Pose-moi une question sur ton idée, ta stratégie de validation ou le marché marocain.',
  score: 'Un bon score de validation se situe au-delà de 70/100. En dessous de 60, je recommande de revoir le positionnement ou de tester un pivot avant d\'investir davantage.',
  marché: 'Le marché marocain est en pleine transformation digitale. Les secteurs Fintech, Edtech et Agritech connaissent une croissance remarquable. L\'accès mobile est un levier clé.',
  prix: 'Pour le marché marocain, commence avec une fourchette test entre 150 et 499 MAD/mois pour les particuliers. Pour les PME, entre 500 et 2000 MAD/mois. Propose d\'abord des offres d\'essai.',
  pivot: 'Un pivot n\'est pas un échec. C\'est une décision stratégique. Je recommande de conserver la technologie ou l\'expertise, et de tester un nouveau segment ou problème adjacent.',
  financement: 'Au Maroc, explore les programmes : Maroc PME, Innov Invest, Startup Maroc, et les fonds régionaux. Le bootstrapping reste la première étape recommandée pour valider sans pression.',
  client: 'Pour tes premiers clients, cible ton réseau immédiat, les groupes Facebook professionnels marocains, et propose une offre pilote avec un accompagnement personnalisé.',
};

function getCoachResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.match(/score|validation|résultat/)) return COACH_RESPONSES.score;
  if (lower.match(/marché|maroc|secteur|tendance/)) return COACH_RESPONSES.marché;
  if (lower.match(/prix|tarif|facturer|combien/)) return COACH_RESPONSES.prix;
  if (lower.match(/pivot|changer|repositionner/)) return COACH_RESPONSES.pivot;
  if (lower.match(/finance|invest|fonds|subvention/)) return COACH_RESPONSES.financement;
  if (lower.match(/client|utilisateur|cible|prospect/)) return COACH_RESPONSES.client;
  return 'C\'est une excellente question. Pour le marché marocain, je recommande de commencer par une validation terrain avec au minimum 15 entretiens qualitatifs. Cela te donnera des données concrètes pour affiner ton approche avant tout investissement majeur.';
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

function CoachChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: COACH_RESPONSES.default },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'assistant', text: getCoachResponse(userMsg) }]);
    }, 1200 + Math.random() * 600);
  };

  const suggestions = ['Comment améliorer mon score ?', 'Quel prix fixer ?', 'Comment trouver mes premiers clients ?'];

  return (
    <div className="card flex flex-col" style={{ height: '420px' }}>
      <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--accent)' }}
        >
          <MessageSquare size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold" style={{ fontFamily: 'Syne' }}>Coach IA Valiquo</h3>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent)' }} />
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>En ligne</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-xs text-xs leading-relaxed px-4 py-3"
              style={{
                background: msg.role === 'user' ? 'rgba(45, 212, 191, 0.15)' : 'rgba(51, 65, 85, 0.5)',
                color: msg.role === 'user' ? 'var(--accent)' : 'var(--text-primary)',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div
              className="px-4 py-3 rounded-2xl rounded-bl-sm"
              style={{ background: 'rgba(51, 65, 85, 0.5)' }}
            >
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--text-secondary)', animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {suggestions.map(s => (
            <button
              key={s}
              onClick={() => { setInput(s); }}
              className="text-xs px-2 py-1 rounded-lg transition-colors"
              style={{
                background: 'rgba(45, 212, 191, 0.08)',
                border: '1px solid rgba(45, 212, 191, 0.2)',
                color: 'var(--accent)',
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Pose ta question..."
            className="input text-xs py-2.5 flex-1"
            aria-label="Message au coach"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="btn-primary text-xs py-2.5 px-3 disabled:opacity-50"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard({ navigate, user, onSignOut }: DashboardProps) {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loadingScans, setLoadingScans] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('login');
      return;
    }
    loadScans();
  }, [user]);

  const loadScans = async () => {
    setLoadingScans(true);
    const { data } = await supabase
      .from('scans')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setScans(data as Scan[]);
    setLoadingScans(false);
  };

  if (!user) return null;

  const avgScore = scans.length > 0 ? Math.round(scans.reduce((a, b) => a + b.score, 0) / scans.length) : 0;
  const bestScore = scans.length > 0 ? Math.max(...scans.map(s => s.score)) : 0;

  const stats = [
    { icon: <BarChart3 size={20} />, label: 'Scans réalisés', value: scans.length, unit: '' },
    { icon: <Star size={20} />, label: 'Score moyen', value: avgScore, unit: '/100' },
    { icon: <TrendingUp size={20} />, label: 'Meilleur score', value: bestScore, unit: '/100' },
    { icon: <Clock size={20} />, label: 'Dernier scan', value: scans[0] ? new Date(scans[0].created_at).toLocaleDateString('fr-MA') : '—', unit: '' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 relative z-10">
      <div className="container max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 animate-fade-in-up">
          <div>
            <p className="section-label mb-2">Dashboard</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>
              Bonjour, {user.prenom || user.email.split('@')[0]} 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Voici un résumé de ton activité sur Valiquo.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('scan')}
              className="btn-primary text-sm py-2.5 px-5"
            >
              <Zap size={15} />
              Nouveau scan
            </button>
            <button
              onClick={onSignOut}
              className="btn-secondary text-sm py-2.5 px-4"
              title="Déconnexion"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-in-up delay-100">
          {stats.map(stat => (
            <div key={stat.label} className="card p-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--accent)' }}
              >
                {stat.icon}
              </div>
              <div className="text-2xl font-extrabold mb-0.5" style={{ fontFamily: 'Syne' }}>
                {stat.value}{stat.unit}
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-5">
            <div className="card p-6 animate-fade-in-up delay-200">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-sm flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
                  <History size={16} style={{ color: 'var(--accent)' }} />
                  Historique des scans
                </h2>
                <button
                  onClick={() => navigate('scan')}
                  className="text-xs transition-colors flex items-center gap-1"
                  style={{ color: 'var(--accent)' }}
                >
                  Nouveau <ArrowRight size={12} />
                </button>
              </div>

              {loadingScans ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className="h-16 rounded-xl"
                      style={{
                        background: 'linear-gradient(90deg, var(--bg-card) 25%, rgba(51,65,85,0.3) 50%, var(--bg-card) 75%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 1.5s infinite',
                      }}
                    />
                  ))}
                </div>
              ) : scans.length === 0 ? (
                <div className="text-center py-10">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'rgba(45, 212, 191, 0.08)', color: 'var(--accent)' }}
                  >
                    <Zap size={24} />
                  </div>
                  <p className="text-sm font-medium mb-1">Aucun scan pour le moment</p>
                  <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Lance ton premier scan pour voir tes résultats ici.
                  </p>
                  <button onClick={() => navigate('scan')} className="btn-primary text-sm">
                    <Zap size={14} />
                    Scanner une idée
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {scans.map(scan => {
                    const color = scan.score >= 75 ? 'var(--accent)' : scan.score >= 55 ? '#FBB024' : '#EF4444';
                    return (
                      <div
                        key={scan.id}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200"
                        style={{
                          background: 'rgba(15, 23, 42, 0.4)',
                          border: '1px solid var(--border)',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.3)';
                          e.currentTarget.style.background = 'rgba(45, 212, 191, 0.04)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--border)';
                          e.currentTarget.style.background = 'rgba(15, 23, 42, 0.4)';
                        }}
                        onClick={() => navigate('scan')}
                      >
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-extrabold"
                          style={{ background: `${color}15`, color, fontFamily: 'Syne', border: `1px solid ${color}30` }}
                        >
                          {scan.score}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{scan.problem.slice(0, 60)}...</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                              <MapPin size={10} />
                              {scan.ville}
                            </span>
                            {scan.secteur && (
                              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>· {scan.secteur}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(scan.created_at).toLocaleDateString('fr-MA')}
                          </span>
                          <ChevronRight size={13} style={{ color: 'var(--text-secondary)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="card p-6 animate-fade-in-up delay-300">
              <h2 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
                <User size={16} style={{ color: 'var(--accent)' }} />
                Mon profil
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Prénom', value: user.prenom || '—' },
                  { label: 'Nom', value: user.nom || '—' },
                  { label: 'Email', value: user.email },
                  { label: 'Ville', value: user.ville || '—' },
                ].map(field => (
                  <div key={field.label} className="p-3 rounded-xl" style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{field.label}</p>
                    <p className="text-sm font-medium truncate">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-5">
            <div className="animate-fade-in-up delay-200">
              <CoachChat />
            </div>

            <div className="card p-5 animate-fade-in-up delay-300">
              <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
                <Zap size={16} style={{ color: 'var(--accent)' }} />
                Actions rapides
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Lancer un nouveau scan', icon: <Zap size={14} />, action: () => navigate('scan') },
                  { label: 'Voir mes analyses', icon: <BarChart3 size={14} />, action: () => navigate('scan') },
                  { label: 'Explorer les tarifs', icon: <Star size={14} />, action: () => navigate('home') },
                ].map(item => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-200"
                    style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.3)';
                      e.currentTarget.style.background = 'rgba(45, 212, 191, 0.04)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'rgba(15, 23, 42, 0.4)';
                    }}
                  >
                    <span className="flex items-center gap-3">
                      <span style={{ color: 'var(--accent)' }}>{item.icon}</span>
                      {item.label}
                    </span>
                    <ArrowRight size={14} style={{ color: 'var(--text-secondary)' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </div>
  );
}
