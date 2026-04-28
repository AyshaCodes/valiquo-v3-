# 🚀 Valiquo - Plateforme de Validation d'Idées Startup

**Valiquo** est une plateforme web intelligente qui aide les entrepreneurs à valider leurs idées de business avant de se lancer. Spécialisée initialement sur le marché marocain, la plateforme s'étend désormais à l'international avec une approche contextuelle par pays.

> **"Prouve la demande. Avant de te lancer."** — Notre mission

## 🎯 Problème résolu

90% des startups échouent par manque de validation marché. Valiquo transforme une idée brute en première estimation de son potentiel grâce à :

- **Score de validation IA** (0-100) basé sur des données marché réelles
- **Analyse SWOT** contextualisée par pays et secteur
- **Plan d'action** concret en 3 étapes
- **Coach IA** disponible 24/7 pour guider les entrepreneurs

## 🌍 Vision internationale

De l'expertise marocaine vers l'excellence globale :
- **Phase 1** : Maroc, France, Canada (disponible)
- **Phase 2** : Expansion francophonie (Belgique, Suisse, Sénégal...)
- **Phase 3** : Europe et Amérique du Nord
- **Phase 4** : Marchés mondiaux

## 🛠️ Stack Technique

### Frontend (`/frontend`)
- **React 18** + **TypeScript** - Interface moderne et typée
- **Vite** - Build ultra-rapide
- **TailwindCSS** - Design system personnalisé
- **Lucide React** - Icons cohérents

### Backend (`/backend`)
- **Laravel 11** - API REST robuste et scalable
- **MySQL** - Base de données relationnelle
- **CORS configuré** - Communication frontend/backend
- **Architecture API** - Endpoints RESTful

### Intelligence Artificielle
- **Coach IA intégré** - Endpoint Laravel avec réponses contextuelles
- **Moteur d'analyse contextuel** - Par pays/secteur
- **Algorithmes de scoring** - Basés sur données économiques
- **Données marché** - Maroc, France, Canada (extensible)

## 📱 Fonctionnalités

### 🔍 Scanner IA
- Analyse de problème (minimum 20 caractères)
- Sélection pays/ville/secteur
- Score de validation avec verdict
- Analyse SWOT complète
- Contexte marché local
- Plan d'action priorisé

### 📊 Dashboard Utilisateur
- Historique des scans
- Statistiques personnelles
- Coach IA intégré
- Insights marché par pays
- Actions rapides

### 🌐 Internationalisation
- Données économiques par pays
- Contextes sectoriels locaux
- Tarification adaptée
- Interface multilingue (préparation)

## 🚀 Démarrage rapide

### Prérequis
- Node.js 18+
- npm ou yarn
- Compte Supabase

### Installation Backend Laravel
```bash
cd backend/valiquo-api

# Installation des dépendances
composer install

# Configuration de l'environnement
cp .env.example .env
php artisan key:generate

# Base de données
php artisan migrate
php artisan db:seed --class=CountrySeeder

# Démarrage du serveur API
php artisan serve --port=8000
```

### Installation Frontend React
```bash
cd frontend

# Installation des dépendances
npm install

# Configuration de l'environnement
cp .env.example .env

# Démarrage du développement
npm run dev

# Build pour production
npm run build

# Preview de production
npm run preview
-- Table utilisateurs
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  prenom VARCHAR(100),
  nom VARCHAR(100),
  ville VARCHAR(100),
  country_code VARCHAR(2) DEFAULT 'MA',
  preferred_currency VARCHAR(3) DEFAULT 'MAD',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table scans
CREATE TABLE scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  problem TEXT NOT NULL,
  country_code VARCHAR(2) NOT NULL,
  city_code VARCHAR(10),
  sector_code VARCHAR(10),
  score INTEGER NOT NULL,
  result JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_scans_user_id ON scans(user_id);
CREATE INDEX idx_scans_created_at ON scans(created_at DESC);
```

3. Configurer l'authentification Supabase
4. Ajouter les clés dans `.env` :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

## 📁 Structure du projet

```
project/
├── src/
│   ├── components/
│   │   ├── common/           # Composants réutilisables
│   │   ├── dashboard/        # Composants dashboard
│   │   └── international/   # Composants multi-pays
│   ├── data/
│   │   └── countries.ts      # Données pays/secteurs
│   ├── hooks/
│   │   ├── useAuth.ts        # Hook authentification
│   │   └── useRouter.ts      # Hook navigation
│   ├── lib/
│   │   ├── internationalScanner.ts  # Moteur IA international
│   │   ├── scanSimulator.ts  # Simulation (legacy)
│   │   └── supabase.ts       # Client Supabase
│   ├── pages/
│   │   ├── Dashboard.tsx     # Dashboard utilisateur
│   │   ├── Landing.tsx       # Page d'accueil
│   │   ├── Scan.tsx          # Scanner IA
│   │   ├── Login.tsx         # Connexion
│   │   └── Register.tsx      # Inscription
│   ├── types/
│   │   ├── index.ts          # Types principaux
│   │   └── international.ts  # Types multi-pays
│   ├── App.tsx               # Application principale
│   └── main.tsx              # Point d'entrée
├── public/                   # Assets statiques
├── .env                      # Variables environnement
├── package.json             # Dépendances
└── README.md                 # Documentation
```

