import { 
  BarChart3, TrendingUp, Target, Award, 
  Zap, Star 
} from 'lucide-react';

interface StatsOverviewProps {
  scans: any[];
  avgScore: number;
  bestScore: number;
}

export default function StatsOverview({ scans, avgScore, bestScore }: StatsOverviewProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return '#10B981';
    if (score >= 60) return '#FBB024';
    return '#EF4444';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 75) return 'Excellent';
    if (score >= 60) return 'Bon';
    if (score >= 40) return 'Moyen';
    return 'À améliorer';
  };

    const improvementRate = scans.length > 1 
    ? Math.round(((scans[scans.length - 1].score - scans[0].score) / scans[0].score) * 100)
    : 0;

  const stats = [
    {
      icon: <BarChart3 size={20} />,
      label: 'Scans totaux',
      value: scans.length,
      unit: '',
      color: 'var(--accent)',
      bg: 'rgba(45, 212, 191, 0.1)'
    },
    {
      icon: <Star size={20} />,
      label: 'Score moyen',
      value: avgScore,
      unit: '/100',
      color: getScoreColor(avgScore),
      bg: `${getScoreColor(avgScore)}20`
    },
    {
      icon: <Award size={20} />,
      label: 'Meilleur score',
      value: bestScore,
      unit: '/100',
      color: getScoreColor(bestScore),
      bg: `${getScoreColor(bestScore)}20`
    },
    {
      icon: <TrendingUp size={20} />,
      label: 'Progression',
      value: improvementRate,
      unit: '%',
      color: improvementRate >= 0 ? '#10B981' : '#EF4444',
      bg: improvementRate >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
    }
  ];

  const performanceLevels = [
    { level: 'Expert', minScore: 75, count: scans.filter(s => s.score >= 75).length },
    { level: 'Avancé', minScore: 60, count: scans.filter(s => s.score >= 60 && s.score < 75).length },
    { level: 'Intermédiaire', minScore: 40, count: scans.filter(s => s.score >= 40 && s.score < 60).length },
    { level: 'Débutant', minScore: 0, count: scans.filter(s => s.score < 40).length }
  ];

  return (
    <div className="space-y-6">
      {/* Stats principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="card p-5 transition-all duration-300 hover:scale-105">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
              style={{ background: stat.bg, color: stat.color }}
            >
              {stat.icon}
            </div>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-2xl font-extrabold" style={{ fontFamily: 'Syne', color: stat.color }}>
                {stat.value}
              </span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {stat.unit}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Répartition des performances */}
      <div className="card p-6">
        <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
          <Target size={16} style={{ color: 'var(--accent)' }} />
          Répartition des performances
        </h3>
        <div className="space-y-3">
          {performanceLevels.map((level, index) => {
            const percentage = scans.length > 0 ? Math.round((level.count / scans.length) * 100) : 0;
            const levelColor = level.minScore >= 75 ? '#10B981' : level.minScore >= 60 ? '#FBB024' : level.minScore >= 40 ? '#3B82F6' : '#EF4444';
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{level.level}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {level.count} scan{level.count !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs font-bold" style={{ color: levelColor }}>
                      {percentage}%
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentage}%`,
                      background: levelColor
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Score actuel et objectif */}
      {scans.length > 0 && (
        <div className="card p-6">
          <h3 className="font-bold text-sm mb-4 flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
            <Zap size={16} style={{ color: 'var(--accent)' }} />
            Performance actuelle
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold" style={{ fontFamily: 'Syne', color: getScoreColor(avgScore) }}>
                  {avgScore}
                </span>
                <span className="text-lg" style={{ color: 'var(--text-secondary)' }}>/100</span>
              </div>
              <span 
                className="inline-block px-3 py-1 rounded-full text-xs font-bold mt-2"
                style={{ 
                  background: `${getScoreColor(avgScore)}20`,
                  color: getScoreColor(avgScore)
                }}
              >
                {getScoreLabel(avgScore)}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Objectif recommandé
              </div>
              <div className="text-xl font-bold" style={{ fontFamily: 'Syne', color: '#10B981' }}>
                75/100
              </div>
              <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                {75 - avgScore > 0 ? `+${75 - avgScore} points` : 'Atteint !'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
