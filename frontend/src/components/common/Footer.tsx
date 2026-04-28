import { Zap, Twitter, Linkedin, Mail } from 'lucide-react';
import type { Page } from '../../types';

interface FooterProps {
  navigate: (to: Page) => void;
}

export default function Footer({ navigate }: FooterProps) {
  return (
    <footer
      id="contact"
      style={{ borderTop: '1px solid var(--border)', background: 'rgba(15, 23, 42, 0.8)' }}
      className="relative z-10"
    >
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}
              >
                <Zap size={16} className="text-slate-900" fill="currentColor" />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif' }}>Valiquo</span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs" style={{ color: 'var(--text-secondary)' }}>
              Valide ta demande marché avant de te lancer. L&apos;outil IA de référence pour les entrepreneurs marocains.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <Twitter size={16} />, label: 'Twitter' },
                { icon: <Linkedin size={16} />, label: 'LinkedIn' },
                { icon: <Mail size={16} />, label: 'Email' },
              ].map(s => (
                <button
                  key={s.label}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--accent)';
                    e.currentTarget.style.color = 'var(--accent)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Produit</h4>
            <ul className="space-y-2">
              {[
                { label: 'Scanner une idée', action: () => navigate('scan') },
                { label: 'Fonctionnalités', action: () => document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' }) },
                { label: 'Tarifs', action: () => document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' }) },
              ].map(link => (
                <li key={link.label}>
                  <button
                    onClick={link.action}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Compte</h4>
            <ul className="space-y-2">
              {[
                { label: 'Se connecter', action: () => navigate('login') },
                { label: 'Créer un compte', action: () => navigate('register') },
                { label: 'Dashboard', action: () => navigate('dashboard') },
              ].map(link => (
                <li key={link.label}>
                  <button
                    onClick={link.action}
                    className="text-sm transition-colors duration-200"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <p>© 2025 Valiquo. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <button className="hover:text-white transition-colors">Confidentialité</button>
            <button className="hover:text-white transition-colors">Conditions d&apos;utilisation</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
