const API_BASE_URL = 'http://localhost:8000/api';

export interface Country {
  id: number;
  code: string;
  name: string;
  currency: string;
  language: string;
  cities: City[];
  sectors: Sector[];
  economic_data: EconomicData;
  created_at: string;
  updated_at: string;
}

export interface City {
  code: string;
  name: string;
  region: string;
  economicWeight: number;
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

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getCountries(): Promise<Country[]> {
    return this.request<Country[]>('/countries');
  }

  async getCountryByCode(code: string): Promise<Country | null> {
    try {
      return await this.request<Country>(`/countries/${code}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }
}

export const apiService = new ApiService();
