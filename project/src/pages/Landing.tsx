import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, BarChart3, Target, ClipboardList, MapPin, MessageCircle, History, ChevronRight, Menu, X } from 'lucide-react';

const features = [
  { icon: BarChart3, title: 'Score IA', desc: 'Évaluation automatisée de la viabilité de ton idée sur 100 points' },
  { icon: Target, title: 'Analyse SWOT', desc: 'Forces, faiblesses, opportunités et menaces identifiées par IA' },
  { icon: ClipboardList, title: "Plan d'action", desc: 'Étapes concrètes et timeline pour valider ton idée terrain' },
  { icon: MapPin, title: 'Contexte marocain', desc: 'Données adaptées au marché local, villes et secteurs clés' },
  { icon: MessageCircle, title: 'Coach IA', desc: 'Pose tes questions et reçois des conseils personnalisés 24/7' },
  { icon: History, title: 'Historique', desc: 'Sauvegarde et suis tes analyses au fil du temps' },
];

const steps = [
  { n: '01', title: 'Décris ton idée', desc: 'Explique le problème que tu veux résoudre et pour qui' },
  { n: '02', title: 'Lance le scan', desc: "L'IA analyse la demande, le marché et la concurrence au Maroc" },
  { n: '03', title: 'Explore ton rapport', desc: 'Score, SWOT, segments, plan d\'action — tout est là' },
  { n: '04', title: 'Agis avec confiance', desc: 'Valide sur le terrain avec un plan clair et des données solides' },
];

