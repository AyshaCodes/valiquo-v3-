export interface Country {
  code: string; // 'MA', 'FR', 'US', 'CA'
  name: string;
  currency: string;
  language: string;
  cities: City[];
  sectors: Sector[];
  economicData: EconomicData;
}

export interface City {
  code: string;
  name: string;
  region: string;
  economicWeight: number; // % du PIB national
  population: number;
}

export interface Sector {
  code: string;
  name: string;
  maturity: 'emerging' | 'growing' | 'mature';
  trends: string[];
}

export interface EconomicData {
  gdpGrowth: number;
  digitalPenetration: number;
  startupDensity: number;
  averageSalary: number;
  marketSize: number;
}

export interface MarketContext {
  country: Country;
  city?: City;
  sector?: Sector;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  marketInsights: string[];
}
