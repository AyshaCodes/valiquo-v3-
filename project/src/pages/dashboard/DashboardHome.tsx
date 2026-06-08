import { Link } from 'react-router-dom';
import { Plus, ChevronRight, Send, BarChart3, Target, MapPin, FolderOpen } from 'lucide-react';
import { useState } from 'react';

const projects = [
  { title: 'Livraison de repas healthy', desc: 'Plateforme de livraison de repas sains pour jeunes professionnels', tags: ['Restauration', 'Casablanca'], score: 81, status: 'Validé', days: 2 },
  { title: 'Marketplace artisans marocains', desc: 'E-commerce pour produits artisanaux marocains', tags: ['E-commerce', 'National'], score: 68, status: 'En cours', days: 5 },
  { title: 'Location de plantes d\'intérieur', desc: 'Service de location et entretien de plantes pour bureaux', tags: ['Immobilier', 'Rabat'], score: 55, status: 'En cours', days: 12 },
];

const stats = [
  { icon: FolderOpen, label: 'Projets', value: '3', sub: '1 en cours d\'analyse' },
  { icon: BarChart3, label: 'Score moyen', value: '68/100', sub: '+6 pts ce mois-ci', subColor: 'text-emerald-400' },
  { icon: Target, label: 'Opportunités', value: '1', sub: 'À fort potentiel' },
  { icon: MapPin, label: 'Marchés testés', value: '2', sub: 'Casablanca, Maroc' },
];

const chatMessages = [
  { from: 'bot', text: 'Salut Youssef ! Ton projet de livraison healthy a un bon score. Tu veux que je t\'aide à préparer ton plan terrain ?' },
  { from: 'user', text: 'Oui, comment je peux trouver mes 10 premiers clients ?' },
  { from: 'bot', text: 'Commence par les coworkings de Maarif et Gauthier. Prépare un offer de lancement -20% pour les 50 premiers. Je peux t\'aider à rédiger le message d\'approche.' },
];

export default function DashboardHome() {
  const [chatInput, setChatInput] = useState('');

  const scoreColor = (s: number) => s >= 70 ? 'text-emerald-400' : s >= 50 ? 'text-amber' : 'text-red-400';
  const scoreBg = (s: number) => s >= 70 ? 'bg-emerald-400/10 border-emerald-400/20' : s >= 50 ? 'bg-amber/10 border-amber/20' : 'bg-red-400/10 border-red-400/20';
  const statusBg = (s: string) => s === 'Validé' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber/10 text-amber';

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-syne font-700 text-2xl text-white">Bonjour Youssef</h1>
          <p className="text-slate-500 text-sm">Voici un aperçu de tes projets et analyses</p>
        </div>
        <div className="flex gap-2">
          <Link to="/scan" className="border border-slate-700 hover:border-slate-500 text-white text-sm px-4 py-2 rounded-lg transition flex items-center gap-2">
            Scanner mon idée
          </Link>
          <button className="bg-turquoise hover:bg-turquoise-dark text-slate-950 text-sm font-medium px-4 py-2 rounded-lg transition flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nouveau projet
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-4 h-4 text-turquoise" />
              <span className="text-xs text-slate-500">{s.label}</span>
            </div>
            <div className="font-syne font-700 text-xl text-white">{s.value}</div>
            <div className={`text-xs ${s.subColor || 'text-slate-500'} mt-0.5`}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid lg:grid-cols-[1fr_340px] gap-4">
        {/* Projects list */}
        <div className="space-y-3">
          <h2 className="font-syne font-700 text-lg text-white">Mes projets</h2>
          {projects.map((p) => (
            <div key={p.title} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-medium text-white text-sm">{p.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusBg(p.status)}`}>{p.status}</span>
                  </div>
                  <p className="text-slate-500 text-xs mb-2">{p.desc}</p>
                  <div className="flex items-center gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{t}</span>
                    ))}
                    <span className="text-xs text-slate-600">Mis à jour il y a {p.days} jours</span>
                  </div>
                </div>
                <div className={`text-center border rounded-lg px-3 py-2 ${scoreBg(p.score)}`}>
                  <div className={`font-syne font-700 text-lg ${scoreColor(p.score)}`}>{p.score}</div>
                  <div className="text-xs text-slate-500">/100</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coach widget */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col">
          <div className="px-4 py-3 border-b border-slate-800 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-turquoise flex items-center justify-center text-slate-950 font-bold text-xs">V</div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Coach Valiquo</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span className="text-xs text-slate-500">En ligne</span>
              </div>
            </div>
          </div>
          <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto max-h-80">
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.from === 'user' ? 'justify-end' : ''}`}>
                {m.from === 'bot' && <div className="w-6 h-6 rounded-full bg-turquoise flex items-center justify-center text-slate-950 font-bold text-[10px] shrink-0">V</div>}
                <div className={`rounded-xl px-3 py-2 text-xs max-w-[85%] ${m.from === 'bot' ? 'bg-slate-800 text-slate-300 rounded-tl-sm' : 'bg-turquoise/10 border border-turquoise/20 text-turquoise rounded-tr-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Pose ta question..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-xs placeholder-slate-600 focus:outline-none focus:border-turquoise/50 transition"
              />
              <Link to="/dashboard/coach" className="bg-turquoise hover:bg-turquoise-dark text-slate-950 px-3 py-2 rounded-lg transition flex items-center">
                <Send className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
