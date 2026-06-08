import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, AlertTriangle, CheckCircle2, Copy, RotateCcw, MessageCircle, ChevronRight } from 'lucide-react';

const cities = ['National', 'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Autre'];
const sectors = ['Tous', 'Tech', 'Restauration', 'E-commerce', 'Logistique', 'Santé', 'Éducation', 'Finance', 'Immobilier'];

const loadingSteps = [
  'Analyse du problème',
  'Évaluation du marché marocain',
  'Construction du SWOT',
  'Génération du plan d\'action',
];

const mockResult = {
  score: 78,
  verdict: 'Forte demande',
  city: 'Casablanca',
  sector: 'Logistique',
  swot: {
    forces: ['Forte demande locale non satisfaite', 'Coût de démarrage relativement bas', 'Croissance du e-commerce au Maroc'],
    faiblesses: ['Concurrence des acteurs informels', 'Faible pouvoir d\'achat du segment cible', 'Logistique urbaine complexe à Casablanca'],
    opportunites: ['Expansion vers d\'autres villes marocaines', 'Partenariats avec plateformes e-commerce', 'SubventionsMaroc Digitale 2025'],
    menaces: ['Arrivée de concurrents internationaux', 'Réglementation en évolution', 'Instabilité des coûts carburant'],
  },
  contexte: "Le marché de la logistique urbaine à Casablanca est en pleine expansion grâce à la croissance du e-commerce (+28% en 2024). Les solutions de livraison dernier kilomètre restent fragmentées entre acteurs informels et grandes plateformes. Il existe une opportunité significative pour un acteur local offrant un service fiable et technologiquement avancé.",
  segments: [
    { name: 'Jeunes professionnels', age: '25-35', revenu: '8 000-15 000 MAD', lieu: 'Casablanca', besoin: 'Livraison rapide et fiable' },
    { name: 'Petits e-commerçants', age: '28-45', revenu: '5 000-20 000 MAD', lieu: 'National', besoin: 'Solution logistique abordable' },
  ],
  tam: { tam: '2.4M MAD', sam: '890K MAD', som: '178K MAD' },
  methodes: [
    { title: 'Interviews terrain', desc: '15-20 interviews dans les zones cibles. Guide structuré de 20 min.' },
    { title: 'Landing page test', desc: 'Créer une page de pré-inscription et mesurer le taux de conversion.' },
  ],
  plan: [
    { step: 1, title: 'Validation terrain', desc: 'Mener 20 interviews et tester un MVP avec 10 clients pilotes', timeline: '2 semaines' },
    { step: 2, title: 'Construction MVP', desc: 'Développer la plateforme minimale et signer 3 partenariats locaux', timeline: '4 semaines' },
    { step: 3, title: 'Lancement pilote', desc: 'Lancer à Casablanca avec 50 clients et mesurer la rétention', timeline: '6 semaines' },
  ],
};

function ScoreCircle({ score }: { score: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 2;
      if (current >= score) { current = score; clearInterval(interval); }
      setDisplayed(current);
    }, 20);
    return () => clearInterval(interval);
  }, [score]);

  const circumference = 283;
  const offset = circumference - (displayed / 100) * circumference;
  const color = score >= 70 ? '#2DD4BF' : score >= 50 ? '#FBB024' : '#EF4444';

  return (
    <div className="relative w-32 h-32">
      <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="#1E293B" strokeWidth="6" />
        <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="6" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.1s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-syne font-800 text-3xl text-white">{displayed}</span>
        <span className="text-xs text-slate-500">/100</span>
      </div>
    </div>
  );
}

