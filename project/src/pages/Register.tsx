import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';

const cities = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Autre'];

export default function Register() {
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', password: '', ville: 'Casablanca' });

  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Zap className="w-7 h-7 text-turquoise" />
            <span className="font-syne font-800 text-2xl text-white">Valiquo</span>
          </Link>
          <h1 className="font-syne font-700 text-2xl text-white">Créer mon compte</h1>
          <p className="text-slate-500 text-sm mt-1">Commence à valider tes idées</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Prénom</label>
              <input
                value={form.prenom}
                onChange={(e) => set('prenom', e.target.value)}
                placeholder="Youssef"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-turquoise/50 transition"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Nom</label>
              <input
                value={form.nom}
                onChange={(e) => set('nom', e.target.value)}
                placeholder="El Amrani"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-turquoise/50 transition"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="ton@email.ma"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-turquoise/50 transition"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-turquoise/50 transition"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Ville</label>
            <select
              value={form.ville}
              onChange={(e) => set('ville', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-turquoise/50 transition appearance-none"
            >
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <Link to="/dashboard" className="block w-full bg-turquoise hover:bg-turquoise-dark text-slate-950 font-medium py-2.5 rounded-lg text-sm text-center transition">
            Créer mon compte
          </Link>
        </div>

        <p className="text-center text-sm text-slate-500 mt-4">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-turquoise hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