## 🎨 Design System

### Couleurs
- **Primary** : `#2DD4BF` (Turquoise)
- **Dark** : `#0F172A` (Slate 900)
- **Secondary** : `#60A5FA` (Blue)
- **Warning** : `#FBB024` (Amber)
- **Danger** : `#EF4444` (Red)

### Typographie
- **Titres** : Syne (800, 700, 600)
- **Texte** : Inter (400, 500, 600)
- **Code** : JetBrains Mono

### Animations
- Fade-in-up : Apparition progressive
- Pulse-glow : Effet de brillance
- Shimmer : Loading élégant

## 📊 Analytics & Métriques

### KPIs Application
- **Taux de conversion** scan → dashboard
- **Score moyen** par pays/secteur
- **Rétention** utilisateurs (30 jours)
- **Adoption** features internationales

### KPIs Business
- **MAU** (Monthly Active Users)
- **Revenue** par pays
- **LTV** (Customer Lifetime Value)
- **CAC** (Customer Acquisition Cost)

## 🔧 Développement

### Scripts disponibles

```bash
# Développement
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Preview build local

# Qualité
npm run lint         # ESLint
npm run typecheck    # TypeScript check

# Tests
npm test             # Tests unitaires
npm run test:watch   # Tests en continu
```

### Conventions de code

- **TypeScript strict** : Pas de `any`
- **Components** : PascalCase
- **Functions** : camelCase
- **Constants** : UPPER_SNAKE_CASE
- **Imports** : Groupés par type

### Git Workflow

```bash
# Feature branches
git checkout -b feature/nouvelle-fonctionnalite
git commit -m "feat: ajoute le scanner international"
git push origin feature/nouvelle-fonctionnalite

# Pull requests
# Titre : feat(scope): description
# Description : problème → solution → impact
```

## 🚀 Déploiement

### Production (Vercel)

```bash
# Build et déploiement
npm run build
vercel --prod

# Variables d'environnement Vercel
VITE_SUPABASE_URL=*
VITE_SUPABASE_ANON_KEY=*
```

### Staging

```bash
# Preview deployment
vercel
```

## 🌍 Internationalisation

### Ajouter un nouveau pays

1. **Ajouter dans `src/data/countries.ts`** :

```typescript
{
  code: 'US',
  name: 'United States',
  currency: 'USD',
  language: 'en',
  cities: [...],
  sectors: [...],
  economicData: {...}
}
```

2. **Ajouter contextes dans `src/lib/internationalScanner.ts`** :

```typescript
const marketContexts = {
  TECH: {
    US: {
      strengths: [...],
      weaknesses: [...],
      // ...
    }
  }
};
```

3. **Tester l'intégration** :

```bash
npm run dev
# Tester avec le nouveau pays
```

## 🤝 Contribuer

### Comment contribuer

1. **Fork** le projet
2. **Créer** une feature branch
3. **Commiter** les changements
4. **Push** vers la branch
5. **Ouvrir** une Pull Request

### Types de contributions

- 🐛 **Bug fixes** : Correction d'anomalies
- ✨ **Features** : Nouvelles fonctionnalités
- 📚 **Documentation** : Amélioration docs
- 🎨 **Design** : Amélioration UI/UX
- 🌍 **International** : Ajout pays/langues

### Code Review Checklist

- [ ] TypeScript strict
- [ ] Tests passants
- [ ] Documentation mise à jour
- [ ] Performance vérifiée
- [ ] Accessibilité respectée

## 📄 Licence

Ce projet est sous licence **MIT** - voir le fichier [LICENSE](LICENSE) pour détails.

## 🙏 Remerciements

- **Supabase** - Backend as a Service
- **Vercel** - Hosting et déploiement
- **TailwindCSS** - Framework CSS
- **Lucide** - Icon library
- **TypeScript** - Typage JavaScript

## 📞 Contact

- **Site web** : [valiquo.ma](https://valiquo.ma)
- **Email** : contact@valiquo.ma
- **Twitter** : [@valiquo_ma](https://twitter.com/valiquo_ma)
- **GitHub** : [github.com/valiquo](https://github.com/valiquo)

---

**Valiquo** - De l'idée à la validation, en 5 minutes.

*Made with ❤️ for entrepreneurs worldwide*
