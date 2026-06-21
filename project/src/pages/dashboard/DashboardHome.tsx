import { Link } from 'react-router-dom';
import { Plus, ChevronRight, Send, BarChart3, Target, FileText, FolderOpen, Zap, MessageCircle } from 'lucide-react';
import { useState } from 'react';

const consultations = [
  { title: 'Création SARL Casablanca', thematique: 'Création d\'entreprise', status: 'Réponse générée', days: 3 },
  { title: 'Régime fiscal auto-entrepreneur', thematique: 'Fiscalité', status: 'Réponse générée', days: 5 },
  { title: 'Obligations CNSS employeur', thematique: 'CNSS & Social', status: 'En cours', days: 2 },
];

const stats = [
  { icon: FileText, label: 'Consultations', value: '3' },
  { icon: MessageCircle, label: 'Questions au Coach', value: '12' },
  { icon: Target, label: 'Thématiques', value: '2', sub: 'Création, Fiscalité' },
  { icon: BarChart3, label: 'Documents', value: '50+' },
];

const chatMessages = [
  { from: 'bot', text: 'Salut Youssef ! Pose-moi une question sur la réglementation marocaine.' },
];

const suggestions = ['Comment créer une SARL ?', 'Quel est le taux d\'IS ?', 'Comment m\'inscrire à la CNSS ?'];

export default function DashboardHome() {
  const [chatInput, setChatInput] = useState('');

  return (
    <div className="p-5 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-syne font-700 text-2xl text-white">Bonjour Youssef</h1>
          <p className="text-slate-500 text-sm">Voici un aperçu de tes consultations réglementaires</p>
        </div>
        <div className="flex gap-2">
          <Link to="/scan" className="bg-turquoise hover:bg-turquoise-dark text-slate-950 font-semibold text-sm px-4 py-2.5 rounded-lg transition flex items-center gap-2">
            <Plus className="w-4 h-4" /> Poser une question
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-4 h-4 text-turquoise" />
              <span className="text-xs text-slate-500">{s.label}</span>
            </div>
            <div className="font-syne font-700 text-xl text-white">{s.value}</div>
            {s.sub && <div className="text-[10px] text-slate-600 mt-0.5">{s.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <div className="space-y-3">
          <h2 className="font-syne font-700 text-lg text-white">Mes consultations</h2>
          {consultations.map((c) => (
            <div key={c.title} className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-4 hover:border-slate-700 transition cursor-pointer">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-medium text-white text-sm">{c.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${c.status === 'Réponse générée' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber/10 text-amber'}`}>{c.status}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{c.thematique}</span>
                    <span>·</span>
                    <span>Il y a {c.days} jours</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl flex flex-col">
          <div className="px-4 py-3 border-b border-slate-800/60 flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-turquoise flex items-center justify-center text-slate-950 font-bold text-xs">V</div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Coach Valiquo</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span className="text-xs text-slate-500">En ligne</span>
              </div>
            </div>
          </div>
          <div className="flex-1 px-4 py-3 space-y-3 overflow-y-auto max-h-72">
            {chatMessages.map((m, i) => (
              <div key={i} className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-turquoise flex items-center justify-center text-slate-950 font-bold text-[10px] shrink-0">V</div>
                <div className="bg-slate-800 rounded-xl rounded-tl-sm px-3 py-2 text-xs text-slate-300 max-w-[85%]">{m.text}</div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-slate-800/60">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {suggestions.map((s) => (
                <button key={s} onClick={() => setChatInput(s)} className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-1 rounded-full transition">{s}</button>
              ))}
            </div>
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