export default function Scan() {
  const [idea, setIdea] = useState('');
  const [extraInfo, setExtraInfo] = useState('');
  const [city, setCity] = useState('Casablanca');
  const [sector, setSector] = useState('Logistique');
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [result, setResult] = useState<typeof mockResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleScan = () => {
    if (!idea.trim()) return;
    setResult(null);
    setLoading(true);
    setLoadStep(0);
  };

  useEffect(() => {
    if (!loading) return;
    if (loadStep < loadingSteps.length) {
      const timer = setTimeout(() => setLoadStep(loadStep + 1), 1200);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => { setLoading(false); setResult(mockResult); }, 600);
    }
  }, [loading, loadStep]);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNewScan = () => {
    setResult(null);
    setIdea('');
    setExtraInfo('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Zap className="w-10 h-10 text-turquoise mx-auto mb-3 animate-pulse" />
            <h2 className="font-syne font-700 text-2xl text-white">Analyse en cours...</h2>
          </div>
          <div className="space-y-4">
            {loadingSteps.map((step, i) => (
              <div key={step} className={`flex items-center gap-3 transition-all duration-500 ${i <= loadStep - 1 ? 'opacity-100' : 'opacity-20'}`}>
                {i <= loadStep - 1 ? (
                  <CheckCircle2 className="w-5 h-5 text-turquoise shrink-0" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-700 shrink-0" />
                )}
                <span className={`text-sm ${i <= loadStep - 1 ? 'text-white' : 'text-slate-600'}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-slate-950 font-inter">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Score + verdict */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ScoreCircle score={result.score} />
              <div>
                <span className="text-xs bg-turquoise/10 text-turquoise px-2 py-1 rounded-full">{result.verdict}</span>
                <h2 className="font-syne font-700 text-2xl text-white mt-2">Résultat du scan</h2>
                <p className="text-slate-400 text-sm">{result.city} · {result.sector}</p>
              </div>
            </div>
          </div>

          {/* SWOT */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { label: 'Forces', items: result.swot.forces, color: 'emerald', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
              { label: 'Faiblesses', items: result.swot.faiblesses, color: 'red', bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
              { label: 'Opportunités', items: result.swot.opportunites, color: 'blue', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
              { label: 'Menaces', items: result.swot.menaces, color: 'amber', bg: 'bg-amber-500/10', text: 'text-amber', border: 'border-amber-500/20' },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} border ${s.border} rounded-xl p-4`}>
                <h3 className={`font-syne font-700 ${s.text} text-sm mb-3`}>{s.label}</h3>
                <ul className="space-y-2">
                  {s.items.map((item) => (
                    <li key={item} className="text-slate-300 text-sm flex items-start gap-2">
                      <span className={`w-1.5 h-1.5 ${s.text} rounded-full shrink-0 mt-1.5`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contexte marché */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
            <h3 className="font-syne font-700 text-white text-sm mb-2">Contexte marché</h3>
            <p className="text-slate-400 text-sm leading-relaxed">{result.contexte}</p>
          </div>

          {/* Target segments */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {result.segments.map((seg) => (
              <div key={seg.name} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h4 className="font-syne font-700 text-white text-sm mb-3">{seg.name}</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Âge</span><span className="text-slate-300">{seg.age}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Revenu</span><span className="text-slate-300">{seg.revenu}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Lieu</span><span className="text-slate-300">{seg.lieu}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Besoin</span><span className="text-slate-300">{seg.besoin}</span></div>
                </div>
              </div>
            ))}
          </div>

          {/* TAM/SAM/SOM */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
            <h3 className="font-syne font-700 text-white text-sm mb-4">Taille du marché</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: 'TAM', value: result.tam.tam, desc: 'Marché total adressable' },
                { label: 'SAM', value: result.tam.sam, desc: 'Marché adressable' },
                { label: 'SOM', value: result.tam.som, desc: 'Marché obtensible' },
              ].map((m) => (
                <div key={m.label}>
                  <div className="text-xs text-slate-500 mb-1">{m.label}</div>
                  <div className="font-syne font-700 text-xl text-turquoise">{m.value}</div>
                  <div className="text-xs text-slate-600">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Méthodes de collecte */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {result.methodes.map((m) => (
              <div key={m.title} className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <h4 className="font-medium text-white text-sm mb-1">{m.title}</h4>
                <p className="text-slate-400 text-sm">{m.desc}</p>
              </div>
            ))}
          </div>

          {/* Plan d'action */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
            <h3 className="font-syne font-700 text-white text-sm mb-4">Plan d'action</h3>
            <div className="space-y-4">
              {result.plan.map((p) => (
                <div key={p.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-turquoise/10 text-turquoise flex items-center justify-center font-syne font-700 text-sm shrink-0">{p.step}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white text-sm">{p.title}</h4>
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{p.timeline}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleNewScan} className="flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 text-white px-5 py-2.5 rounded-lg text-sm transition">
              <RotateCcw className="w-4 h-4" /> Nouveau scan
            </button>
            <button onClick={handleCopy} className="flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 text-white px-5 py-2.5 rounded-lg text-sm transition">
              <Copy className="w-4 h-4" /> {copied ? 'Copié !' : 'Copier le rapport'}
            </button>
            <Link to="/dashboard/coach" className="flex items-center justify-center gap-2 bg-turquoise hover:bg-turquoise-dark text-slate-950 font-medium px-5 py-2.5 rounded-lg text-sm transition">
              <MessageCircle className="w-4 h-4" /> Coach IA <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-inter">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Banner */}
        <div className="bg-amber/10 border border-amber/20 rounded-xl p-4 flex items-start gap-3 mb-6">
          <AlertTriangle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
          <div>
            <p className="text-amber text-sm font-medium">Mode invité</p>
            <p className="text-slate-400 text-xs">Tes scans ne seront pas sauvegardés. <Link to="/register" className="text-turquoise hover:underline">Crée un compte</Link> pour conserver tes analyses.</p>
          </div>
        </div>

        <h1 className="font-syne font-800 text-3xl text-white mb-2">Scanner mon idée</h1>
        <p className="text-slate-400 text-sm mb-8">Décris ton idée et laisse l'IA analyser sa viabilité sur le marché marocain.</p>

        {/* Form */}
        <div className="space-y-5">
          <div>
            <label className="text-sm text-slate-300 mb-2 block">Décris le problème que tu veux résoudre</label>
            <textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              maxLength={600}
              placeholder="Ex: Les jeunes professionnels à Casablanca n'ont pas le temps de cuisiner et les options de livraison healthy sont limitées..."
              className="w-full h-36 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 text-sm resize-none focus:outline-none focus:border-turquoise/50 transition"
            />
            <div className="text-right text-xs text-slate-600 mt-1">{idea.length}/600</div>
          </div>

          <div>
            <label className="text-sm text-slate-300 mb-2 block">Informations complémentaires sur tes clients <span className="text-slate-600">(optionnel)</span></label>
            <textarea
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
              placeholder="Âge, revenus, habitudes, localisation..."
              className="w-full h-24 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 text-sm resize-none focus:outline-none focus:border-turquoise/50 transition"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Ville / Région</label>
              <select value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-turquoise/50 transition appearance-none">
                {cities.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Secteur</label>
              <select value={sector} onChange={(e) => setSector(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-turquoise/50 transition appearance-none">
                {sectors.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <button onClick={handleScan} disabled={!idea.trim()} className="w-full bg-turquoise hover:bg-turquoise-dark disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-medium py-3.5 rounded-xl text-base transition flex items-center justify-center gap-2">
            Lancer le scan IA <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
