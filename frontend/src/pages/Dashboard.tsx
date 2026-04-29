import { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard, FolderKanban, MessageSquare, BarChart3, ClipboardList, FileText,
  Users, Zap, TrendingUp, MessageCircle, User, LogOut, Send, PlusCircle, ChevronRight, Calendar, Menu, X
} from 'lucide-react';

// Types
interface Project {
  id: string;
  name: string;
  description: string;
  sector: string;
  city: string;
  score: number;
  status: 'completed' | 'in_progress';
  updatedAt: Date;
}

interface DashboardProps {
  navigate?: (to: string) => void;
  user?: { name: string; email: string; city: string; joinDate: string } | null;
  onSignOut?: () => void;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Livraison de repas healthy',
    description: 'Service de livraison de repas sains et équilibrés pour les professionnels à Casablanca.',
    sector: 'Restauration B2C',
    city: 'Casablanca',
    score: 81,
    status: 'completed',
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Marketplace artisans marocains',
    description: 'Plateforme qui connecte les artisans locaux avec des clients partout au Maroc.',
    sector: 'E-commerce Marketplace',
    city: 'Maroc',
    score: 68,
    status: 'completed',
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    name: 'Location de plantes d’intérieur',
    description: 'Abonnement mensuel de plantes pour bureaux et maisons à Casablanca.',
    sector: 'Services B2B',
    city: 'Casablanca',
    score: 55,
    status: 'in_progress',
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
];

// Coach chat component (similaire à l'existant mais plus épuré)
const CoachChat = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'Salut Aicha ! 👋 Pose-moi une question sur ton marché, tes idées ou demande un conseil.' }
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
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setTyping(true);

    // Simuler réponse (tu pourras remplacer par un vrai appel API)
    setTimeout(() => {
      let reply = '';
      if (userMsg.toLowerCase().includes('potentiel') || userMsg.toLowerCase().includes('marché')) {
        reply = 'Le marché est en forte croissance 🌱 Beaucoup de demande, mais attention à la concurrence des applications comme Yassir et Glovo. Je t’envoie une analyse détaillée.';
      } else {
        reply = 'Merci pour ta question. Pour te donner une réponse précise, pourrais-tu préciser le secteur ou la ville ?';
      }
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
      setTyping(false);
    }, 800);
  };

  return (
    <div className="card flex flex-col" style={{ height: '380px' }}>
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(45, 212, 191, 0.1)', color: 'var(--accent)' }}>
            <MessageCircle size={16} />
          </div>
          <div>
            <h3 className="font-bold text-sm">Coach IA</h3>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>En ligne</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] text-xs px-3 py-2 rounded-xl ${msg.role === 'user' ? 'message-user' : 'message-assistant'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-xl bg-gray-700/50">
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Pose ta question..."
            className="input text-xs py-2 flex-1"
          />
          <button onClick={handleSend} disabled={!input.trim()} className="btn-primary text-xs py-2 px-3 disabled:opacity-50">
            <Send size={14} />
          </button>
        </div>
        <div className="mt-2 text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
          Ex: "Quel est le potentiel du marché des repas healthy à Casablanca ?"
        </div>
      </div>
    </div>
  );
};

