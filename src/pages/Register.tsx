import { useState } from 'react';
import { Mail, Lock, User, MapPin, Zap, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Page } from '../types';

interface RegisterProps {
  navigate: (to: Page) => void;
}

const VILLES = ['Casablanca', 'Rabat', 'Marrakech', 'Tanger', 'Fès', 'Agadir', 'Meknès', 'Oujda', 'Autre'];

export default function Register({ navigate }: RegisterProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptCgu, setAcceptCgu] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [ville, setVille] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (!acceptCgu) {
      setError("Veuillez accepter les conditions d'utilisation.");
      return;
    }
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { prenom, nom, ville },
        },
      });
      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Cet email est déjà utilisé. Connecte-toi à la place.');
        } else {
          setError(authError.message);
        }
      } else {
        navigate('scan');
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
          <button onClick={() => navigate('home')} className="inline-flex items-center gap-2 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}
            >
              <Zap size={17} className="text-slate-900" fill="currentColor" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'Syne' }}>Valiquo</span>
          </button>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Syne' }}>
            {step === 1 ? 'Crée ton compte' : 'Ton profil'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {step === 1 ? 'Lance-toi, c\'est gratuit.' : 'Dernière étape — personnalise ton expérience.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 mb-8 animate-fade-in">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                style={{
                  background: s < step ? 'var(--accent)' : s === step ? 'rgba(45, 212, 191, 0.2)' : 'var(--bg-card)',
                  border: `2px solid ${s <= step ? 'var(--accent)' : 'var(--border)'}`,
                  color: s < step ? '#0F172A' : s === step ? 'var(--accent)' : 'var(--text-secondary)',
                }}
              >
                {s < step ? <Check size={14} /> : s}
              </div>
              {s < 2 && (
                <div
                  className="w-12 h-0.5 transition-all duration-300"
                  style={{ background: step > 1 ? 'var(--accent)' : 'var(--border)' }}
                />
              )}
            </div>
          ))}
        </div>

        <div
          className="glass rounded-2xl p-8 animate-fade-in-up delay-100"
          style={{ border: '1px solid var(--border)' }}
        >
          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-5">
              <div>
                <label className="block text-xs font-medium mb-2" htmlFor="reg-email">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    id="reg-email"
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
                <label className="block text-xs font-medium mb-2" htmlFor="reg-password">
                  Mot de passe <span style={{ color: 'var(--text-secondary)' }}>(min. 6 caractères)</span>
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input pl-10 pr-10"
                    required
                    minLength={6}
                    autoComplete="new-password"
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
                <div
                  className="mt-1.5 h-1 rounded-full overflow-hidden"
                  style={{ background: 'var(--border)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: password.length === 0 ? '0%' : password.length < 6 ? '33%' : password.length < 10 ? '66%' : '100%',
                      background: password.length < 6 ? '#EF4444' : password.length < 10 ? '#FBB024' : 'var(--accent)',
                    }}
                  />
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200"
                  style={{
                    background: acceptCgu ? 'var(--accent)' : 'transparent',
                    border: `2px solid ${acceptCgu ? 'var(--accent)' : 'var(--border)'}`,
                  }}
                  onClick={() => setAcceptCgu(!acceptCgu)}
                >
                  {acceptCgu && <Check size={11} className="text-slate-900" />}
                </div>
                <input
                  type="checkbox"
                  checked={acceptCgu}
                  onChange={e => setAcceptCgu(e.target.checked)}
                  className="sr-only"
                />
                <span className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  J&apos;accepte les{' '}
                  <span style={{ color: 'var(--accent)' }}>conditions d&apos;utilisation</span>{' '}
                  et la politique de confidentialité
                </span>
              </label>

              {error && (
                <div
                  className="text-xs p-3 rounded-xl animate-fade-in"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444' }}
                >
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary w-full justify-center text-base py-3.5">
                Continuer
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2} className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-2" htmlFor="prenom">Prénom</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                    <input
                      id="prenom"
                      type="text"
                      value={prenom}
                      onChange={e => setPrenom(e.target.value)}
                      placeholder="Youssef"
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" htmlFor="nom">Nom</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                    <input
                      id="nom"
                      type="text"
                      value={nom}
                      onChange={e => setNom(e.target.value)}
                      placeholder="El Fassi"
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-2" htmlFor="ville-select">Ville</label>
                <div className="relative">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 z-10" style={{ color: 'var(--text-secondary)' }} />
                  <select
                    id="ville-select"
                    value={ville}
                    onChange={e => setVille(e.target.value)}
                    className="select pl-10"
                    required
                  >
                    <option value="" disabled>Sélectionne ta ville</option>
                    {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                      <path d="M6 8L2 4h8L6 8z" />
                    </svg>
                  </div>
                </div>
              </div>

              {error && (
                <div
                  className="text-xs p-3 rounded-xl animate-fade-in"
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444' }}
                >
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1 justify-center py-3"
                >
                  Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 justify-center text-sm py-3"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Créer mon compte <ArrowRight size={15} /></>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-sm mt-6 animate-fade-in-up delay-200" style={{ color: 'var(--text-secondary)' }}>
          Déjà un compte ?{' '}
          <button onClick={() => navigate('login')} className="font-medium" style={{ color: 'var(--accent)' }}>
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}
