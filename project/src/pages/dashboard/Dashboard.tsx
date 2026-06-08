import { NavLink, Outlet } from 'react-router-dom';
import { Zap, LayoutDashboard, FolderOpen, MessageCircle, BarChart3, FileText, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Tableau de bord', end: true },
  { to: '/dashboard', icon: FolderOpen, label: 'Mes projets', end: true },
  { to: '/dashboard/coach', icon: MessageCircle, label: 'Coach IA', end: false },
  { to: '/dashboard/analyses', icon: BarChart3, label: 'Analyses', end: false },
  { to: '/dashboard/rapports', icon: FileText, label: 'Rapports', end: false },
];

export default function Dashboard() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex font-inter">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex flex-col w-[240px] bg-slate-900 border-r border-slate-800 fixed inset-y-0 left-0 z-30">
        <div className="px-4 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-turquoise" />
            <span className="font-syne font-800 text-lg text-white">Valiquo</span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">Copilote entrepreneur</p>
        </div>
        <nav className="flex-1 px-3 py-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                  isActive ? 'bg-turquoise/10 text-turquoise' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-turquoise/20 text-turquoise flex items-center justify-center font-medium text-sm">Y</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">Youssef El Amrani</p>
            </div>
          </div>
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-400/10 w-full transition">
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)}>
          <aside className="w-[260px] h-full bg-slate-900 border-r border-slate-800 p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-turquoise" />
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
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                      isActive ? 'bg-turquoise/10 text-turquoise' : 'text-slate-400 hover:text-white hover:bg-slate-800'
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

      {/* Main content */}
      <div className="flex-1 md:ml-[240px]">
        {/* Mobile top bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-4 h-14 flex items-center justify-between">
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
