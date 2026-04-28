import { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { Country, City, Sector } from '../../types/international';
import { COUNTRIES, getCitiesByCountry, getSectorsByCountry } from '../../data/countries';

interface CountrySelectorProps {
  selectedCountry: string;
  selectedCity?: string;
  selectedSector?: string;
  onCountryChange: (countryCode: string) => void;
  onCityChange: (cityCode?: string) => void;
  onSectorChange: (sectorCode?: string) => void;
}

export default function CountrySelector({
  selectedCountry,
  selectedCity,
  selectedSector,
  onCountryChange,
  onCityChange,
  onSectorChange,
}: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const country = COUNTRIES.find(c => c.code === selectedCountry);
  const cities = getCitiesByCountry(selectedCountry);
  const sectors = getSectorsByCountry(selectedCountry);
  
  const selectedCityData = cities.find(c => c.code === selectedCity);
  const selectedSectorData = sectors.find(s => s.code === selectedSector);

  return (
    <div className="space-y-4">
      {/* Sélecteur de pays */}
      <div>
        <label className="block text-xs font-medium mb-2">
          <span className="flex items-center gap-1">
            <Globe size={12} style={{ color: 'var(--accent)' }} />
            Pays
          </span>
        </label>
        <div className="relative">
          <select
            value={selectedCountry}
            onChange={e => {
              onCountryChange(e.target.value);
              onCityChange(undefined); // Reset city on country change
              onSectorChange(undefined); // Reset sector on country change
            }}
            className="select"
          >
            {COUNTRIES.map(country => (
              <option key={country.code} value={country.code}>
                {country.name} ({country.currency})
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
        </div>
      </div>

      {/* Sélecteur de ville */}
      <div>
        <label className="block text-xs font-medium mb-2">
          <span className="flex items-center gap-1">
            <span style={{ color: 'var(--accent)' }}>📍</span>
            Ville / Région
            <span style={{ color: 'var(--text-secondary)' }}>(optionnel)</span>
          </span>
        </label>
        <div className="relative">
          <select
            value={selectedCity || ''}
            onChange={e => onCityChange(e.target.value || undefined)}
            className="select"
          >
            <option value="">National</option>
            {cities.map(city => (
              <option key={city.code} value={city.code}>
                {city.name} ({city.economicWeight}% PIB)
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
        </div>
      </div>

      {/* Sélecteur de secteur */}
      <div>
        <label className="block text-xs font-medium mb-2">
          <span className="flex items-center gap-1">
            <span style={{ color: 'var(--accent)' }}>💼</span>
            Secteur
            <span style={{ color: 'var(--text-secondary)' }}>(optionnel)</span>
          </span>
        </label>
        <div className="relative">
          <select
            value={selectedSector || ''}
            onChange={e => onSectorChange(e.target.value || undefined)}
            className="select"
          >
            <option value="">Tous les secteurs</option>
            {sectors.map(sector => (
              <option key={sector.code} value={sector.code}>
                {sector.name} ({sector.maturity === 'mature' ? 'Mature' : sector.maturity === 'growing' ? 'En croissance' : 'Émergent'})
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-secondary)' }} />
        </div>
      </div>

      {/* Résumé de la sélection */}
      {country && (
        <div
          className="p-4 rounded-xl text-sm"
          style={{ background: 'rgba(45, 212, 191, 0.08)', border: '1px solid rgba(45, 212, 191, 0.2)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span style={{ color: 'var(--accent)' }}>📊</span>
            <span className="font-semibold" style={{ fontFamily: 'Syne' }}>Contexte marché</span>
          </div>
          <div className="space-y-1" style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
            <p>📍 {country.name} • Croissance PIB: {country.economicData.gdpGrowth}%</p>
            <p>📱 Pénétration digitale: {country.economicData.digitalPenetration}%</p>
            <p>🚀 Densité startups: {country.economicData.startupDensity}</p>
            {selectedCityData && (
              <p>🏙️ {selectedCityData.name}: {selectedCityData.population.toLocaleString()} habitants</p>
            )}
            {selectedSectorData && (
              <p>💼 Secteur {selectedSectorData.name}: {selectedSectorData.trends.join(', ')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
