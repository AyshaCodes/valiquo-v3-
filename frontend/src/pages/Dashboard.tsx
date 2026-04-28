import { useState, useEffect, useRef } from 'react';
import {
  Zap, ArrowRight, TrendingUp, BarChart3, MessageSquare,
  Send, LogOut, User, MapPin, History, ChevronRight, AlertCircle
} from 'lucide-react';
import MarketInsights from '../dashboard/MarketInsights';
import ProgressChart from '../components/dashboard/ProgressChart';
import QuickActions from '../components/dashboard/QuickActions';
import StatsOverview from '../components/dashboard/StatsOverview';
import type { Scan, Page } from '../types';

interface DashboardProps {
  navigate: (to: Page) => void;
  user: { id: string; email: string; prenom: string; nom: string; ville: string } | null;
  onSignOut: () => void;
}

// ----------------------------- Chat Coach amélioré -----------------------------
const COACH_API_URL = import.meta.env.VITE_COACH_API_URL || 'http://localhost:8000/api/coach/chat';

async function getCoachResponse(input: string): Promise<string> {
  try {
    const response = await fetch(COACH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        message: input,
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur du Coach IA');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Erreur Coach API:', error);
    // Fallback : réponse par défaut si l'API n'est pas disponible
    return "Désolé, je rencontre actuellement des difficultés techniques. Réessaie dans quelques instants ou consulte les ressources disponibles.";
  }
}

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

function CoachChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: "Bonjour ! Je suis ton Coach IA Valiquo. Je peux t'aider pour tes idées de business au Maroc, en France, au Canada ou dans d'autres pays. Pose-moi tes questions !" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setTyping(true);
    const response = await getCoachResponse(userMsg);
    setTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', text: response }]);
  };

  const suggestions = ['Comment améliorer mon score ?', 'Quel prix fixer ?', 'Comment m\'internationaliser ?'];

  return (
    <div className="card flex flex-col" style={{ height: '420px' }}>
      <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--accent)' }}>
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
            <div className="max-w-xs text-xs leading-relaxed px-4 py-3" style={{
              background: msg.role === 'user' ? 'rgba(45, 212, 191, 0.15)' : 'rgba(51, 65, 85, 0.5)',
              color: msg.role === 'user' ? 'var(--accent)' : 'var(--text-primary)',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{ background: 'rgba(51, 65, 85, 0.5)' }}>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--text-secondary)', animation: `bounce 1.2s ${i * 0.2}s ease-in-out infinite` }} />
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
            <button key={s} onClick={() => setInput(s)} className="text-xs px-2 py-1 rounded-lg transition-colors" style={{ background: 'rgba(45, 212, 191, 0.08)', border: '1px solid rgba(45, 212, 191, 0.2)', color: 'var(--accent)' }}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()} placeholder="Pose ta question..." className="input text-xs py-2.5 flex-1" />
          <button onClick={handleSend} disabled={!input.trim()} className="btn-primary text-xs py-2.5 px-3 disabled:opacity-50"><Send size={14} /></button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------- Dashboard principal -----------------------------
