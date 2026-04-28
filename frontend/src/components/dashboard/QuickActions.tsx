import { 
  Zap, Target, TrendingUp, BookOpen, Users, 
  ArrowRight, Plus, BarChart3, Lightbulb 
} from 'lucide-react';
import type { Page } from '../../types';

interface QuickActionsProps {
  navigate: (to: Page) => void;
  userScans?: number;
}

export default function QuickActions({ navigate, userScans = 0 }: QuickActionsProps) {
  const actions = [
    {
      icon: <Zap size={20} />,
      title: 'Nouveau Scan',
      description: 'Analyser une idée',
      color: 'var(--accent)',
      action: () => navigate('scan'),
      primary: true
    },
    {
      icon: <Target size={20} />,
      title: 'Objectifs',
      description: 'Fixer des targets',
      color: '#8B5CF6',
      action: () => console.log('Objectifs - à implémenter'),
      primary: false
    },
    {
      icon: <BookOpen size={20} />,
      title: 'Ressources',
      description: 'Guides & tutoriels',
      color: '#3B82F6',
      action: () => console.log('Ressources - à implémenter'),
      primary: false
    },
    {
      icon: <Users size={20} />,
      title: 'Communauté',
      description: 'Réseau & partage',
      color: '#10B981',
      action: () => console.log('Communauté - à implémenter'),
      primary: false
    }
  ];

  const suggestions = userScans === 0 ? [
    {
      icon: <Lightbulb size={16} />,
      text: 'Commence par ton premier scan pour découvrir tes forces',
      action: () => navigate('scan')
    },
    {
      icon: <BarChart3 size={16} />,
      text: 'Explore les insights marché pour ton secteur',
      action: () => console.log('Market insights')
    }
  ] : userScans < 3 ? [
    {
      icon: <Target size={16} />,
      text: 'Analyse différents secteurs pour comparer tes scores',
      action: () => navigate('scan')
    },
    {
      icon: <TrendingUp size={16} />,
      text: 'Améliore ton score en affinant ton positionnement',
      action: () => console.log('Coach IA')
    }
  ] : [
    {
      icon: <Plus size={16} />,
      text: 'Teste un pivot ou une nouvelle approche',
      action: () => navigate('scan')
    },
    {
      icon: <BookOpen size={16} />,
      text: 'Approfondis ton analyse avec le Coach IA',
      action: () => console.log('Coach IA')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Actions principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.action}
            className={`card p-4 text-left transition-all duration-300 hover:scale-105 hover:shadow-lg ${
              action.primary ? 'ring-2 ring-opacity-50' : ''
            }`}
            style={{
              borderColor: action.primary ? 'var(--accent)' : 'var(--border)',
              background: action.primary 
                ? 'linear-gradient(135deg, rgba(45, 212, 191, 0.1), rgba(45, 212, 191, 0.05))'
                : 'var(--bg-card)'
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ 
                background: action.primary 
                  ? 'linear-gradient(135deg, var(--accent), var(--accent-dark))'
                  : `${action.color}20`,
                color: action.primary ? '#0F172A' : action.color
              }}
            >
              {action.icon}
            </div>
            <h3 className="font-bold text-sm mb-1" style={{ fontFamily: 'Syne' }}>
              {action.title}
            </h3>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {action.description}
            </p>
            {action.primary && (
              <div className="flex items-center gap-1 mt-2">
                <ArrowRight size={12} style={{ color: 'var(--accent)' }} />
                <span className="text-xs" style={{ color: 'var(--accent)' }}>Commencer</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Suggestions intelligentes */}
      <div className="card p-5">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
          <Lightbulb size={16} style={{ color: 'var(--accent)' }} />
          Suggestions pour toi
        </h3>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={suggestion.action}
              className="w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-opacity-80 text-left"
              style={{
                background: 'rgba(45, 212, 191, 0.05)',
                border: '1px solid rgba(45, 212, 191, 0.2)'
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(45, 212, 191, 0.2)', color: 'var(--accent)' }}
              >
                {suggestion.icon}
              </div>
              <p className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
                {suggestion.text}
              </p>
              <ArrowRight size={14} style={{ color: 'var(--accent)' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
