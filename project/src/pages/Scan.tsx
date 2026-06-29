import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, AlertTriangle, CheckCircle2, Copy, RotateCcw, MessageCircle, ChevronRight, FileText, Building2, Clock, Coins, Users } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import { useAuth } from '../contexts/AuthContext';

const thematiques = ['Création d\'entreprise', 'Statuts juridiques', 'Fiscalité', 'Procédures OMPIC', 'CNSS & Social', 'Financement', 'Autre'];
const villes = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Autre'];

const loadingSteps = [
  'Analyse de ta question...',
  'Recherche dans les textes officiels marocains...',
  'Consultation CGI 2024 & lois en vigueur...',
  'Génération de ta réponse personnalisée...',
];

const mockResult = {
  question: 'Je veux créer une SARL à Casablanca avec un associé. Quelles sont les étapes, le capital minimum et les obligations fiscales ?',
  thematique: 'Création d\'entreprise',
  ville: 'Casablanca',
  sources: ['Loi 5-96', 'CGI 2024', 'OMPIC', 'Décret 2-21-574', 'CRI Casablanca'],
  summary: 'La création d\'une SARL au Maroc est régie par la Loi 5-96. Depuis 2018, le capital minimum a été supprimé (1 MAD symbolique). Le processus implique OMPIC et le CRI, avec un délai moyen de 72h pour les centres régionaux d\'investissement.',
  pointsCles: [
    'Capital minimum: 1 MAD (depuis la réforme de 2018)',
    'Nombre d\'associés: 1 à 50 personnes physiques ou morales',
    'Délai moyen: 72h via CRI Casablanca (procédure accélérée)',
    'Coût estimé: 1 000 à 3 000 MAD (frais notariaux inclus)',
  ],
  etapes: [
    { step: 1, title: 'Rédiger les statuts', desc: 'Rédiger les statuts de la SARL (modèles disponibles sur OMPIC.ma)', timeline: '1-2 jours' },
    { step: 2, title: 'Constituer le dossier', desc: 'Réunir les documents requis: statuts, copie CIN, attestation de blocage du capital', timeline: '1 jour' },
    { step: 3, title: 'Déposer au CRI', desc: 'Déposer le dossier au Centre Régional d\'Investissement Casablanca', timeline: '1-3 jours' },
    { step: 4, title: 'Immatriculation', desc: 'Obtenir le RC et l\'identification fiscale auprès de l\'OMPIC', timeline: '24h' },
  ],
  obligations: [
    { org: 'OMPIC', role: 'Registre du commerce & propriété intellectuelle', url: 'ompic.ma' },
    { org: 'DGI', role: 'Identifiant fiscal & déclarations fiscales', url: 'tax.gov.ma' },
    { org: 'CRI', role: 'Guichet unique de création d\'entreprise', url: 'cri.ma' },
    { org: 'CNSS', role: 'Affiliation obligatoire si employés', url: 'cnss.ma' },
  ],
  fiscal: 'Régime IS standard (taux de 15% CA < 100M MAD, 20% au-delà). Déclaration annuelle + acomptes provisionnels trimestriels.',
};

function ResultCard({ icon: Icon, title, value }: { icon: React.ElementType; title: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-slate-800/50 rounded-lg px-4 py-3">
      <Icon className="w-5 h-5 text-turquoise shrink-0" />
      <div>
        <div className="text-xs text-slate-500">{title}</div>
        <div className="text-sm text-white font-medium">{value}</div>
      </div>
    </div>
  );
}

