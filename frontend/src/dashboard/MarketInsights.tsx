import { useState, useEffect } from 'react';
import { Globe, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { apiService, type Country } from '../services/api';

interface MarketInsightsProps {
  userCountry?: string;
  onCountryChange?: (country: string) => void;
}

export default function MarketInsights({ userCountry = 'MA', onCountryChange }: MarketInsightsProps) {
  const [selectedCountry, setSelectedCountry] = useState(userCountry);
  const [country, setCountry] = useState<Country | null>(null);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const c = await apiService.getCountryByCode(selectedCountry);
        setCountry(c);
      } catch (error) {
        console.error('Error fetching country:', error);
        setCountry(null);
      }
    };
    
    fetchCountry();
  }, [selectedCountry]);

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code);
    onCountryChange?.(code);
  };

  if (!country) return (
    <div className="card p-5">
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        Pays non trouvé
      </p>
    </div>
  );

  const insights = [
    {
      icon: <TrendingUp size={16} />,
      label: 'Croissance PIB',
      value: `${country.economic_data.gdpGrowth}%`,
      color: country.economic_data.gdpGrowth > 2 ? 'var(--accent)' : '#FBB024',
    },
    {
      icon: <Globe size={16} />,
      label: 'Digitalisation',
      value: `${country.economic_data.digitalPenetration}%`,
      color: country.economic_data.digitalPenetration > 90 ? 'var(--accent)' : '#60A5FA',
    },
    {
      icon: <Target size={16} />,
      label: 'Startups',
      value: country.economic_data.startupDensity.toLocaleString(),
      color: country.economic_data.startupDensity > 5000 ? 'var(--accent)' : '#FBB024',
    },
    {
      icon: <BarChart3 size={16} />,
      label: 'Taille marché',
      value: `${(country.economic_data.marketSize / 1000000000).toFixed(0)}B$`,
      color: country.economic_data.marketSize > 1000000000000 ? 'var(--accent)' : '#60A5FA',
    },
  ];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-sm flex items-center gap-2" style={{ fontFamily: 'Syne' }}>
          <Globe size={16} style={{ color: 'var(--accent)' }} />
          Insights marché
        </h3>
        <label htmlFor="country-select" className="sr-only">Sélectionner un pays</label>
        <select
          id="country-select"
          value={selectedCountry}
          onChange={e => handleCountryChange(e.target.value)}
          className="text-xs px-2 py-1 rounded-lg border"
          style={{ 
            background: 'rgba(15, 23, 42, 0.4)', 
            borderColor: 'var(--border)',
            color: 'var(--text-primary)'
          }}
        >
          <option value="MA">Maroc</option>
          <option value="FR">France</option>
          <option value="CA">Canada</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {insights.map(insight => (
          <div key={insight.label} className="p-3 rounded-xl" style={{ background: 'rgba(15, 23, 42, 0.4)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-1">
              <span style={{ color: insight.color }}>{insight.icon}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{insight.label}</span>
            </div>
            <div className="text-sm font-bold" style={{ color: insight.color, fontFamily: 'Syne' }}>
              {insight.value}
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 rounded-xl" style={{ background: 'rgba(45, 212, 191, 0.08)', border: '1px solid rgba(45, 212, 191, 0.2)' }}>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span className="font-semibold" style={{ color: 'var(--accent)' }}>Top secteurs</span> : {country.sectors.slice(0, 3).map(s => s.name).join(', ')}
        </p>
      </div>
    </div>
  );
}
