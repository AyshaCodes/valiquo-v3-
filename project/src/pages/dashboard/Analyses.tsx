import { useState } from 'react';
import { Eye, SlidersHorizontal } from 'lucide-react';

const analyses = [
  { id: 1, name: 'Livraison de repas healthy', score: 81, date: '08 Juin 2026', sector: 'Restauration', city: 'Casablanca', swot: { f: 4, fa: 2, o: 3, m: 2 } },
  { id: 2, name: 'Marketplace artisans marocains', score: 68, date: '03 Juin 2026', sector: 'E-commerce', city: 'National', swot: { f: 3, fa: 3, o: 2, m: 3 } },
  { id: 3, name: 'Location de plantes d\'intérieur', score: 55, date: '27 Mai 2026', sector: 'Immobilier', city: 'Rabat', swot: { f: 2, fa: 4, o: 2, m: 3 } },
  { id: 4, name: 'App de cours particuliers', score: 72, date: '20 Mai 2026', sector: 'Éducation', city: 'Rabat', swot: { f: 3, fa: 2, o: 4, m: 2 } },
  { id: 5, name: 'Co-working rural', score: 43, date: '15 Mai 2026', sector: 'Immobilier', city: 'Marrakech', swot: { f: 2, fa: 5, o: 1, m: 4 } },
  { id: 6, name: 'Food truck fusion marocaine', score: 61, date: '10 Mai 2026', sector: 'Restauration', city: 'Casablanca', swot: { f: 3, fa: 3, o: 3, m: 2 } },
];

const sectorFilters = ['Tous', 'Tech', 'Restauration', 'E-commerce', 'Logistique', 'Santé', 'Éducation', 'Finance', 'Immobilier'];
const scoreFilters = [
  { label: 'Tous', min: 0, max: 100 },
  { label: 'Forte demande (70+)', min: 70, max: 100 },
  { label: 'Potentiel moyen (50-69)', min: 50, max: 69 },
  { label: 'Risqué (<50)', min: 0, max: 49 },
];

export default function Analyses() {
  const [sector, setSector] = useState('Tous');
  const [scoreRange, setScoreRange] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = analyses.filter((a) => {
    if (sector !== 'Tous' && a.sector !== sector) return false;
    const range = scoreFilters[scoreRange];
    if (a.score < range.min || a.score > range.max) return false;
    return true;
  });

  const scoreColor = (s: number) => s >= 70 ? 'text-emerald-400' : s >= 50 ? 'text-amber' : 'text-red-400';
  const scoreRing = (s: number) => s >= 70 ? '#34D399' : s >= 50 ? '#FBB024' : '#EF4444';

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-syne font-700 text-xl text-white">Analyses</h1>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition">
          <SlidersHorizontal className="w-4 h-4" /> Filtrer
        </button>
      </div>

      {showFilters && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Secteur</label>
            <div className="flex flex-wrap gap-2">
              {sectorFilters.map((s) => (
                <button key={s} onClick={() => setSector(s)} className={`text-xs px-3 py-1 rounded-full transition ${sector === s ? 'bg-turquoise/10 text-turquoise border border-turquoise/30' : 'bg-slate-800 text-slate-400 hover:text-white border border-transparent'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Score</label>
            <div className="flex flex-wrap gap-2">
              {scoreFilters.map((s, i) => (
                <button key={s.label} onClick={() => setScoreRange(i)} className={`text-xs px-3 py-1 rounded-full transition ${scoreRange === i ? 'bg-turquoise/10 text-turquoise border border-turquoise/30' : 'bg-slate-800 text-slate-400 hover:text-white border border-transparent'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((a) => (
          <div key={a.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-medium text-white text-sm">{a.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{a.date} · {a.city}</p>
              </div>
              <div className="relative w-10 h-10 shrink-0">
                <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#1E293B" strokeWidth="3" />
                  <circle cx="18" cy="18" r="15" fill="none" stroke={scoreRing(a.score)} strokeWidth="3" strokeDasharray={`${(a.score / 100) * 94.2} 94.2`} strokeLinecap="round" />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center font-syne font-700 text-xs ${scoreColor(a.score)}`}>{a.score}</span>
              </div>
            </div>
            <div className="flex gap-2 text-xs mb-3">
              <span className="bg-emerald-400/10 text-emerald-400 px-1.5 py-0.5 rounded">F:{a.swot.f}</span>
              <span className="bg-red-400/10 text-red-400 px-1.5 py-0.5 rounded">Fa:{a.swot.fa}</span>
              <span className="bg-blue-400/10 text-blue-400 px-1.5 py-0.5 rounded">O:{a.swot.o}</span>
              <span className="bg-amber/10 text-amber px-1.5 py-0.5 rounded">M:{a.swot.m}</span>
              <span className="bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">{a.sector}</span>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-turquoise hover:underline">
              <Eye className="w-3.5 h-3.5" /> Voir le détail
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-sm">Aucune analyse ne correspond à ces filtres.</p>
        </div>
      )}
    </div>
  );
}
