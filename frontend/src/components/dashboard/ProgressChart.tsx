import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface ProgressChartProps {
  scores: number[];
  labels?: string[];
}

export default function ProgressChart({ scores, labels }: ProgressChartProps) {
  const [maxScore, setMaxScore] = useState(100);
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('stable');

  useEffect(() => {
    if (scores.length > 1) {
      const recent = scores.slice(-3);
      const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
      const previous = scores.slice(-6, -3);
      if (previous.length > 0) {
        const prevAvg = previous.reduce((a, b) => a + b, 0) / previous.length;
        if (avg > prevAvg + 2) setTrend('up');
        else if (avg < prevAvg - 2) setTrend('down');
        else setTrend('stable');
      }
    }
    setMaxScore(Math.max(...scores, 100));
  }, [scores]);

  if (scores.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center" style={{ color: 'var(--text-secondary)' }}>
        <div className="text-center">
          <TrendingUp size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-xs">Aucune donnée à afficher</p>
        </div>
      </div>
    );
  }

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} className="text-green-500" />;
      case 'down': return <TrendingDown size={16} className="text-red-500" />;
      default: return <Minus size={16} className="text-yellow-500" />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return '#10B981';
      case 'down': return '#EF4444';
      default: return '#FBB024';
    }
  };

  return (
    <div className="h-40 flex items-end justify-between gap-2 p-4">
      {scores.map((score, index) => {
        const height = (score / maxScore) * 100;
        const isLatest = index === scores.length - 1;
        
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div className="relative w-full flex flex-col items-center">
              {isLatest && (
                <div className="absolute -top-6 flex items-center gap-1">
                  {getTrendIcon()}
                  <span className="text-xs font-bold" style={{ color: getTrendColor() }}>
                    {score}/100
                  </span>
                </div>
              )}
              <div
                className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                style={{
                  height: `${height}%`,
                  background: isLatest 
                    ? 'linear-gradient(180deg, var(--accent), rgba(45, 212, 191, 0.7))'
                    : 'rgba(45, 212, 191, 0.3)',
                  border: isLatest ? '2px solid var(--accent)' : '1px solid rgba(45, 212, 191, 0.5)',
                  minHeight: '4px'
                }}
              />
            </div>
            {labels && labels[index] && (
              <span className="text-xs mt-1 text-center" style={{ color: 'var(--text-secondary)' }}>
                {labels[index]}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
