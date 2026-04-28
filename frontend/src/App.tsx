import { useEffect } from 'react';
import ParticleCanvas from './components/common/ParticleCanvas';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ScanPage from './pages/Scan';
import Dashboard from './pages/Dashboard';
import { useRouter } from './hooks/useRouter';
import { useAuth } from './hooks/useAuth';

export default function App() {
  const { page, navigate } = useRouter();
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0F172A">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>
          <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
        </div>
      </div>
    );
  }

  const showFooter = page === 'home';
  const showParticles = true;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', position: 'relative' }}>
      {showParticles && <ParticleCanvas />}

      <Navbar
        page={page}
        navigate={navigate}
        user={user}
        onSignOut={signOut}
      />

      <main>
        {page === 'home' && <Landing navigate={navigate} />}
        {page === 'scan' && <ScanPage navigate={navigate} user={user} />}
        {page === 'login' && <Login navigate={navigate} />}
        {page === 'register' && <Register navigate={navigate} />}
        {page === 'dashboard' && (
          <Dashboard navigate={navigate} user={user} onSignOut={signOut} />
        )}
      </main>

      {showFooter && <Footer navigate={navigate} />}
    </div>
  );
}
