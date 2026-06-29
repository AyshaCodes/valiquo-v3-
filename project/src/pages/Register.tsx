import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth, getAuthErrorMessage } from '../contexts/AuthContext';

const villes = ['Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Autre'];

export default function Register() {
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', password: '', ville: 'Casablanca' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const set = (key: string, val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({
        first_name: form.prenom,
        last_name: form.nom,
        email: form.email,
        password: form.password,
        city: form.ville,
      });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 zellige-overlay">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-turquoise rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-slate-950" />
            </div>
            <span className="font-syne font-800 text-2xl text-white">Valiquo</span>
          </Link>
          <h1 className="font-syne font-700 text-2xl text-white">Créer mon compte</h1>
          <p className="text-slate-500 text-sm mt-1">Rejoins les entrepreneurs marocains</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Prénom</label>
              <input
                value={form.prenom}
                onChange={(e) => set('prenom', e.target.value)}
                placeholder="Youssef"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-turquoise/50 transition"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300 mb-1.5 block">Nom</label>
              <input
                value={form.nom}
                onChange={(e) => set('nom', e.target.value)}
                placeholder="El Amrani"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-turquoise/50 transition"
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
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-turquoise/50 transition"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Mot de passe</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-turquoise/50 transition"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Ville</label>
            <select
              value={form.ville}
              onChange={(e) => set('ville', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-turquoise/50 transition appearance-none"
            >
              {villes.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="block w-full bg-turquoise hover:bg-turquoise-dark text-slate-950 font-semibold py-3 rounded-xl text-sm text-center transition shadow-lg shadow-turquoise/20 disabled:opacity-60"
          >
            {submitting ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-turquoise hover:underline font-medium">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
