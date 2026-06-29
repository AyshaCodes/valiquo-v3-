import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, LayoutDashboard, LogOut, Menu, X, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getUserDisplayName, getUserInitial } from '../lib/userDisplay';

const defaultNavLinks = [
  { href: '#modules', label: 'Modules' },
  { href: '#pricing', label: 'Tarifs' },
  { href: '#contact', label: 'Contact' },
];

interface PublicNavbarProps {
  navLinks?: { href: string; label: string }[];
}

export default function PublicNavbar({ navLinks = defaultNavLinks }: PublicNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const displayName = getUserDisplayName(user);
  const initial = getUserInitial(user);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMenuOpen(false);
    await logout();
    navigate('/');
  };

  const primaryCta = user
    ? { to: '/dashboard', label: 'Mon espace' }
    : { to: '/scan', label: 'Poser ma question' };

  const authActions = loading ? (
    <div className="w-28 h-9 rounded-lg bg-slate-800/50 animate-pulse" aria-hidden />
  ) : user ? (
    <div className="relative" ref={userMenuRef}>
      <button
        type="button"
        onClick={() => setUserMenuOpen((open) => !open)}
        className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/80 px-2.5 py-1.5 text-sm text-white hover:border-slate-600 transition"
        aria-expanded={userMenuOpen}
        aria-haspopup="menu"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-turquoise/20 text-xs font-semibold text-turquoise">
          {initial}
        </span>
        <span className="hidden max-w-[120px] truncate font-medium sm:inline">{displayName}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transition ${userMenuOpen ? 'rotate-180' : ''}`} />
      </button>
      {userMenuOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 py-1 shadow-xl">
          <div className="border-b border-slate-800 px-3 py-2">
            <p className="truncate text-sm font-medium text-white">{displayName}</p>
            <p className="truncate text-xs text-slate-500">{user.email}</p>
          </div>
          <Link
            to="/dashboard"
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <LayoutDashboard className="h-4 w-4" />
            Tableau de bord
          </Link>
          <Link
            to="/scan"
            onClick={() => setUserMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            Poser une question
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-400/10 transition"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      )}
    </div>
  ) : (
    <Link to="/login" className="text-sm text-slate-300 hover:text-white transition px-4 py-2 font-medium">
      Connexion
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-turquoise rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-slate-950" />
          </div>
          <span className="font-syne font-800 text-xl text-white">Valiquo</span>
        </Link>

        {navLinks.length > 0 && (
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="text-slate-400 hover:text-white transition text-sm font-medium">
                {link.label}
              </a>
            ))}
          </div>
        )}

        <div className="hidden md:flex items-center gap-3">
          {authActions}
          {!loading && (
            <Link
              to={primaryCta.to}
              className="bg-turquoise hover:bg-turquoise-dark text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-lg transition"
            >
              {primaryCta.label}
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white p-2"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block text-slate-300 text-sm font-medium py-2">
              {link.label}
            </a>
          ))}
          {!loading && !user && (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-slate-300 text-sm font-medium py-2">
              Connexion
            </Link>
          )}
          {!loading && user && (
            <>
              <div className="flex items-center gap-3 py-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-turquoise/20 text-sm font-semibold text-turquoise">
                  {initial}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{displayName}</p>
                  <p className="truncate text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="block text-slate-300 text-sm font-medium py-2">
                Tableau de bord
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full text-left text-red-400 text-sm font-medium py-2"
              >
                Déconnexion
              </button>
            </>
          )}
          {!loading && (
            <Link
              to={primaryCta.to}
              onClick={() => setMenuOpen(false)}
              className="block bg-turquoise text-slate-950 font-semibold text-sm px-4 py-3 rounded-lg text-center"
            >
              {primaryCta.label}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
