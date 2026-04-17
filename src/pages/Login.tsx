import { useState } from 'react';
import { Mail, Lock, Zap, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Page } from '../types';

interface LoginProps {
  navigate: (to: Page) => void;
}

export default function Login({ navigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) {
        setError('Email ou mot de passe incorrect. Vérifiez vos informations.');
      } else {
        navigate('dashboard');
      }
    } catch {
      setError('Une erreur est survenue. Réessayez.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 pb-16 relative z-10">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8 animate-fade-in-up">
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 mb-8"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}
            >
              <Zap size={17} className="text-slate-900" fill="currentColor" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'Syne' }}>Valiquo</span>
          </button>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Syne' }}>
            Bon retour 👋
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Connecte-toi pour accéder à tes analyses
          </p>
        </div>

        <div
          className="glass rounded-2xl p-8 animate-fade-in-up delay-100"
          style={{ border: '1px solid var(--border)' }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium mb-2" htmlFor="email">
                Adresse email
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="ton@email.ma"
                  className="input pl-10"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium" htmlFor="password">
                  Mot de passe
                </label>
                <button
                  type="button"
                  className="text-xs transition-colors"
                  style={{ color: 'var(--accent)' }}
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10 pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-secondary)' }}
                  aria-label={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="text-xs p-3 rounded-xl animate-fade-in"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#EF4444',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-base py-3.5"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>ou</span>
              <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            </div>
            <button
              type="button"
              className="btn-secondary w-full justify-center text-sm py-3"
              onClick={() => setError('Google Sign-In sera disponible prochainement.')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continuer avec Google
            </button>
          </div>
        </div>

        <p className="text-center text-sm mt-6 animate-fade-in-up delay-200" style={{ color: 'var(--text-secondary)' }}>
          Pas encore de compte ?{' '}
          <button
            onClick={() => navigate('register')}
            className="font-medium transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            Créer mon compte
          </button>
        </p>
      </div>
    </div>
  );
}