export default function Scan() {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [thematique, setThematique] = useState('Création d\'entreprise');
  const [ville, setVille] = useState('Casablanca');
  const [loading, setLoading] = useState(false);
  const [loadStep, setLoadStep] = useState(0);
  const [result, setResult] = useState<typeof mockResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleScan = () => {
    if (!question.trim()) return;
    setResult(null);
    setLoading(true);
    setLoadStep(0);
  };

  useEffect(() => {
    if (!loading) return;
    if (loadStep < loadingSteps.length) {
      const timer = setTimeout(() => setLoadStep(loadStep + 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setTimeout(() => { setLoading(false); setResult(mockResult); }, 400);
    }
  }, [loading, loadStep]);

  const handleCopy = () => { navigator.clipboard.writeText(JSON.stringify(result, null, 2)); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const handleNewScan = () => { setResult(null); setQuestion(''); };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 zellige-overlay">
        <PublicNavbar navLinks={[]} />
        <div className="flex items-center justify-center px-4 pt-24 min-h-screen">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-turquoise/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-turquoise animate-pulse" />
              </div>
              <h2 className="font-syne font-700 text-2xl text-white">Analyse en cours...</h2>
            </div>
            <div className="space-y-3">
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
      </div>
    );
  }

  if (result) {
    return (
      <div className="min-h-screen bg-slate-950 font-inter zellige-overlay">
        <PublicNavbar navLinks={[]} />
        <div className="max-w-4xl mx-auto px-4 pt-24 pb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-6">
            <div className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-turquoise" />
                <span className="font-syne font-700 text-white">Réponse réglementaire</span>
              </div>
              <span className="text-sm text-slate-400">{result.thematique} · {result.ville}</span>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-5">
                <span className="text-xs text-slate-500">Sources consultées:</span>
                {result.sources.map((s) => (
                  <span key={s} className="text-xs bg-turquoise/10 text-turquoise px-2.5 py-1 rounded-full">{s}</span>
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed mb-6">{result.summary}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { icon: Coins, title: 'Capital minimum', value: '1 MAD' },
              { icon: Users, title: 'Associés', value: '1 à 50' },
              { icon: Clock, title: 'Délai moyen', value: '72h' },
            ].map((c) => <ResultCard key={c.title} {...c} />)}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
            <h3 className="font-syne font-700 text-white text-sm mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-turquoise" />
              Points clés à retenir
            </h3>
            <ul className="space-y-2">
              {result.pointsCles.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 bg-turquoise rounded-full shrink-0 mt-1.5" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
            <h3 className="font-syne font-700 text-white text-sm mb-4">Étapes recommandées</h3>
            <div className="space-y-4">
              {result.etapes.map((e) => (
                <div key={e.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-turquoise/20 text-turquoise flex items-center justify-center font-syne font-700 text-sm shrink-0">{e.step}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-white text-sm">{e.title}</h4>
                      <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">{e.timeline}</span>
                    </div>
                    <p className="text-slate-400 text-sm">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-6">
            <h3 className="font-syne font-700 text-white text-sm mb-4">Organismes concernés</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {result.obligations.map((o) => (
                <div key={o.org} className="bg-slate-800/50 rounded-lg p-4 flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-turquoise shrink-0" />
                  <div>
                    <div className="text-sm text-white font-medium">{o.org}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{o.role}</div>
                    <br />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleNewScan} className="flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 text-white px-5 py-2.5 rounded-xl text-sm transition">
              <RotateCcw className="w-4 h-4" /> Nouvelle question
            </button>
            <button onClick={handleCopy} className="flex items-center justify-center gap-2 border border-slate-700 hover:border-slate-500 text-white px-5 py-2.5 rounded-xl text-sm transition">
              <Copy className="w-4 h-4" /> {copied ? 'Copié !' : 'Copier la réponse'}
            </button>
            <Link to="/dashboard/coach" className="flex items-center justify-center gap-2 bg-turquoise hover:bg-turquoise-dark text-slate-950 font-medium px-5 py-2.5 rounded-xl text-sm transition">
              <MessageCircle className="w-4 h-4" /> Coach IA <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-inter zellige-overlay">
      <PublicNavbar navLinks={[]} />
      <div className="max-w-2xl mx-auto px-4 pt-24 pb-8">
        {!user ? (
          <div className="bg-amber/10 border border-amber/20 rounded-xl p-4 flex items-start gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
            <div>
              <p className="text-amber text-sm font-medium">Mode invité</p>
              <p className="text-slate-400 text-xs">Tes consultations ne seront pas sauvegardées. <Link to="/register" className="text-turquoise hover:underline">Crée un compte</Link> pour conserver ton historique.</p>
            </div>
          </div>
        ) : (
          <div className="bg-turquoise/10 border border-turquoise/20 rounded-xl p-4 flex items-start gap-3 mb-6">
            <CheckCircle2 className="w-5 h-5 text-turquoise shrink-0 mt-0.5" />
            <div>
              <p className="text-turquoise text-sm font-medium">Compte connecté</p>
              <p className="text-slate-400 text-xs">Tes consultations seront enregistrées dans ton historique.</p>
            </div>
          </div>
        )}

        <h1 className="font-syne font-800 text-3xl text-white mb-2">Pose ta question réglementaire.</h1>
        <p className="text-slate-400 text-sm mb-8">Décris ton projet et obtiens une réponse basée sur les textes officiels marocains en vigueur.</p>

        <div className="space-y-5">
          <div>
            <label className="text-sm text-slate-300 mb-2 block">Ta question</label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={800}
              placeholder="Ex: Je veux créer une SARL à Casablanca avec un associé. Quelles sont les étapes, le capital minimum et les obligations fiscales ?"
              className="w-full h-40 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 text-sm resize-none focus:outline-none focus:border-turquoise/50 transition"
            />
            <div className="text-right text-xs text-slate-600 mt-1">{question.length}/800</div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Thématique</label>
              <select value={thematique} onChange={(e) => setThematique(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-turquoise/50 transition appearance-none">
                {thematiques.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-2 block">Ville</label>
              <select value={ville} onChange={(e) => setVille(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-turquoise/50 transition appearance-none">
                {villes.map((v) => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>

          <button onClick={handleScan} disabled={!question.trim()} className="w-full bg-turquoise hover:bg-turquoise-dark disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold py-4 rounded-xl text-base transition flex items-center justify-center gap-2 shadow-lg shadow-turquoise/20">
            Analyser ma question <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
