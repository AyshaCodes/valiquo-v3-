import { ScanResult, Badge } from '../types';
import { Country, City, Sector, MarketContext } from '../types/international';
import { getCountryByCode } from '../data/countries';

// Contextes d'analyse par secteur et pays
const marketContexts: Record<string, Record<string, MarketContext>> = {
  TECH: {
    MA: {
      strengths: [
        'Marché tech en croissance de 18% par an',
        'Forte adoption mobile (87% pénétration)',
        'Coût développement compétitif',
        'Écosystème startup dynamique',
      ],
      weaknesses: [
        'Maturité digitale inégale urbain/rural',
        'Accès financement limité early stage',
        'Talent tech très courtisé',
        'Résistance au changement PME',
      ],
      opportunities: [
        'Digitalisation administrations publiques',
        'Expansion vers Afrique subsaharienne',
        'Partenariats grandes entreprises locales',
        'Programme Maroc Digital 2030',
      ],
      threats: [
        'Arrivée acteurs GAFA sur segments clés',
        'Turnover élevé des talents tech',
        'Évolution rapide technologies',
        'Dépendance investissements étrangers',
      ],
      marketInsights: [
        'Casablanca concentre 35% startups marocaines',
        'Fintech et edtech secteurs les plus porteurs',
        'B2G présente des opportunités importantes',
      ],
    },
    FR: {
      strengths: [
        'Écosystème tech mature (12000 startups)',
        'Accès financement diversifié',
        'Talent tech de haut niveau',
        'Infrastructure digitale avancée',
      ],
      weaknesses: [
        'Coût de développement élevé',
        'Fiscalité pesante pour startups',
        'Concurrence intense',
        'Complexité administrative',
      ],
      opportunities: [
        'Leadership européen sur IA/DeepTech',
        'Transition écologique massive',
        'Souveraineté numérique européenne',
        'Plan France 2030 (54Mds€)',
      ],
      threats: [
        'Concurrence américaine et chinoise',
        'Régulation GDPR stricte',
        'Talent drain vers US/UK',
        'Inflation réduit pouvoir d\'achat',
      ],
      marketInsights: [
        'Paris = 30% écosystème français',
        'DeepTech et GreenTech prioritaires',
        'B2B et B2G marchés les plus solides',
      ],
    },
    CA: {
      strengths: [
        'Écosystème tech en forte croissance',
        'Talent international de qualité',
        'Soutien gouvernemental solide',
        'Proximité marché américain',
      ],
      weaknesses: [
        'Marché domestique limité',
        'Climat rigide retient talent',
        'Complexité réglementaire fédérale-provinciale',
        'Coûts opérationnels élevés',
      ],
      opportunities: [
        'Leadership mondial en IA',
        'Programmes visas pour talent tech',
        'Expansion vers US et Amérique Latine',
        'Transition énergétique accélérée',
      ],
      threats: [
        'Dépendance marché américain',
        'Concurrence Silicon Valley',
        'Réglementations provinciales complexes',
        'Talent drain vers US',
      ],
      marketInsights: [
        'Toronto = hub fintech canadien',
        'Montréal = leader IA et recherche',
        'Vancouver = cleantech et sustainable tech',
      ],
    },
  },
  FOOD: {
    MA: {
      strengths: [
        'Culture gastronomique forte',
        'Diaspora moteur tendances',
        'Tourisme alimentaire en essor',
        'Marché delivery expansion rapide',
      ],
      weaknesses: [
        'Saisonnalité prix matières premières',
        'Logistique froid complexe',
        'Marges faibles secteur alimentaire',
        'Chaîne froid limitée hors grandes villes',
      ],
      opportunities: [
        'Tendance healthy-eating forte croissance',
        'Exportation produits vers Europe',
        'Dark kitchens nouveaux modèles',
        'Bio et produits locaux demandés',
      ],
      threats: [
        'Concurrence acteurs traditionnels',
        'Inflation réduit marges',
        'Importations concurrence déloyale',
        'Réglementations alimentaires strictes',
      ],
      marketInsights: [
        'Casablanca = marché foodtech principal',
        'Tourisme = levier croissance restauration',
        'Bio et healthy = segments premium',
      ],
    },
    FR: {
      strengths: [
        'Culture gastronomique mondialement reconnue',
        'Tourisme alimentaire majeur',
        'Distribution organisée efficace',
        'Innovation culinaire constante',
      ],
      weaknesses: [
        'Marges compression forte',
        'Concurrence internationale intense',
        'Réglementations sanitaires strictes',
        'Coûts main d\'œuvre élevés',
      ],
      opportunities: [
        'Transition alimentaire durable',
        'Circuits courts et local sourcing',
        'Alternatives végétales en croissance',
        'Food tech et personnalisation',
      ],
      threats: [
        'Inflation pouvoir d\'achat',
        'Concurrence discount hard discount',
        'Crises alimentaires récurrentes',
        'Réglementations environnementales',
      ],
      marketInsights: [
        'Paris = laboratoire foodtech mondial',
        'Bio et local = segments premium',
        'Delivery = marché mature mais innovant',
      ],
    },
    CA: {
      strengths: [
        'Multiculturalisme culinaire',
        'Produits locaux de qualité',
        'Innovation foodtech dynamique',
        'Marché organics mature',
      ],
      weaknesses: [
        'Saisonalité climatique forte',
        'Coûts distribution élevés',
        'Concurrence US importante',
        'Réglementations fédérales complexes',
      ],
      opportunities: [
        'Meal kits et livraison forte croissance',
        'Alternatives végétales tendance',
        'Produits locaux et artisanaux',
        'Sustainable food tech',
      ],
      threats: [
        'Géographie immense = logistique complexe',
        'Concurrence géants américains',
        'Climat extrême = production volatile',
        'Réglementations provinciales variables',
      ],
      marketInsights: [
        'Toronto = marché food diversity',
        'Vancouver = sustainable food leader',
        'Meal kits = segment croissance rapide',
      ],
    },
  },
  // Ajouter d'autres secteurs (EDU, FIN, HEALTH, etc.)...
};

