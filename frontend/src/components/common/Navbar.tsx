import { useState, useEffect } from 'react';
import { Zap, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import type { Page } from '../../types';
import type { User } from '../../types';

interface NavbarProps {
  page: Page;
  navigate: (to: Page) => void;
  user: User | null;
  onSignOut: () => void;
}

export default function Navbar({ page, navigate, user, onSignOut }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { label: 'Fonctionnalités', anchor: '#features' },
    { label: 'Tarifs', anchor: '#pricing' },
    { label: 'Contact', anchor: '#contact' },
  ];

  const handleAnchor = (anchor: string) => {
    setMenuOpen(false);
    if (page !== 'home') {
      navigate('home');
      setTimeout(() => {
        document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      document.querySelector(anchor)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(15, 23, 42, 0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => navigate('home')}
            className="flex items-center gap-2 group"
            aria-label="Valiquo — Accueil"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}
            >
              <Zap size={16} className="text-slate-900" fill="currentColor" />
            </div>
            <span className="font-bold text-lg" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text-primary)' }}>
              Valiquo
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => handleAnchor(link.anchor)}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button
                  onClick={() => navigate('dashboard')}
                  className="flex items-center gap-2 text-sm font-medium transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  <LayoutDashboard size={16} />
                  {user.prenom || user.email.split('@')[0]}
                </button>
                <button onClick={onSignOut} className="btn-secondary text-xs py-2 px-4">
                  <LogOut size={14} />
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('login')} className="btn-secondary text-xs py-2 px-4">
                  Connexion
                </button>
                <button onClick={() => navigate('scan')} className="btn-primary text-xs py-2 px-4">
                  <Zap size={14} />
                  Scanner mon idée
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          className="md:hidden border-t animate-fade-in"
          style={{ background: 'rgba(15, 23, 42, 0.98)', borderColor: 'var(--border)' }}
        >
          <div className="container py-4 flex flex-col gap-4">
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={() => handleAnchor(link.anchor)}
                className="text-sm font-medium text-left py-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
              </button>
            ))}
            <div className="flex flex-col gap-2 pt-2" style={{ borderTop: '1px solid var(--border)' }}>
              {user ? (
                <>
                  <button onClick={() => { navigate('dashboard'); setMenuOpen(false); }} className="btn-secondary text-sm justify-start">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </button>
                  <button onClick={() => { onSignOut(); setMenuOpen(false); }} className="btn-secondary text-sm justify-start">
                    <LogOut size={16} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { navigate('login'); setMenuOpen(false); }} className="btn-secondary text-sm">
                    Connexion
                  </button>
                  <button onClick={() => { navigate('scan'); setMenuOpen(false); }} className="btn-primary text-sm">
                    <Zap size={14} />
                    Scanner mon idée
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
