import { useState } from 'react';
import { Send, Plus, Scale } from 'lucide-react';

const conversations = [
  { id: 1, title: 'Création SARL - Procédures', date: "Aujourd'hui" },
  { id: 2, title: 'Fiscalité auto-entrepreneur', date: 'Hier' },
  { id: 3, title: 'Obligations CNSS', date: 'Il y a 3 jours' },
];

const initialMessages = [
  { from: 'bot' as const, text: 'Salut Youssef ! Je suis ton conseiller réglementaire spécialisé dans le droit des affaires marocain. Comment puis-je t\'aider ?' },
];

const suggestions = [
  'Comment créer une SARL ?',
  'Quel est le taux d\'IS au Maroc ?',
  'Comment s\'inscrire à la CNSS ?',
  "C'est quoi le statut auto-entrepreneur ?",
];

export default function Coach() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [activeConv, setActiveConv] = useState(1);
  const [typing, setTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, { from: 'user', text: input }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: "D'après la loi 5-96 sur les SARL au Maroc, voici ce que tu dois savoir :\n\n• Le capital minimum est de 1 MAD (symbolique) depuis 2018\n• Tu peux être seul associé ou jusqu'à 50\n• Le délai moyen de création est de 72h via le CRI\n\nTu veux que je détaille les étapes de création ?" }]);
      setTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } };

  return (
    <div className="flex h-[calc(100vh-56px)] md:h-screen">
      <div className="w-[260px] bg-slate-900/80 border-r border-slate-800/60 flex flex-col shrink-0 hidden md:flex">
        <div className="p-3 border-b border-slate-800/60">
          <button className="w-full flex items-center justify-center gap-2 bg-turquoise/10 hover:bg-turquoise/20 text-turquoise text-sm font-semibold py-2.5 rounded-lg transition">
            <Plus className="w-4 h-4" /> Nouvelle conversation
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveConv(c.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition text-sm ${
                activeConv === c.id ? 'bg-turquoise/10 text-turquoise' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <div className="font-medium truncate">{c.title}</div>
              <div className="text-xs text-slate-600 mt-0.5">{c.date}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="px-4 py-2.5 border-b border-slate-800/60 bg-slate-900/40 flex items-center gap-2">
          <Scale className="w-4 h-4 text-turquoise" />
          <span className="text-xs text-slate-400">Spécialisé en droit des affaires marocain</span>
        </div>

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

        <div className="px-4 py-3 border-t border-slate-800/60">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
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
              placeholder="Pose ta question réglementaire..."
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-turquoise/50 transition"
            />
            <button onClick={handleSend} className="bg-turquoise hover:bg-turquoise-dark text-slate-950 px-4 py-3 rounded-xl transition">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
