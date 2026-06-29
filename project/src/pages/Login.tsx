import { FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth, getAuthErrorMessage } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
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
          <h1 className="font-syne font-700 text-2xl text-white">Connexion</h1>
          <p className="text-slate-500 text-sm mt-1">Accède à ton espace réglementaire</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.ma"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-turquoise/50 transition"
            />
          </div>
          <div>
            <label className="text-sm text-slate-300 mb-1.5 block">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-turquoise/50 transition"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="block w-full bg-turquoise hover:bg-turquoise-dark text-slate-950 font-semibold py-3 rounded-xl text-sm text-center transition shadow-lg shadow-turquoise/20 disabled:opacity-60"
          >
            {submitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          Pas encore de compte ?{' '}
          <Link to="/register" className="text-turquoise hover:underline font-medium">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