const plans = [
  { name: 'Starter', price: 'Gratuit', period: '', features: ['3 scans / mois', 'Score IA basique', 'SWOT simplifié', 'Sans sauvegarde'], cta: 'Commencer', highlight: false },
  { name: 'Pro', price: '199 MAD', period: '/mois', features: ['Scans illimités', 'Score IA avancé', 'SWOT complet', 'Coach IA', 'Historique & rapports', 'Segments & TAM/SAM/SOM'], cta: 'Scanner mon idée', highlight: true },
  { name: 'Écosystème', price: 'Sur devis', period: '', features: ['Tout le plan Pro', 'Accès API', 'Multi-utilisateurs', 'Rapports personnalisés', 'Support dédié'], cta: 'Nous contacter', highlight: false },
];

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [demoText, setDemoText] = useState('');

  return (
    <div className="min-h-screen bg-slate-950 font-inter">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-turquoise" />
            <span className="font-syne font-800 text-xl text-white">Valiquo</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-400 hover:text-white transition text-sm">Fonctionnalités</a>
            <a href="#pricing" className="text-slate-400 hover:text-white transition text-sm">Tarifs</a>
            <a href="#contact" className="text-slate-400 hover:text-white transition text-sm">Contact</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm text-slate-300 hover:text-white transition px-4 py-2">Connexion</Link>
            <Link to="/scan" className="bg-turquoise hover:bg-turquoise-dark text-slate-950 font-medium text-sm px-5 py-2.5 rounded-lg transition">Scanner mon idée</Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3">
            <a href="#features" className="block text-slate-300 text-sm">Fonctionnalités</a>
            <a href="#pricing" className="block text-slate-300 text-sm">Tarifs</a>
            <a href="#contact" className="block text-slate-300 text-sm">Contact</a>
            <Link to="/login" className="block text-slate-300 text-sm">Connexion</Link>
            <Link to="/scan" className="block bg-turquoise text-slate-950 font-medium text-sm px-4 py-2 rounded-lg text-center">Scanner mon idée</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 600px 400px at 50% 0%, rgba(45,212,191,0.08), transparent)' }} />
        <div className="max-w-4xl mx-auto text-center relative">
          <h1 className="font-syne font-800 text-4xl sm:text-5xl md:text-6xl leading-tight text-white mb-6">
            Prouve la demande.{' '}
            <span className="text-turquoise">Avant de te lancer.</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
            Valiquo scanne ton idée de business en 5 minutes et te donne un score de viabilité, une analyse SWOT et un plan d'action adapté au marché marocain.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/scan" className="bg-turquoise hover:bg-turquoise-dark text-slate-950 font-medium px-8 py-3.5 rounded-lg text-base transition inline-flex items-center justify-center gap-2">
              Scanner mon idée <ChevronRight className="w-4 h-4" />
            </Link>
            <a href="#demo" className="border border-slate-700 hover:border-slate-500 text-white px-8 py-3.5 rounded-lg text-base transition inline-flex items-center justify-center">
              Voir la démo
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-800/60 bg-slate-900/40">
        <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[
            ['90%', 'startups échouent'],
            ['5 min', 'par analyse'],
            ['0 MAD', 'pour commencer'],
            ['1240+', 'signaux analysés'],
          ].map(([val, label]) => (
            <div key={val}>
              <div className="font-syne font-700 text-2xl text-turquoise">{val}</div>
              <div className="text-slate-500 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mock result card */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl shadow-turquoise/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-slate-500">Casablanca · Logistique</span>
            <span className="text-xs bg-turquoise/10 text-turquoise px-2 py-1 rounded-full">Forte demande</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#1E293B" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#2DD4BF" strokeWidth="8" strokeDasharray={`${78 * 2.83} 283`} strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-syne font-700 text-lg text-white">78</span>
            </div>
            <div>
              <div className="text-white font-medium">Score de viabilité</div>
              <div className="text-slate-500 text-sm">78/100 — Bonne opportunité</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg">+ Forces: 4</div>
            <div className="bg-red-500/10 text-red-400 p-2 rounded-lg">- Faiblesses: 2</div>
            <div className="bg-blue-500/10 text-blue-400 p-2 rounded-lg">+ Opportunités: 3</div>
            <div className="bg-amber-500/10 text-amber p-2 rounded-lg">! Menaces: 2</div>
          </div>
        </div>
      </section>

      {/* Why projects fail */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-syne font-700 text-3xl text-white text-center mb-4">Pourquoi tant de projets échouent ?</h2>
          <p className="text-slate-400 text-center mb-12 max-w-2xl mx-auto">Au Maroc, 9 startups sur 10 ne survivent pas. La cause principale : lancer sans valider la demande.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { num: '01', title: 'Pas de validation terrain', desc: "Tu construis sans savoir si quelqu'un veut vraiment ton produit" },
              { num: '02', title: 'Données locales absentes', desc: "Les études de marché génériques ne reflètent pas la réalité marocaine" },
              { num: '03', title: 'Aucun plan structuré', desc: "Tu avances à l'aveugle sans étapes claires ni indicateurs de succès" },
            ].map((c) => (
              <div key={c.num} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <div className="font-syne font-700 text-turquoise text-sm mb-3">{c.num}</div>
                <h3 className="font-syne font-700 text-lg text-white mb-2">{c.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive demo */}
      <section id="demo" className="py-20 px-4 sm:px-6 bg-slate-900/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-syne font-700 text-3xl text-white mb-3">Teste la démo</h2>
          <p className="text-slate-400 mb-8">Décris une idée et vois comment Valiquo l'analyse</p>
          <textarea
            value={demoText}
            onChange={(e) => setDemoText(e.target.value)}
            placeholder="Ex: Une plateforme de livraison de repas healthy à Casablanca pour les jeunes professionnels..."
            maxLength={600}
            className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-white placeholder-slate-600 text-sm resize-none focus:outline-none focus:border-turquoise/50 transition"
          />
          <div className="flex justify-between items-center mt-2 mb-4">
            <span className="text-xs text-slate-600">{demoText.length}/600</span>
          </div>
          <Link to="/scan" className="inline-flex items-center gap-2 bg-turquoise hover:bg-turquoise-dark text-slate-950 font-medium px-6 py-3 rounded-lg transition">
            Analyser (démo) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-syne font-700 text-3xl text-white text-center mb-12">Tout ce dont tu as besoin pour valider</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition">
                <f.icon className="w-8 h-8 text-turquoise mb-4" />
                <h3 className="font-syne font-700 text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-20 px-4 sm:px-6 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-syne font-700 text-3xl text-white text-center mb-12">Comment ça marche</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="text-center">
                <div className="font-syne font-800 text-4xl text-turquoise/20 mb-2">{s.n}</div>
                <h3 className="font-syne font-700 text-white mb-1">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coach preview */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <h2 className="font-syne font-700 text-3xl text-white text-center mb-8">Ton Coach IA</h2>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-turquoise flex items-center justify-center text-slate-950 font-bold text-sm shrink-0">V</div>
              <div className="bg-slate-800 rounded-xl rounded-tl-sm px-4 py-2.5 text-sm text-slate-300 max-w-[80%]">
                Salut ! Je suis ton Coach Valiquo. Tu veux savoir comment tester ton idée sur le marché marocain ?
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="bg-turquoise/10 border border-turquoise/20 rounded-xl rounded-tr-sm px-4 py-2.5 text-sm text-turquoise max-w-[80%]">
                Oui, comment trouver mes premiers clients à Casablanca ?
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-turquoise flex items-center justify-center text-slate-950 font-bold text-sm shrink-0">V</div>
              <div className="bg-slate-800 rounded-xl rounded-tl-sm px-4 py-2.5 text-sm text-slate-300 max-w-[80%]">
                Commence par des interviews dans les coworkings et cafés de Maarif. Cible 15 personnes minimum. Je peux t'aider à préparer un guide d'entretien.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 bg-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-syne font-700 text-3xl text-white text-center mb-12">Tarifs simples</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div key={p.name} className={`rounded-2xl p-6 border ${p.highlight ? 'bg-slate-900 border-turquoise shadow-lg shadow-turquoise/10' : 'bg-slate-900/60 border-slate-800'}`}>
                {p.highlight && <div className="text-turquoise text-xs font-medium mb-3 uppercase tracking-wider">Le plus populaire</div>}
                <h3 className="font-syne font-700 text-xl text-white mb-1">{p.name}</h3>
                <div className="mb-6">
                  <span className="font-syne font-800 text-3xl text-white">{p.price}</span>
                  <span className="text-slate-500 text-sm">{p.period}</span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="text-sm text-slate-400 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-turquoise rounded-full shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to={p.highlight ? '/scan' : '/register'} className={`block text-center py-2.5 rounded-lg text-sm font-medium transition ${p.highlight ? 'bg-turquoise hover:bg-turquoise-dark text-slate-950' : 'border border-slate-700 hover:border-slate-500 text-white'}`}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 400px 300px at 50% 50%, rgba(45,212,191,0.06), transparent)' }} />
        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="font-syne font-800 text-3xl sm:text-4xl text-white mb-4">Prêt à valider ton idée ?</h2>
          <p className="text-slate-400 mb-8">Arrête de deviner. Scanne ton idée en 5 minutes et agis avec confiance.</p>
          <Link to="/scan" className="inline-flex items-center gap-2 bg-turquoise hover:bg-turquoise-dark text-slate-950 font-medium px-8 py-3.5 rounded-lg text-base transition">
            Scanner mon idée <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-slate-800 py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-turquoise" />
              <span className="font-syne font-800 text-lg text-white">Valiquo</span>
            </div>
            <p className="text-slate-500 text-sm">Validation d'idées business par intelligence artificielle, adaptée au marché marocain.</p>
          </div>
          <div>
            <h4 className="font-medium text-white text-sm mb-3">Produit</h4>
            <div className="space-y-2 text-sm text-slate-500">
              <a href="#features" className="block hover:text-slate-300 transition">Fonctionnalités</a>
              <a href="#pricing" className="block hover:text-slate-300 transition">Tarifs</a>
              <Link to="/scan" className="block hover:text-slate-300 transition">Scanner</Link>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-white text-sm mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-slate-500">
              <p>contact@valiquo.ma</p>
              <p>Casablanca, Maroc</p>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-8 pt-6 border-t border-slate-800/50 text-center text-xs text-slate-600">
          &copy; 2026 Valiquo. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}
