import { NavLink, Outlet } from 'react-router-dom';
import { Zap, LayoutDashboard, FolderOpen, MessageCircle, BarChart3, FileText, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord', end: true },
  { to: '/dashboard', icon: FolderOpen, label: 'Mes consultations', end: true },
  { to: '/dashboard/coach', icon: MessageCircle, label: 'Coach IA', end: false },
  { to: '/dashboard/analyses', icon: BarChart3, label: 'Analyses', end: false },
  { to: '/dashboard/rapports', icon: FileText, label: 'Rapports', end: false },
];

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex font-inter zellige-overlay">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex flex-col w-60 bg-slate-900/80 border-r border-slate-800/60 fixed inset-y-0 left-0 z-30">
        <div className="px-5 py-5 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-turquoise rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <span className="font-syne font-800 text-lg text-white">Valiquo</span>
              <p className="text-[10px] text-slate-500 -mt-0.5">Conseiller réglementaire</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive ? 'bg-turquoise/10 text-turquoise font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-slate-800/60">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-turquoise/20 text-turquoise flex items-center justify-center font-medium text-sm">Y</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">Youssef El Amrani</p>
            </div>
          </div>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 w-full transition mt-1">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <aside className="w-64 h-full bg-slate-900 border-r border-slate-800 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-turquoise rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-slate-950" />
                </div>
                <span className="font-syne font-800 text-lg text-white">Valiquo</span>
              </div>
              <button onClick={() => setMobileOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                      isActive ? 'bg-turquoise/10 text-turquoise font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 md:ml-60">
        <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 h-14 flex items-center justify-between">
          <button onClick={() => setMobileOpen(true)}>
            <Menu className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-turquoise" />
            <span className="font-syne font-800 text-lg text-white">Valiquo</span>
          </div>
          <div className="w-5" />
        </div>
        <div className="pt-14 md:pt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
