import { ScanResult, Badge } from '../types';

const forcesByContext: Record<string, string[]> = {
  tech: [
    'Marché tech marocain en croissance de 18% par an',
    'Forte adoption des smartphones (87% de pénétration)',
    'Ecosystem startup dynamique (Casablanca Finance City)',
    'Coût de développement compétitif vs Europe',
  ],
  food: [
    'Culture gastronomique forte, habitudes alimentaires établies',
    'Diaspora marocaine moteur de tendances culinaires',
    'Tourisme alimentaire en plein essor',
    'Marché du delivery en expansion rapide',
  ],
  education: [
    'Jeune population avide de formation (60% < 30 ans)',
    'Déficit de compétences techniques reconnu',
    'Intérêt croissant pour l\'entrepreneuriat',
    'Connexion mobile généralisée facilitant l\'accès',
  ],
  default: [
    'Économie marocaine en croissance (3.2% PIB 2024)',
    'Classe moyenne en expansion, pouvoir d\'achat en hausse',
    'Soutien gouvernemental aux startups (Morocco Now)',
    'Position géostratégique Afrique-Europe avantageuse',
  ],
};

const faiblessesByContext: Record<string, string[]> = {
  tech: [
    'Maturité digitale inégale entre urbain et rural',
    'Résistance au changement chez certaines PME',
    'Accès au financement encore limité pour les early stage',
  ],
  food: [
    'Saisonnalité et volatilité des prix matières premières',
    'Logistique du froid complexe hors grandes villes',
    'Marges faibles dans le secteur alimentaire',
  ],
  education: [
    'Méfiance culturelle vis-à-vis des formations en ligne',
    'Monétisation difficile sur certains segments',
    'Concurrence des plateformes internationales gratuites',
  ],
  default: [
    'Marché fragmenté selon les régions',
    'Financement de démarrage difficile à obtenir',
    'Réglementations sectorielles parfois floues',
  ],
};

const opportunitesByContext: Record<string, string[]> = {
  tech: [
    'Digitalisation accélérée des administrations marocaines',
    'Expansion vers l\'Afrique subsaharienne naturelle depuis le Maroc',
    'Partenariats potentiels avec les grandes entreprises locales',
  ],
  food: [
    'Tendance healthy-eating et bio en forte croissance',
    'Exportation de produits marocains vers l\'Europe',
    'Dark kitchens et nouveaux modèles de restauration',
  ],
  education: [
    'Externalisation de formations par les grandes entreprises',
    'Partenariats avec universités et grandes écoles',
    'Certification et reconnaissance officielle valorisante',
  ],
  default: [
    'Transition digitale tous secteurs confondus',
    'Programme Maroc Digital 2030 — opportunités B2G',
    'Diaspora marocaine comme levier de croissance international',
  ],
};

const menacesByContext: Record<string, string[]> = {
  tech: [
    'Arrivée de grands acteurs GAFA sur certains segments',
    'Talent tech très courtisé, risque de turnover élevé',
    'Évolution rapide des technologies, obsolescence risquée',
  ],
  food: [
    'Concurrence des acteurs traditionnels bien implantés',
    'Inflation pouvant réduire les marges significativement',
  ],
  education: [
    'Coursera, Udemy et plateformes gratuites déjà établies',
    'Dépendance aux subventions ou partenariats institutionnels',
  ],
  default: [
    'Copies rapides par concurrents locaux si succès visible',
    'Dépendance aux investissements étrangers (sensibilité géopolitique)',
    'Inflation et instabilité économique régionale',
  ],
};

function pick<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

function detectContext(problem: string, secteur: string): string {
  const text = (problem + ' ' + secteur).toLowerCase();
  if (text.match(/tech|digital|app|logiciel|software|ia|intelligence|data/)) return 'tech';
  if (text.match(/food|restaurant|cuisine|alimentaire|livraison|manger/)) return 'food';
  if (text.match(/education|formation|apprentissage|cours|école|université/)) return 'education';
  return 'default';
}

function computeScore(problem: string, ville: string): number {
  let base = 60 + Math.floor(Math.random() * 25);
  if (problem.length > 200) base += 5;
  if (['Casablanca', 'Rabat'].includes(ville)) base += 3;
  if (base > 94) base = 94;
  if (base < 52) base = 52;
  return base;
}

function getVerdict(score: number): string {
  if (score >= 80) return 'Forte demande détectée';
  if (score >= 65) return 'Signal positif — à approfondir';
  if (score >= 50) return 'Opportunité réelle mais risquée';
  return 'Signal faible — pivoter conseillé';
}