// Composant principal Dashboard
export default function Dashboard({ navigate, user, onSignOut }: DashboardProps) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [activeTab, setActiveTab] = useState('projects');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Calcul des statistiques
  const totalProjects = projects.length;
  const inProgressCount = projects.filter(p => p.status === 'in_progress').length;
  const avgScore = Math.round(projects.reduce((acc, p) => acc + p.score, 0) / totalProjects);
  const opportunities = projects.filter(p => p.score >= 70).length;
  const markets = [...new Set(projects.map(p => p.city))].slice(0, 2); // Casablanca, Rabat (mock)

  // Données utilisateur (si non fournies)
  const defaultUser = {
    name: 'Aicha Soumaré',
    email: 'aicha@example.com',
    city: 'Casablanca, Maroc',
    joinDate: 'Mai 2024',
  };
  const currentUser = user || defaultUser;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Desktop */}
      <aside className="w-64 fixed inset-y-0 left-0 z-20 hidden lg:flex flex-col border-r" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="p-6">
          <h1 className="text-xl font-bold" style={{ fontFamily: 'Syne', color: 'var(--accent)' }}>Valiquo</h1>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Copilote entrepreneur</p>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
            { id: 'projects', label: 'Mes projets', icon: FolderKanban },
            { id: 'coach', label: 'Coach IA', icon: MessageCircle },
            { id: 'analyses', label: 'Analyses', icon: BarChart3 },
            { id: 'questionnaires', label: 'Questionnaires', icon: ClipboardList },
            { id: 'reports', label: 'Rapports', icon: FileText },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                activeTab === item.id ? 'bg-accent/10 text-accent' : 'hover:bg-white/5'
              }`}
              style={{ color: activeTab === item.id ? 'var(--accent)' : 'var(--text-secondary)' }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex-col border-r transform transition-transform duration-300 ease-in-out lg:hidden ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`} style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold" style={{ fontFamily: 'Syne', color: 'var(--accent)' }}>Valiquo</h1>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Copilote entrepreneur</p>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X size={20} />
            </button>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1 py-4">
          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
            { id: 'projects', label: 'Mes projets', icon: FolderKanban },
            { id: 'coach', label: 'Coach IA', icon: MessageCircle },
            { id: 'analyses', label: 'Analyses', icon: BarChart3 },
            { id: 'questionnaires', label: 'Questionnaires', icon: ClipboardList },
            { id: 'reports', label: 'Rapports', icon: FileText },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                activeTab === item.id ? 'bg-accent/10 text-accent' : 'hover:bg-white/5'
              }`}
              style={{ color: activeTab === item.id ? 'var(--accent)' : 'var(--text-secondary)' }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button onClick={onSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Overlay Mobile */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Contenu principal */}
      <main className="lg:ml-64 flex-1 p-6 md:p-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* En-tête */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 lg:mb-12">
            <div className="flex items-center gap-3">
              {/* Menu Hamburger Mobile */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold" style={{ fontFamily: 'Syne' }}>Bonjour {currentUser.name.split(' ')[0]}</h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Voici un aperçu de tes projets et de leur validation.</p>
              </div>
            </div>
            <button className="btn-primary text-sm py-2 px-4 whitespace-nowrap">
              <PlusCircle size={16} /> Nouveau projet
            </button>
          </div>

          {/* Cartes stats avec marge responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 mt-8 lg:mt-16">
            <div className="card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Projets</p>
                  <p className="text-2xl font-bold mt-1">{totalProjects}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10 text-accent">
                  <FolderKanban size={20} />
                </div>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>{inProgressCount} en cours d'analyse</p>
            </div>

            <div className="card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Score moyen</p>
                  <p className="text-2xl font-bold mt-1">{avgScore} <span className="text-sm font-normal">/100</span></p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-green-500/10 text-green-500">
                  <TrendingUp size={20} />
                </div>
              </div>
              <p className="text-xs mt-2 text-green-500">+6 pts ce mois-ci</p>
            </div>

            <div className="card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Opportunités</p>
                  <p className="text-2xl font-bold mt-1">{opportunities}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-yellow-500/10 text-yellow-500">
                  <Zap size={20} />
                </div>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>À fort potentiel</p>
            </div>

            <div className="card p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>Marchés testés</p>
                  <p className="text-2xl font-bold mt-1">{markets.length}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10 text-blue-500">
                  <Users size={20} />
                </div>
              </div>
              <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>{markets.join(', ')}</p>
            </div>
          </div>

          {/* Grille principale : projets + coach/profil */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne projets */}
            <div className="lg:col-span-2 space-y-5">
              <div className="card p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-lg" style={{ fontFamily: 'Syne' }}>Mes projets</h2>
                  <button className="text-xs flex items-center gap-1 text-accent">Voir tous <ChevronRight size={14} /></button>
                </div>
                <div className="space-y-4">
                  {projects.map(project => (
                    <div key={project.id} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border)', background: 'rgba(15, 23, 42, 0.3)' }}>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold">{project.name}</h3>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{project.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700/50">{project.sector}</span>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700/50">{project.city}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-xl font-bold ${project.score >= 70 ? 'text-accent' : project.score >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                            {project.score}
                            <span className="text-sm font-normal">/100</span>
                          </div>
                          <div className="text-xs mt-1">
                            {project.status === 'completed' ? (
                              <span className="text-green-500">Analyse terminée</span>
                            ) : (
                              <span className="text-yellow-500">Analyse en cours</span>
                            )}
                          </div>
                          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                            Mis à jour il y a {Math.ceil((Date.now() - project.updatedAt.getTime()) / (1000 * 60 * 60 * 24))} jours
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Colonne droite : Coach et Profil */}
            <div className="space-y-6">
              <CoachChat />
              
              <div className="card p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">Mon profil</h3>
                  <button className="text-xs text-accent">Voir le profil</button>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{currentUser.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{currentUser.email}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User size={14} style={{ color: 'var(--text-secondary)' }} />
                    <span>{currentUser.city}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />
                    <span>Membre depuis {currentUser.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}