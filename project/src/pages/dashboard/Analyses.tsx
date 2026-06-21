import { useState } from 'react';
import { Eye, SlidersHorizontal, FileText, MapPin, Clock } from 'lucide-react';

const analyses = [
  { id: 1, question: 'Création SARL Casablanca', thematique: 'Création d\'entreprise', ville: 'Casablanca', date: '08 Juin 2026' },
  { id: 2, question: 'Régime fiscal auto-entrepreneur', thematique: 'Fiscalité', ville: 'Rabat', date: '03 Juin 2026' },
  { id: 3, question: 'Obligations CNSS employeur', thematique: 'CNSS & Social', ville: 'Casablanca', date: '27 Mai 2026' },
  { id: 4, question: 'Procédure OMPIC marque', thematique: 'Procédures OMPIC', ville: 'National', date: '20 Mai 2026' },
];

const thematiqueFilters = ['Tous', 'Création d\'entreprise', 'Statuts juridiques', 'Fiscalité', 'Procédures OMPIC', 'CNSS & Social', 'Financement'];
const villeFilters = ['Tous', 'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'National'];

export default function Analyses() {
  const [thematique, setThematique] = useState('Tous');
  const [ville, setVille] = useState('Tous');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = analyses.filter((a) => {
    if (thematique !== 'Tous' && a.thematique !== thematique) return false;
    if (ville !== 'Tous' && a.ville !== ville) return false;
    return true;
  });

  return (
    <div className="p-5 md:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="font-syne font-700 text-xl text-white">Analyses</h1>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-3 py-1.5 rounded-lg transition">
          <SlidersHorizontal className="w-4 h-4" /> Filtrer
        </button>
      </div>

      {showFilters && (
        <div className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-4 space-y-4">
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Thématique</label>
            <div className="flex flex-wrap gap-2">
              {thematiqueFilters.map((t) => (
                <button key={t} onClick={() => setThematique(t)} className={`text-xs px-3 py-1 rounded-full transition ${thematique === t ? 'bg-turquoise/10 text-turquoise border border-turquoise/30' : 'bg-slate-800 text-slate-400 hover:text-white border border-transparent'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-2 block">Ville</label>
            <div className="flex flex-wrap gap-2">
              {villeFilters.map((v) => (
                <button key={v} onClick={() => setVille(v)} className={`text-xs px-3 py-1 rounded-full transition ${ville === v ? 'bg-turquoise/10 text-turquoise border border-turquoise/30' : 'bg-slate-800 text-slate-400 hover:text-white border border-transparent'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((a) => (
          <div key={a.id} className="bg-slate-900/50 border border-slate-800/60 rounded-xl p-4 hover:border-slate-700/60 transition">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-turquoise/10 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-turquoise" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white text-sm truncate">{a.question}</h3>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                  <span className="bg-turquoise/10 text-turquoise px-2 py-0.5 rounded-full">{a.thematique}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {a.ville}</div>
              <div className="flex items-center gap-1"><Clock className="w-3 h-3" /> {a.date}</div>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-turquoise hover:underline mt-3">
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