function getResume(score: number, ville: string, secteur: string): string {
  const villeLabel = ville === 'National' ? 'au niveau national' : `à ${ville}`;
  const secteurLabel = secteur ? ` dans le secteur ${secteur}` : '';
  if (score >= 80) {
    return `Notre analyse détecte une demande forte et claire ${villeLabel}${secteurLabel}. Les signaux marché sont alignés avec les tendances économiques actuelles. Le timing est favorable pour avancer rapidement vers la validation terrain.`;
  }
  if (score >= 65) {
    return `Le problème identifié ${villeLabel}${secteurLabel} présente un potentiel réel. Des signaux positifs existent mais nécessitent une validation terrain plus poussée avant d\'engager des ressources importantes.`;
  }
  return `L'analyse révèle un marché ${villeLabel}${secteurLabel} encore peu mature pour cette idée. Des ajustements de positionnement ou une approche différente du problème pourraient améliorer significativement les chances de succès.`;
}

function getBadges(score: number, ville: string, secteur: string): Badge[] {
  const badges: Badge[] = [];
  if (score >= 75) badges.push({ label: 'Forte demande', type: 'positive' });
  if (score >= 65) badges.push({ label: 'Timing favorable', type: 'positive' });
  if (ville !== 'National') badges.push({ label: `Marché ${ville}`, type: 'positive' });
  if (secteur) badges.push({ label: secteur, type: 'positive' });
  if (score < 65) badges.push({ label: 'Validation requise', type: 'warning' });
  if (score >= 80) badges.push({ label: 'Opportunité premium', type: 'positive' });
  badges.push({ label: 'Marché marocain', type: 'positive' });
  return badges.slice(0, 4);
}

function getContexte(ville: string, secteur: string, score: number): string {
  const villeContext: Record<string, string> = {
    Casablanca: 'Casablanca concentre 35% du PIB marocain et représente le principal hub économique du pays. La densité entrepreneuriale y est la plus élevée avec plus de 400 startups actives.',
    Rabat: 'Rabat, capitale administrative, offre un accès privilégié aux décideurs publics et aux programmes gouvernementaux. Le Hub Afrika y facilite les connexions institutionnelles.',
    Marrakech: 'Marrakech bénéficie d\'un fort flux touristique (3M+ visiteurs/an) et d\'une communauté d\'expats actifs. L\'économie locale diversifie rapidement vers le digital.',
    Tanger: 'Tanger, carrefour Méditerranée-Atlantique, connaît un essor industriel remarquable. La Zone Franche et le port Tanger Med créent un écosystème unique.',
    Fès: 'Fès, ville universitaire et artisanale, développe un vivier de talents qualifiés. Le tourisme culturel soutient de nouvelles opportunités économiques locales.',
    National: 'À l\'échelle nationale, le Maroc affiche une croissance économique de 3.2% (2024) avec une stratégie numérique ambitieuse (Maroc Digital 2030) et un soutien institutionnel renforcé aux startups.',
  };
  return villeContext[ville] || villeContext['National'];
}

export function simulateScan(problem: string, ville: string, secteur: string): ScanResult {
  const ctx = detectContext(problem, secteur);
  const score = computeScore(problem, ville);

  const forces = pick(forcesByContext[ctx] || forcesByContext.default, 3);
  const faiblesses = pick(faiblessesByContext[ctx] || faiblessesByContext.default, 2);
  const opportunites = pick(opportunitesByContext[ctx] || opportunitesByContext.default, 3);
  const menaces = pick(menacesByContext[ctx] || menacesByContext.default, 2);

  return {
    score,
    verdict: getVerdict(score),
    resume: getResume(score, ville, secteur),
    badges: getBadges(score, ville, secteur),
    swot: {
      forces: forces.map(text => ({ text })),
      faiblesses: faiblesses.map(text => ({ text })),
      opportunites: opportunites.map(text => ({ text })),
      menaces: menaces.map(text => ({ text })),
    },
    contexte: getContexte(ville, secteur, score),
    plan: [
      {
        step: 1,
        titre: 'Validation terrain (Semaine 1–2)',
        description: 'Conduire 15 à 20 entretiens qualitatifs avec des utilisateurs cibles potentiels. Objectif : confirmer que le problème est réel, récurrent et que les personnes sont prêtes à payer pour le résoudre.',
        duree: '2 semaines',
      },
      {
        step: 2,
        titre: 'Prototype & Landing Page (Semaine 3–4)',
        description: 'Créer un prototype basse fidélité (Figma ou no-code) et une landing page avec formulaire d\'intérêt. Lancer une campagne d\'acquisition micro-budget pour mesurer la conversion.',
        duree: '2 semaines',
      },
      {
        step: 3,
        titre: 'Pré-ventes & MVP (Mois 2–3)',
        description: 'Obtenir 10 pré-ventes ou engagements écrits avant de développer le produit. Construire un MVP minimaliste avec uniquement la fonctionnalité cœur. Itérer selon les retours.',
        duree: '6 semaines',
      },
    ],
  };
}
