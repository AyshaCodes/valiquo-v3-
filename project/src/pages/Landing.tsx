import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, FileText, Scale, BarChart3, Database, ChevronRight, Menu, X, Send, CheckCircle2, Coins, ArrowRight } from 'lucide-react';
import { LuLayers } from '../lib/icons';

const modules = [
  { version: 'V1', status: 'DISPONIBLE', title: 'Module Réglementaire', desc: 'Création d\'entreprise, statuts juridiques, fiscalité', icon: Scale },
  { version: 'V2', status: 'BIENTÔT', title: 'Module Financement', desc: 'Maroc PME, Innov Invest, CCG', icon: Coins },
  { version: 'V3', status: 'ROADMAP', title: 'Module Sectoriel', desc: 'Études de marché par secteur', icon: BarChart3 },
  { version: 'V4', status: 'ROADMAP', title: 'Module Données', desc: 'HCP, Bank Al-Maghrib, statistiques', icon: Database },
];

const problems = [
  { icon: LuLayers, title: 'Lois complexes', desc: 'Le cadre légal marocain évolue constamment et reste difficile à interpréter sans expert' },
  { icon: Coins, title: 'Consultants trop chers', desc: 'Un avocat ou expert-comptable coûte 500 à 2 000 MAD de l\'heure' },
  { icon: FileText, title: 'Informations dispersées', desc: 'OMPIC, DGI, CRI, CNSS — les démarches sont éparpillées entre dizaines de sources' },
];

