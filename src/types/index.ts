export interface User {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  ville: string;
}

export interface SwotItem {
  text: string;
}

export interface Swot {
  forces: SwotItem[];
  faiblesses: SwotItem[];
  opportunites: SwotItem[];
  menaces: SwotItem[];
}

export interface ActionStep {
  step: number;
  titre: string;
  description: string;
  duree: string;
}

export interface Badge {
  label: string;
  type: 'positive' | 'warning' | 'negative';
}

export interface ScanResult {
  score: number;
  verdict: string;
  resume: string;
  badges: Badge[];
  swot: Swot;
  contexte: string;
  plan: ActionStep[];
}

export interface Scan {
  id: string;
  user_id: string;
  problem: string;
  ville: string;
  secteur: string;
  score: number;
  result: ScanResult;
  created_at: string;
}

export type Page = 'home' | 'scan' | 'login' | 'register' | 'dashboard';
