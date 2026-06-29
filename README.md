# Valiquo — État actuel du projet

**Plateforme d'aide à la décision pour entrepreneurs au Maroc**

> *« Comprends la réglementation. Avant de te lancer. »*

**Démo en ligne :** [valiquo-v3.vercel.app](https://valiquo-v3.vercel.app/)

---

## Vue d'ensemble

Valiquo aide les entrepreneurs marocains à naviguer le cadre réglementaire (création d'entreprise, statuts juridiques, fiscalité, OMPIC, CNSS…). Le **Module Réglementaire (V1)** est en cours de développement : authentification et couche de persistance sont en place ; l'intégration IA (Gemini + RAG) et le branchement complet du frontend restent à faire.

| Module | Statut |
|--------|--------|
| V1 — Réglementaire | En développement (auth + persistance OK, UI partiellement mockée) |
| V2 — Financement | Roadmap |
| V3 — Sectoriel | Roadmap |
| V4 — Données | Roadmap |

---

## Architecture du dépôt

```
valiquo-v3-/
├── project/              ← Frontend actif (React, déployé sur Vercel)
├── frontend/             ← Ancienne version (validation d'idées startup + Supabase)
├── backend/valiquo-api/  ← API Laravel 13
├── supabase/             ← Migrations SQL (legacy, liées à l'ancien frontend)
├── vercel.json           ← Config déploiement → dossier project/
└── ROADMAP_INTERNATIONALISATION.md
```

> **Note :** Le frontend actif est **`/project`**, pas `/frontend`. L'ancien dossier `/frontend` visait la validation d'idées startup avec internationalisation (MA, FR, CA) et Supabase.

---

## Stack technique

### Frontend actif (`/project`)

| Technologie | Usage |
|-------------|-------|
| React 18 + TypeScript | Interface utilisateur |
| Vite | Build et dev server |
| TailwindCSS | Design system (turquoise / slate) |
| React Router 7 | Navigation |
| Lucide React | Icônes |
| `AuthContext` + `lib/api.ts` | Session Sanctum (cookies), appels API Laravel |
| `@supabase/supabase-js` | Dépendance installée, **non branchée** |

### Backend (`/backend/valiquo-api`)

| Technologie | Usage |
|-------------|-------|
| Laravel 13 (PHP 8.3+) | API REST, architecture orientée services |
| Laravel Breeze (API) + Sanctum | Auth session/cookie (SPA stateful, pas de Bearer token) |
| Spatie Permission | Rôles (`user` / entrepreneur, `pro`, `admin`) et permissions |
| SQLite (dev) / MySQL (prod) | Base de données |
| CORS + Sanctum stateful domains | Configuré pour `http://localhost:5173` |

---

## Fonctionnalités — état réel

### ✅ Implémenté (UI / interface)

| Page | Route | État |
|------|-------|------|
| Landing | `/` | Complète — modules, tarifs, hero ; navbar auth-aware (`PublicNavbar`) |
| Scanner réglementaire | `/scan` | UI complète, **résultats mockés** (SARL Casablanca) ; navbar auth-aware |
| Connexion | `/login` | Branché à l'API Laravel (`POST /login`) |
| Inscription | `/register` | Branché à l'API Laravel (`POST /register`) |
| Dashboard | `/dashboard` | Layout responsive + sidebar ; affiche le nom de l'utilisateur connecté |
| Accueil dashboard | `/dashboard` | Salutation personnalisée ; stats et consultations **en dur** |
| Coach IA | `/dashboard/coach` | Chat UI, salutation au prénom réel ; **réponses simulées** (setTimeout) |
| Analyses | `/dashboard/analyses` | Page placeholder |
| Rapports | `/dashboard/rapports` | Page placeholder |

### ✅ Implémenté (authentification)

| Composant | Détail |
|-----------|--------|
| Backend | Breeze API + Sanctum (session cookie) + Spatie Permission |
| Routes web | `POST /login`, `POST /register`, `POST /logout` |
| Route API | `GET /api/user` — profil + rôles/permissions |
| Frontend | `AuthContext`, `ProtectedRoute`, `lib/api.ts` avec `credentials: 'include'` |
| Navbar publique | `PublicNavbar` — état connecté sur Landing et Scan (avatar, dropdown, CTA contextuel) |

> **Note auth :** la connexion passe par `POST /login` (routes web), pas `POST /api/login`. Préalable : `GET /sanctum/csrf-cookie`.

### ✅ Implémenté (backend Laravel — persistance & API)

#### Authentification & profil

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/sanctum/csrf-cookie` | GET | — | Cookie CSRF (requis avant login/register) |
| `/login` | POST | guest | Connexion session |
| `/register` | POST | guest | Inscription (+ rôle `user`) |
| `/logout` | POST | auth | Déconnexion |
| `/api/user` | GET | sanctum | Profil utilisateur |

#### Consultations (scanner réglementaire)

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/api/consultations` | POST | sanctum | Créer une consultation (`statut: en_cours`, `reponse: null`) |
| `/api/consultations` | GET | sanctum | Liste paginée (10/page, plus récentes en premier) |
| `/api/consultations/{id}` | GET | sanctum | Détail (403 si non propriétaire) |

#### Conversations coach IA

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/api/conversations` | POST | sanctum | Créer une conversation |
| `/api/conversations` | GET | sanctum | Liste avec `latest_message`, `messages_count`, `updated_at` |
| `/api/conversations/{id}` | GET | sanctum | Détail + messages chronologiques |
| `/api/conversations/{id}/messages` | POST | sanctum | Ajouter un message (`contenu`, `expediteur: user\|coach`) |

#### Autres endpoints

| Endpoint | Méthode | Auth | Description |
|----------|---------|------|-------------|
| `/api/countries` | GET, POST | — | CRUD pays (MA, FR, CA…) |
| `/api/countries/{code}` | GET, PUT, DELETE | — | Détail / modification pays |
| `/api/coach/chat` | POST | sanctum | Coach IA — **réponses par mots-clés**, pas de LLM |

**Architecture services :**
- `ConsultationService` / `ConversationService` — logique métier (controllers fins)
- `GeminiServiceInterface` + `GeminiService` (stub) — prêt pour l'étape RAG/Gemini
- `ConsultationPolicy` / `ConversationPolicy` — vérification de propriété (403)

**Modèles & migrations :**
- `users` — profil (`first_name`, `last_name`, `city`) + Spatie roles/permissions
- `consultations` — question, réponse, thématique, ville, statut (`en_cours` / `terminee` / `erreur`)
- `conversations` — titre, lié à l'utilisateur
- `messages` — contenu, expéditeur (`user` / `coach`)
- `countries` — table + seeder (`CountrySeeder`)
- `sessions`, `personal_access_tokens`, `permission_*` — auth Sanctum + Spatie

**Tests :**
- Persistance : **20/20** tests passants (`ConsultationTest`, `ConversationTest`, `ConsultationServiceTest`)
- Suite complète : **29/30** — 1 échec préexistant sur `RegistrationTest` (à corriger)

### ❌ Non implémenté

| Fonctionnalité | Détail |
|----------------|--------|
| **Gemini + RAG** | Intégration API Gemini sur les 7 PDF réglementaires — prochaine étape |
| **Scan → API** | Le frontend `/scan` n'appelle pas encore `POST /api/consultations` |
| **Coach → API** | Le frontend coach n'appelle pas encore `/api/conversations` |
| **Stats dashboard** | Compteurs en dur ; se mettront à jour une fois le frontend branché |
| **Flutter** | App UI mockée uniquement, non connectée à l'API |
| **Admin documents** | Middleware/routes admin pour gestion documentaire absents |
| **Nettoyage legacy** | Dossiers `/frontend` et `/supabase` non archivés/supprimés |
| **Déploiement backend** | API Laravel en local uniquement (`localhost:8000`) |
| **Supabase** | Prévu dans l'ancien `/frontend` ; **non intégré** au frontend actif |

---

## Démarrage local

### Frontend

```bash
cd project
cp .env.example .env   # VITE_API_URL=http://localhost:8000
npm install
npm run dev
```

L'app tourne sur `http://localhost:5173`.

### Backend Laravel

```bash
cd backend/valiquo-api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan serve --port=8000
```

L'API tourne sur `http://localhost:8000` (routes auth sur `/`, routes métier sous `/api`).

Variables `.env` importantes côté backend :
- `FRONTEND_URL=http://localhost:5173`
- `SANCTUM_STATEFUL_DOMAINS=localhost:5173,localhost,127.0.0.1,127.0.0.1:5173`
- `SESSION_DOMAIN=localhost`

---

## Déploiement

- **Frontend :** Vercel, configuré via `vercel.json` pour builder le dossier `project/`
- **Backend :** Non déployé en production (local uniquement pour l'instant)

---

## Prochaines étapes suggérées

1. **Gemini + RAG** — Implémenter `GeminiService`, job async `ProcessConsultationJob`, RAG sur les PDF réglementaires
2. **Frontend ↔ persistance** — Brancher Scan sur `POST /api/consultations`, Coach sur `/api/conversations`
3. **Stats dashboard** — Remplacer les mocks par les données réelles (`GET /api/consultations`, conversations)
4. **Admin documents** — Routes/middleware admin pour upload et gestion des sources RAG
5. **Tests** — Corriger l'échec `RegistrationTest` ; couvrir les flows auth end-to-end
6. **Flutter** — Connecter l'app mobile à la même API Sanctum
7. **Nettoyage** — Archiver ou supprimer `/frontend` et `/supabase`
8. **Déploiement backend** — Héberger l'API Laravel (Railway, Forge, etc.)
9. **Modules V2–V4** — Financement, sectoriel, données (HCP, Bank Al-Maghrib…)

---

## Ressources réglementaires (local)

Des documents PDF de référence sont présents à la racine du dépôt (non versionnés recommandé) :

- CGI 2024, Loi 5-96 (SARL), Loi 17-95, guides OMPIC/CRI, etc.

Ils servent de base documentaire pour alimenter le moteur RAG à terme.

---

## Contributeurs & repo

- **GitHub :** [github.com/AyshaCodes/valiquo-v3-](https://github.com/AyshaCodes/valiquo-v3-)
- **Branche principale :** `main`

---

*Dernière mise à jour : juin 2026*