function detectSector(problem: string, secteur?: string): string {
  const text = (problem + ' ' + (secteur || '')).toLowerCase();
  
  if (text.match(/tech|digital|app|software|ia|intelligence|data|algorithm|platform|saas/)) return 'TECH';
  if (text.match(/food|restaurant|cuisine|alimentaire|livraison|manger|meal|kitchen/)) return 'FOOD';
  if (text.match(/education|formation|apprentissage|cours|école|université|learning|training/)) return 'EDU';
  if (text.match(/finance|bank|payment|money|fintech|crypto|insurance|invest/)) return 'FIN';
  if (text.match(/health|medical|santé|doctor|hospital|pharma|wellness|telemedicine/)) return 'HEALTH';
  
  return 'TECH'; // Default pour simplifier
}

function computeScore(problem: string, country: Country, city?: City, sector?: Sector): number {
  let base = 50 + Math.floor(Math.random() * 35);
  
  // Bonus selon pays
  if (country.code === 'FR') base += 5; // Marché mature
  if (country.code === 'CA') base += 3; // Marché croissance
  
  // Bonus selon ville
  if (city) {
    if (city.economicWeight > 15) base += 5; // Grandes métropoles
    else if (city.economicWeight > 8) base += 3; // Villes moyennes
  }
  
  // Bonus selon secteur
  if (sector) {
    if (sector.maturity === 'mature') base += 3;
    if (sector.maturity === 'growing') base += 5;
  }
  
  // Bonus qualité description
  if (problem.length > 200) base += 3;
  if (problem.length > 400) base += 2;
  
  // Limites
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

function getResume(score: number, country: Country, city?: City, sector?: Sector): string {
  const location = city ? `à ${city.name}` : `en ${country.name}`;
  const sectorText = sector ? ` dans le secteur ${sector.name}` : '';
  
  if (score >= 80) {
    return `Notre analyse détecte une demande forte et claire ${location}${sectorText}. Les signaux marché sont alignés avec les tendances économiques actuelles. Le timing est favorable pour avancer rapidement vers la validation terrain.`;
  }
  if (score >= 65) {
    return `Le problème identifié ${location}${sectorText} présente un potentiel réel. Des signaux positifs existent mais nécessitent une validation terrain plus poussée avant d\'engager des ressources importantes.`;
  }
  return `L\'analyse révèle un marché ${location}${sectorText} encore peu mature pour cette idée. Des ajustements de positionnement ou une approche différente du problème pourraient améliorer significativement les chances de succès.`;
}

function getBadges(score: number, country: Country, city?: City, sector?: Sector): Badge[] {
  const badges: Badge[] = [];
  
  if (score >= 75) badges.push({ label: 'Forte demande', type: 'positive' });
  if (score >= 65) badges.push({ label: 'Timing favorable', type: 'positive' });
  if (city) badges.push({ label: `Marché ${city.name}`, type: 'positive' });
  if (sector) badges.push({ label: sector.name, type: 'positive' });
  if (score < 65) badges.push({ label: 'Validation requise', type: 'warning' });
  if (score >= 80) badges.push({ label: 'Opportunité premium', type: 'positive' });
  badges.push({ label: country.name, type: 'positive' });
  
  return badges.slice(0, 4);
}

function getContexte(country: Country, city?: City, sector?: Sector): string {
  const cityContext = city ? 
    `${city.name} représente ${city.economicWeight}% du PIB ${country.name.toLowerCase()} avec une population de ${(city.population / 1000000).toFixed(1)}M d'habitants. ` : '';
  
  const sectorContext = sector ?
    `Le secteur ${sector.name} est considéré comme ${sector.maturity === 'mature' ? 'mature' : sector.maturity === 'growing' ? 'en croissance' : 'émergent'} avec des tendances fortes vers ${sector.trends.join(', ')}. ` : '';
  
  const economicContext = `À l'échelle ${country.name.toLowerCase()}, le pays affiche une croissance économique de ${country.economicData.gdpGrowth}% avec une pénétration digitale de ${country.economicData.digitalPenetration}% et une densité de ${country.economicData.startupDensity} startups.`;
  
  return cityContext + sectorContext + economicContext;
}

function pick<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

export function simulateInternationalScan(
  problem: string, 
  countryCode: string, 
  cityCode?: string, 
  sectorCode?: string
): ScanResult {
  const country = getCountryByCode(countryCode);
  if (!country) {
    throw new Error(`Country ${countryCode} not found`);
  }
  
  const city = country.cities.find(c => c.code === cityCode);
  const sector = country.sectors.find(s => s.code === sectorCode);
  
  const detectedSector = detectSector(problem, sector?.name);
  const context = marketContexts[detectedSector]?.[countryCode];
  
  const score = computeScore(problem, country, city, sector);
  
  // Utiliser le contexte spécifique ou fallback générique
  const strengths = context ? 
    pick(context.strengths, 3) : 
    [`Marché ${country.name} en croissance`, `Digitalisation accélérée`, `Opportunités locales identifiées`];
  
  const weaknesses = context ? 
    pick(context.weaknesses, 2) : 
    [`Concurrence existante`, `Réglementations à considérer`];
  
  const opportunities = context ? 
    pick(context.opportunities, 3) : 
    [`Tendances marché favorables`, `Potentiel international`, `Innovation possible`];
  
  const threats = context ? 
    pick(context.threats, 2) : 
    [`Risques économiques`, `Changements réglementaires`];
  
  return {
    score,
    verdict: getVerdict(score),
    resume: getResume(score, country, city, sector),
    badges: getBadges(score, country, city, sector),
    swot: {
      forces: strengths.map(text => ({ text })),
      faiblesses: weaknesses.map(text => ({ text })),
      opportunites: opportunities.map(text => ({ text })),
      menaces: threats.map(text => ({ text })),
    },
    contexte: getContexte(country, city, sector),
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