export default function Dashboard({ navigate, user, onSignOut }: DashboardProps) {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loadingScans, setLoadingScans] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Temporairement désactivé pour tester - TODO: Réactiver quand l'auth Laravel sera fonctionnelle
  useEffect(() => {
    // if (!user) {
    //   navigate('login');
    //   return;
    // }
    loadScans();
  }, [user]);

  const loadScans = async () => {
    setLoadingScans(true);
    setError(null);
    try {
      // REMPLACER PAR VOTRE VRAI ENDPOINT LARAVEL
      const token = localStorage.getItem('token'); // ou votre méthode de stockage
      const response = await fetch('http://localhost:8000/api/projects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Erreur lors du chargement des projets');
      const data = await response.json();
      // Adaptation des données Laravel vers le type Scan
      const formattedScans: Scan[] = data.map((project: any) => ({
        id: project.id,
        problem: project.name, // ou project.description
        ville: project.city || 'Non précisée',
        secteur: project.sector,
        score: project.score || 0,
        created_at: project.created_at,
      }));
      setScans(formattedScans);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger vos analyses. Veuillez réessayer plus tard.");
      // Fallback : données mock pour le développement (supprimez en production)
      const mockScans: Scan[] = [];
      setScans(mockScans);
    } finally {
      setLoadingScans(false);
    }
  };

  // Temporairement désactivé pour tester - TODO: Réactiver quand l'auth Laravel sera fonctionnelle
  // if (!user) return null;

  const avgScore = scans.length > 0 ? Math.round(scans.reduce((a, b) => a + b.score, 0) / scans.length) : 0;
  const bestScore = scans.length > 0 ? Math.max(...scans.map(s => s.score)) : 0;
  const scores = scans.map(scan => scan.score);
  const labels = scans.map((_, index) => `Scan ${index + 1}`);

  return (
    <div className="min-h-screen pt-24 pb-20 relative z-10">
      <div className="container max-w-5xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 animate-fade-in-up">
          <div>
            <p className="section-label mb-2">Dashboard</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Syne' }}>
              Bonjour, {user?.prenom || user?.email?.split('@')[0] || 'Utilisateur'} 👋
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Voici un résumé de ton activité sur Valiquo.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('scan')} className="btn-primary text-sm py-2.5 px-5">
              <Zap size={15} /> Nouveau scan
            </button>
            <button onClick={onSignOut} className="btn-secondary text-sm py-2.5 px-4" title="Déconnexion">
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="animate-fade-in-up delay-100">
          <StatsOverview scans={scans} avgScore={avgScore} bestScore={bestScore} />
        </div>

        {/* Actions rapides (QuickActions) - une seule fois */}
        <div className="animate-fade-in-up delay-200">
          <QuickActions navigate={navigate} userScans={scans.length} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-5">
            {/* Graphique de progression */}
            {scans.length > 0 && (
              <div className="card p-6 animate-fade-in-up delay-200">
                <h2 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
                  <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
                  Évolution de tes scores
                </h2>
                <ProgressChart scores={scores} labels={labels} />
              </div>
            )}

            {/* Historique des scans */}
            <div className="card p-6 animate-fade-in-up delay-300">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-bold text-sm flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
                  <History size={16} style={{ color: 'var(--accent)' }} />
                  Historique des scans
                </h2>
                <button onClick={() => navigate('scan')} className="text-xs transition-colors flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                  Nouveau <ArrowRight size={12} />
                </button>
              </div>

              {loadingScans ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 rounded-xl" style={{ background: 'linear-gradient(90deg, var(--bg-card) 25%, rgba(51,65,85,0.3) 50%, var(--bg-card) 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-10">
                  <AlertCircle size={32} className="mx-auto mb-3" style={{ color: '#EF4444' }} />
                  <p className="text-sm" style={{ color: '#EF4444' }}>{error}</p>
                  <button onClick={loadScans} className="btn-secondary text-sm mt-4">Réessayer</button>
                </div>
              ) : scans.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(45, 212, 191, 0.08)', color: 'var(--accent)' }}>
                    <Zap size={24} />
                  </div>
                  <p className="text-sm font-medium mb-1">Aucun scan pour le moment</p>
                  <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                    Lance ton premier scan pour voir tes résultats ici.
                  </p>
                  <button onClick={() => navigate('scan')} className="btn-primary text-sm"><Zap size={14} /> Scanner une idée</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {scans.map(scan => {
                    const color = scan.score >= 75 ? 'var(--accent)' : scan.score >= 55 ? '#FBB024' : '#EF4444';
                    return (
                      <div key={scan.id} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200" style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border)' }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(45, 212, 191, 0.3)'; e.currentTarget.style.background = 'rgba(45, 212, 191, 0.04)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(15, 23, 42, 0.4)'; }}
                        onClick={() => navigate('scan')}>
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-extrabold" style={{ background: `${color}15`, color, fontFamily: 'Syne', border: `1px solid ${color}30` }}>
                          {scan.score}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{scan.problem.slice(0, 60)}...</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}><MapPin size={10} /> {scan.ville}</span>
                            {scan.secteur && <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>· {scan.secteur}</span>}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{new Date(scan.created_at).toLocaleDateString('fr-MA')}</span>
                          <ChevronRight size={13} style={{ color: 'var(--text-secondary)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Section Profil */}
            <div className="card p-6 animate-fade-in-up delay-300">
              <h2 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
                <User size={16} style={{ color: 'var(--accent)' }} />
                Mon profil
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Prénom', value: user?.prenom || '—' },
                  { label: 'Nom', value: user?.nom || '—' },
                  { label: 'Email', value: user?.email || '—' },
                  { label: 'Ville', value: user?.ville || '—' },
                ].map(field => (
                  <div key={field.label} className="p-3 rounded-xl" style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border)' }}>
                    <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>{field.label}</p>
                    <p className="text-sm font-medium truncate">{field.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Colonne droite : MarketInsights + CoachChat */}
          <div className="lg:col-span-2 space-y-5">
            <div className="animate-fade-in-up delay-200">
              <MarketInsights userCountry="MA" />
            </div>
            <div className="animate-fade-in-up delay-300">
              <CoachChat />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
      `}</style>
    </div>
  );
}