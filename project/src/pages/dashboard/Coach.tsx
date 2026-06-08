import { useState } from 'react';
import { Send, Plus, FolderOpen } from 'lucide-react';

const conversations = [
  { id: 1, title: 'Livraison healthy - Validation', date: "Aujourd'hui" },
  { id: 2, title: 'Marketplace artisans', date: 'Hier' },
  { id: 3, title: 'Pricing stratégie', date: 'Il y a 3 jours' },
];

const initialMessages = [
  { from: 'bot' as const, text: 'Salut Youssef ! Je suis ton Coach Valiquo. Comment puis-je t\'aider avec tes projets entrepreneuriaux ?' },
  { from: 'user' as const, text: 'Comment valider mon idée de livraison de repas healthy à Casablanca ?' },
  { from: 'bot' as const, text: "Excellente question ! Voici un plan de validation en 3 étapes :\n\n1. **Interviews terrain** : Va dans les coworkings de Maarif et Gauthier. Cible 15-20 jeunes professionnels. Demande-leur comment ils gèrent leurs repas le midi.\n\n2. **Landing page test** : Crée une page de pré-inscription avec un menu type. Mesure le taux de conversion.\n\n3. **MVP pilote** : Lance avec 10 clients pilotes pendant 2 semaines. Mesure la rétention et le NPS.\n\nTu veux que je t'aide à préparer le guide d'entretien ?" },
];

const suggestions = [
  'Comment valider mon idée terrain ?',
  'Quel prix fixer au Maroc ?',
  'Comment trouver mes premiers clients ?',
];

export default function Coach() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [activeConv, setActiveConv] = useState(1);
  const [typing, setTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user' as const, text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot' as const, text: "C'est une bonne question ! Basé sur ton projet et le marché marocain, je te recommande de commencer par une étude terrain rapide. Les données locales montrent que le segment des jeunes professionnels à Casablanca est sous-desservi. Tu veux que je détaille une approche spécifique ?" }]);
      setTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-56px)] md:h-screen">
      {/* Left panel - conversation list */}
      <div className="w-[280px] bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 hidden md:flex">
        <div className="p-3 border-b border-slate-800">
          <button className="w-full flex items-center justify-center gap-2 bg-turquoise/10 hover:bg-turquoise/20 text-turquoise text-sm font-medium py-2 rounded-lg transition">
            <Plus className="w-4 h-4" /> Nouvelle conversation
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveConv(c.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition text-sm ${
                activeConv === c.id ? 'bg-turquoise/10 text-turquoise' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="font-medium truncate">{c.title}</div>
              <div className="text-xs text-slate-600 mt-0.5">{c.date}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Right panel - active chat */}
      <div className="flex-1 flex flex-col">
        {/* Context bar */}
        <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/50 flex items-center gap-2">
          <FolderOpen className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-400">Projet lié :</span>
          <span className="text-xs text-turquoise font-medium">Livraison de repas healthy</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.from === 'user' ? 'justify-end' : ''}`}>
              {m.from === 'bot' && (
                <div className="w-8 h-8 rounded-full bg-turquoise flex items-center justify-center text-slate-950 font-bold text-sm shrink-0">V</div>
              )}
              <div className={`rounded-2xl px-4 py-3 max-w-[75%] text-sm leading-relaxed whitespace-pre-line ${
                m.from === 'bot'
                  ? 'bg-slate-800 text-slate-300 rounded-tl-sm'
                  : 'bg-turquoise/10 border border-turquoise/20 text-turquoise rounded-tr-sm'
              }`}>
                {m.text}
              </div>
              {m.from === 'user' && (
                <div className="w-8 h-8 rounded-full bg-blue/20 text-blue flex items-center justify-center font-bold text-sm shrink-0">Y</div>
              )}
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-turquoise flex items-center justify-center text-slate-950 font-bold text-sm shrink-0">V</div>
              <div className="bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3 dot-pulse flex gap-1.5">
                <span className="w-2 h-2 bg-slate-500 rounded-full inline-block" />
                <span className="w-2 h-2 bg-slate-500 rounded-full inline-block" />
                <span className="w-2 h-2 bg-slate-500 rounded-full inline-block" />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions + input */}
        <div className="px-4 py-3 border-t border-slate-800">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); }}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-3 py-1.5 rounded-full transition"
              >
                {s}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Pose ta question..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-turquoise/50 transition"
            />
            <button onClick={handleSend} className="bg-turquoise hover:bg-turquoise-dark text-slate-950 px-4 py-2.5 rounded-xl transition">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