const plans = [
  { name: 'Starter', price: 'Gratuit', period: '', features: ['3 consultations/mois', 'Coach IA basique', 'Accès module réglementaire', 'Sources officielles'], cta: 'Commencer gratuitement', highlight: false },
  { name: 'Pro', price: '199 MAD', period: '/mois', features: ['Consultations illimitées', 'Coach IA avancé', 'Export PDF', 'Historique complet', 'Support prioritaire'], cta: 'Essayer 14 jours gratuits', highlight: true },
  { name: 'Écosystème', price: 'Sur devis', period: '', features: ['Multi-utilisateurs', 'API dédiée', 'Support dédié', 'Rapports personnalisés', 'Formation équipe'], cta: 'Nous contacter', highlight: false },
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 font-inter zellige-overlay">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-turquoise rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-slate-950" />
            </div>
            <span className="font-syne font-800 text-xl text-white">Valiquo</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#modules" className="text-slate-400 hover:text-white transition text-sm font-medium">Modules</a>
            <a href="#pricing" className="text-slate-400 hover:text-white transition text-sm font-medium">Tarifs</a>
            <a href="#contact" className="text-slate-400 hover:text-white transition text-sm font-medium">Contact</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-300 hover:text-white transition px-4 py-2 font-medium">Connexion</Link>
            <Link to="/scan" className="bg-turquoise hover:bg-turquoise-dark text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-lg transition">Poser ma question</Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3">
            <a href="#modules" className="block text-slate-300 text-sm font-medium py-2">Modules</a>
            <a href="#pricing" className="block text-slate-300 text-sm font-medium py-2">Tarifs</a>
            <a href="#contact" className="block text-slate-300 text-sm font-medium py-2">Contact</a>
            <Link to="/login" className="block text-slate-300 text-sm font-medium py-2">Connexion</Link>
            <Link to="/scan" className="block bg-turquoise text-slate-950 font-semibold text-sm px-4 py-3 rounded-lg text-center">Poser ma question</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-28 pb-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-geometric-glow pointer-events-none" />
        <div className="max-w-5xl mx-auto relative">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-slate-900/80 border border-slate-700/50 rounded-full px-4 py-1.5 text-xs text-slate-300">
              <span className="text-base">🇲🇦</span>
              <span className="font-medium">RÉGLEMENTATION MAROCAINE</span>
              <span className="text-slate-600">·</span>
              <span className="text-turquoise font-medium">IA SPÉCIALISÉE</span>
              <span className="text-slate-600">·</span>
              <span className="bg-turquoise/20 text-turquoise px-2 py-0.5 rounded-full">BÊTA OUVERTE</span>
            </div>
          </div>
          <h1 className="font-syne font-800 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] text-center mb-6">
            <span className="text-white">Comprends le cadre.</span>
            <br />
            <span className="text-turquoise">Avant de te lancer.</span>
          </h1>
          <p className="text-slate-400 text-lg sm:text-xl max-w-3xl mx-auto text-center mb-10 leading-relaxed">
            Valiquo analyse ta question réglementaire en 5 minutes — procédures officielles, obligations légales et plan d'action concret basé sur les textes marocains en vigueur.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Link to="/scan" className="bg-turquoise hover:bg-turquoise-dark text-slate-950 font-semibold px-8 py-4 rounded-xl text-base transition inline-flex items-center justify-center gap-2 shadow-lg shadow-turquoise/20">
              Poser ma question gratuitement <ChevronRight className="w-5 h-5" />
            </Link>
            <a href="#demo" className="border border-slate-600 hover:border-slate-500 text-white font-medium px-8 py-4 rounded-xl text-base transition inline-flex items-center justify-center">
              Voir une démo
            </a>
          </div>
          <p className="text-center text-slate-500 text-sm">
            100% gratuit · Résultats en 5 min · Aucune carte bancaire
          </p>
        </div>
      </section>

      {/* Mock Result Card */}
      <section className="pb-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-slate-800/50 border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-turquoise" />
                <span className="font-syne font-700 text-white">CRÉATION SARL · CASABLANCA</span>
              </div>
              <span className="text-xs bg-turquoise/10 text-turquoise px-3 py-1 rounded-full font-medium">RÉGLEMENTATION</span>
            </div>
            <div className="p-6 lg:p-8">
              <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <FileText className="w-4 h-4 text-turquoise" />
                    <span className="font-medium">Textes officiels analysés</span>
                  </div>
                  <div className="space-y-2">
                    {['Loi 5-96 sur les SARL', 'CGI 2024', 'Guide OMPIC'].map((t) => (
                      <div key={t} className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm text-slate-300">{t}</div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-400 mb-4">Points clés</h4>
                  {[
                    { label: 'Capital minimum', value: '1 MAD (depuis 2018)' },
                    { label: 'Associés', value: '1 à 50 personnes' },
                    { label: 'Délai moyen', value: '72h via CRI Casablanca' },
                    { label: 'Coût estimé', value: '1 000 à 3 000 MAD' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-turquoise shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <span className="text-slate-400">{item.label}:</span>{' '}
                        <span className="text-white font-medium">{item.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-400 mb-4">Plan d'action 3 étapes</h4>
                  {[
                    { step: 1, title: 'Rédiger les statuts', timeline: '1-2 jours' },
                    { step: 2, title: 'Déposer au CRI', timeline: '1-3 jours' },
                    { step: 3, title: 'Immatriculation OMPIC', timeline: '24h' },
                  ].map((s) => (
                    <div key={s.step} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-turquoise/20 text-turquoise flex items-center justify-center text-xs font-bold">{s.step}</div>
                      <div className="flex-1">
                        <div className="text-sm text-white font-medium">{s.title}</div>
                        <div className="text-xs text-slate-500">{s.timeline}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-slate-800/30 border-t border-slate-700/30 px-6 py-3 flex flex-wrap gap-2">
              {['Validé', 'SARL', 'Casablanca', '2024'].map((t) => (
                <span key={t} className="text-xs bg-slate-800 text-slate-400 px-2.5 py-1 rounded-full">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-slate-800/60 bg-slate-900/30">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '50+', label: 'textes officiels analysés' },
            { value: '5 min', label: 'par consultation' },
            { value: '0 MAD', label: 'pour commencer' },
            { value: '100%', label: 'sources officielles marocaines' },
          ].map((stat) => (
            <div key={stat.value}>
              <div className="font-syne font-800 text-2xl sm:text-3xl text-turquoise">{stat.value}</div>
              <div className="text-slate-500 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-syne font-800 text-3xl sm:text-4xl text-white text-center mb-4">Pourquoi les entrepreneurs marocains échouent ?</h2>
          <p className="text-slate-400 text-center mb-14 max-w-2xl mx-auto">Le cadre réglementaire marocain est riche mais complexe. Valiquo le rend accessible.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {problems.map((p) => (
              <div key={p.title} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition">
                <div className="w-12 h-12 rounded-xl bg-turquoise/10 flex items-center justify-center mb-5">
                  <p.icon className="w-6 h-6 text-turquoise" />
                </div>
                <h3 className="font-syne font-700 text-lg text-white mb-2">{p.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-24 px-4 sm:px-6 bg-slate-900/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-syne font-800 text-3xl sm:text-4xl text-white text-center mb-4">Une plateforme qui grandit avec toi</h2>
          <p className="text-slate-400 text-center mb-12">Valiquo évolue pour couvrir tous les aspects de l'entrepreneuriat au Maroc.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {modules.map((m) => (
              <div key={m.version} className={`rounded-xl p-5 border transition ${m.status === 'DISPONIBLE' ? 'bg-slate-900 border-turquoise/30' : 'bg-slate-900/50 border-slate-800'}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-syne font-700 text-turquoise">{m.version}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${m.status === 'DISPONIBLE' ? 'bg-turquoise/10 text-turquoise' : 'bg-slate-800 text-slate-500'}`}>{m.status}</span>
                </div>
                <m.icon className="w-6 h-6 text-slate-300 mb-3" />
                <h3 className="font-syne font-700 text-white mb-1">{m.title}</h3>
                <p className="text-slate-500 text-sm">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coach IA Preview */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-syne font-800 text-3xl sm:text-4xl text-white mb-4">Ton conseiller juridique 24h/24</h2>
            <p className="text-slate-400">Pose tes questions et obtiens des réponses basées sur les textes officiels marocains.</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-slate-800/50 border-b border-slate-700/50 px-5 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-turquoise flex items-center justify-center text-slate-950 font-bold text-sm">V</div>
              <div>
                <div className="text-white text-sm font-medium">Coach Valiquo</div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  <span className="text-xs text-slate-500">En ligne · Spécialisé en droit des affaires marocain</span>
                </div>
              </div>
            </div>
            <div className="p-5 space-y-4 max-h-96 overflow-y-auto">
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-blue/20 flex items-center justify-center text-blue text-xs font-bold shrink-0">Y</div>
                <div className="bg-slate-800 rounded-2xl rounded-tl-md px-4 py-3 text-sm text-slate-300 max-w-lg">
                  Je veux créer une auto-entreprise à Casablanca, par où je commence ?
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-turquoise flex items-center justify-center text-slate-950 text-xs font-bold shrink-0">V</div>
                <div className="bg-slate-800/80 rounded-2xl rounded-tl-md px-4 py-3 text-sm text-slate-300 max-w-lg whitespace-pre-line">
                  Voici les étapes officielles selon la loi 114-13 :{'\n\n'}1. Inscription sur autoentrepreneur.ma (gratuit, 24h){'\n'}2. Obtention du numéro d'identification (48h){'\n'}3. Déclaration CNSS obligatoire dans les 30 jours{'\n\n'}Tu veux que je détaille les obligations fiscales ?
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <div className="bg-turquoise/10 border border-turquoise/20 rounded-2xl rounded-tr-md px-4 py-3 text-sm text-turquoise max-w-lg">
                  Oui, c'est quoi le régime fiscal ?
                </div>
                <div className="w-7 h-7 rounded-full bg-blue/20 flex items-center justify-center text-blue text-xs font-bold shrink-0">Y</div>
              </div>
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-turquoise flex items-center justify-center text-slate-950 text-xs font-bold shrink-0">V</div>
                <div className="bg-slate-800/80 rounded-2xl rounded-tl-md px-4 py-3 text-sm text-slate-300 max-w-lg">
                  En tant qu'auto-entrepreneur, tu bénéficies du régime forfaitaire. Le taux dépend du chiffre d'affaires : 0.5% pour les activités commerciales, 1% pour les services. Tu déclares mensuellement ou trimestriellement via l'interface en ligne...
                </div>
              </div>
            </div>
            <div className="border-t border-slate-800 p-4">
              <div className="flex gap-3">
                <input placeholder="Pose ta question réglementaire..." className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-turquoise/50 transition" />
                <Link to="/dashboard/coach" className="bg-turquoise hover:bg-turquoise-dark text-slate-950 font-medium px-5 py-3 rounded-xl transition flex items-center gap-2">
                  Accéder <Send className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-slate-900/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-syne font-800 text-3xl sm:text-4xl text-white text-center mb-4">Tarifs simples</h2>
          <p className="text-slate-400 text-center mb-12">Accessibles à tous les entrepreneurs marocains.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.name} className={`rounded-2xl p-6 border ${p.highlight ? 'bg-slate-900 border-turquoise/40 shadow-lg shadow-turquoise/10' : 'bg-slate-900/50 border-slate-800'}`}>
                {p.highlight && <div className="text-turquoise text-xs font-semibold mb-3 uppercase tracking-wider">Le plus populaire</div>}
                <h3 className="font-syne font-700 text-xl text-white mb-1">{p.name}</h3>
                <div className="mb-6">
                  <span className="font-syne font-800 text-3xl text-white">{p.price}</span>
                  <span className="text-slate-500 text-sm">{p.period}</span>
                </div>
                <ul className="space-y-3 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="text-sm text-slate-400 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-turquoise shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={p.highlight ? '/scan' : '/register'} className={`block text-center py-3 rounded-xl text-sm font-semibold transition ${p.highlight ? 'bg-turquoise hover:bg-turquoise-dark text-slate-950' : 'border border-slate-700 hover:border-slate-500 text-white'}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-geometric-glow pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="font-syne font-800 text-3xl sm:text-4xl text-white mb-4">Prêt à lancer ton projet en conformité ?</h2>
          <p className="text-slate-400 mb-8">Rejoins les entrepreneurs marocains qui valident avant de construire.</p>
          <Link to="/scan" className="inline-flex items-center gap-2 bg-turquoise hover:bg-turquoise-dark text-slate-950 font-semibold px-8 py-4 rounded-xl text-base transition shadow-lg shadow-turquoise/20">
            Commencer gratuitement <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-800 py-12 px-4 sm:px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-4 gap-8 mb-12">
            <div className="sm:col-span-2">
              <Link to="/" className="inline-flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-turquoise" />
                <span className="font-syne font-800 text-lg text-white">Valiquo</span>
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed">Le droit des affaires marocain, accessible à tous.</p>
            </div>
            <div>
              <h4 className="font-medium text-white text-sm mb-3">Produit</h4>
              <div className="space-y-2 text-sm text-slate-500">
                <a href="#modules" className="block hover:text-slate-300 transition">Modules</a>
                <a href="#pricing" className="block hover:text-slate-300 transition">Tarifs</a>
                <Link to="/scan" className="block hover:text-slate-300 transition">Scanner</Link>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-white text-sm mb-3">Contact</h4>
              <div className="space-y-2 text-sm text-slate-500">
                <p>contact@valiquo.ma</p>
                <p>Casablanca, Maroc 🇲🇦</p>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800/50 text-center text-xs text-slate-600">
            &copy; 2026 Valiquo. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
