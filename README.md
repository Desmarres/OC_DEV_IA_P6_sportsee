# SportSee

Tableau de bord d'analytics sportif enrichi de deux fonctionnalités IA : un **coach virtuel conversationnel** et un **générateur de plans d'entraînement** personnalisés, exportables au format calendrier (ICS).

Application développée avec **Next.js** (Pages Router), s'appuyant sur l'API **Mistral AI** pour les fonctionnalités d'intelligence artificielle et sur un backend Express dédié pour les données utilisateur/sportives.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Obtenir une clé API Mistral](#obtenir-une-clé-api-mistral)
- [Variables d'environnement](#variables-denvironnement)
- [Lancer le projet](#lancer-le-projet)
- [Comptes de démonstration](#comptes-de-démonstration)
- [Structure du projet](#structure-du-projet)
- [Routes API](#routes-api)
- [Fonctionnalités IA en détail](#fonctionnalités-ia-en-détail)
- [Points de vigilance couverts](#points-de-vigilance-couverts)

## Fonctionnalités

### Tableau de bord
Visualisation des statistiques sportives de l'utilisateur : activité hebdomadaire, distance totale, dernières performances, objectifs.

### Coach IA conversationnel
Un chat avec un assistant IA spécialisé en coaching sportif, capable de :
- Répondre aux questions sur l'entraînement, la nutrition et la récupération
- Adapter automatiquement son niveau de langage (débutant / intermédiaire / expert) déduit de la conversation
- Personnaliser ses réponses à partir du profil et des performances récentes réelles de l'utilisateur
- Refuser poliment les sujets hors du domaine sportif, avec relance vers une question pertinente
- Respecter des garde-fous de sécurité stricts (jamais de diagnostic médical, redirection systématique vers un professionnel de santé en cas de douleur)

### Générateur de plans d'entraînement
Un assistant qui génère un programme d'entraînement complet sur mesure :
- Sélection guidée en 4 étapes (objectif, période, jours disponibles, créneau horaire)
- Génération d'un plan structuré (JSON strict, garanti par un schéma imposé à l'API Mistral) semaine par semaine, séance par séance
- Détection et correction automatique des objectifs irréalistes compte tenu du niveau réel de l'utilisateur, avec explication
- Régénération à l'identique ou nouvelle saisie
- Export du planning au format **ICS**, compatible Google Calendar, Outlook et Apple Calendar, avec rappel automatique 30 minutes avant chaque séance

## Stack technique

| Domaine | Technologie |
|---|---|
| Framework | Next.js 16 (Pages Router), React 19 |
| Formulaires | React Hook Form |
| Dates / calendrier | date-fns, `@daypicker/react` |
| Génération ICS | `ics` |
| Authentification | JWT (cookie httpOnly) |
| IA | API Mistral (`mistral-small-latest`), structured outputs (JSON Schema) |
| Backend données sportives | Express (projet séparé `sportsee-backend`) |

## Prérequis

- Node.js 18 ou supérieur
- Un compte [Mistral AI](https://console.mistral.ai) (gratuit, sans carte bancaire nécessaire pour commencer)
- Les deux dépôts présents en local : `sportsee` (ce projet) et `sportsee-backend`

## Installation

Le projet est composé de deux applications séparées à installer indépendamment.

**Backend (données utilisateur/sportives) :**
```bash
cd sportsee-backend
npm install
```

**Frontend (dashboard + IA) :**
```bash
cd sportsee
npm install
```

## Obtenir une clé API Mistral

1. Rendez-vous sur [console.mistral.ai](https://console.mistral.ai) et connectez-vous.
2. Le mode **Free** est activé par défaut, sans carte bancaire (usage limité, largement suffisant pour ce projet).
3. Dans le menu de gauche, allez dans **Clés API** → **Create new key**.
4. Donnez un nom à la clé, définissez une date d'expiration, puis copiez-la immédiatement (elle ne sera plus jamais affichée).
5. *(Recommandé)* Dans **Facturation**, fixez une limite de dépense basse et laissez la recharge automatique désactivée pour garder le contrôle total des coûts.

## Variables d'environnement

Créez un fichier `.env.local` à la racine du projet **frontend** (`sportsee`) :

```
MISTRAL_API_KEY=votre_clé_api_mistral
```

Ce fichier est ignoré par Git (`.gitignore`) — ne partagez et ne committez jamais votre clé.

Le backend n'a pas de variable d'environnement obligatoire ; il démarre sur le port `8000` par défaut, déjà pris en compte côté frontend (`API_URL` dans `src/config/constants.js`).

## Lancer le projet

Démarrez d'abord le backend, puis le frontend, dans deux terminaux séparés :

```bash
# Terminal 1 — backend (port 8000)
cd sportsee-backend
npm run dev
```

```bash
# Terminal 2 — frontend (port 3000)
cd sportsee
npm run dev
```

L'application est accessible sur [http://localhost:3000](http://localhost:3000).

## Comptes de démonstration

Le backend est préchargé avec plusieurs profils utilisateurs de test :

| Identifiant | Mot de passe |
|---|---|
| `sophiemartin` | `password123` |
| `marcdubois` | `password456` |
| `emmaleroy` | `password789` |
| `lucasbernard` | `password369` |

## Structure du projet

```
sportsee/
├── src/
│   ├── components/         # Composants UI (Dashboard, wizard de plan d'entraînement...)
│   ├── config/              # Constantes et prompts système (coachIA.js, trainingPlan.js)
│   ├── context/             # Contexts React (Auth, UserInfo, Chat, Training)
│   ├── hooks/                # Hooks personnalisés (appels API, gestion d'état)
│   ├── modal/                # Composants des modales (ChatModal, TrainingModal)
│   ├── pages/
│   │   ├── api/               # Routes API Next.js (auth, données, IA)
│   │   │   └── training-plan/  # generate.js, download-ics.js
│   │   ├── Dashboard/
│   │   └── Profil/
│   └── utils/                # Fonctions utilitaires (dates, validation, formatage prompt)
└── README.md
```

## Routes API

| Route | Méthode | Description |
|---|---|---|
| `/api/login`, `/api/logout`, `/api/me` | POST / POST / GET | Authentification |
| `/api/user-info` | GET | Profil et statistiques de l'utilisateur |
| `/api/user-activity` | GET | Activités sur une période donnée |
| `/api/chat` | POST | Envoie un message au Coach IA |
| `/api/training-plan/generate` | POST | Génère un plan d'entraînement personnalisé |
| `/api/training-plan/download-ics` | POST | Génère et télécharge le plan au format `.ics` |

Toutes les routes de données et d'IA sont protégées par authentification (token JWT en cookie httpOnly).

## Fonctionnalités IA en détail

### Architecture commune aux deux features
- Les appels à l'API Mistral sont systématiquement effectués **côté serveur** (jamais depuis le navigateur), la clé API n'est donc jamais exposée au client.
- Chaque réponse générée par l'IA est **validée côté backend** avant d'être transmise au frontend (structure, cohérence des champs, respect des contraintes envoyées) — l'IA n'est jamais considérée comme une source de confiance absolue.
- Les prompts système intègrent dynamiquement le profil et les performances réelles de l'utilisateur, tout en respectant une consigne de confidentialité (données minimisées, pas de journalisation des échanges sensibles).
- Gestion complète des erreurs (délai dépassé, limite de requêtes atteinte, réponse invalide) avec messages clairs côté utilisateur.

### Coach IA (`/api/chat`)
Le prompt système (`src/config/coachIA.js`) définit la personnalité du coach et des garde-fous explicites (santé et sécurité, domaine d'expertise, personnalisation, niveau de détail, style). L'historique de conversation (3 derniers échanges) est transmis à chaque requête pour assurer la continuité, avec troncature automatique des messages trop longs.

### Générateur de plans (`/api/training-plan/generate`)
Le plan est généré via les **Structured Outputs** de Mistral (`response_format` avec un JSON Schema strict), garantissant un format exploitable directement par le backend, sans dépendre uniquement d'une consigne textuelle. Le nombre de semaines est calculé automatiquement à partir des dates fournies, jamais fourni tel quel par le client.

## Points de vigilance couverts

- Clé API stockée exclusivement en variable d'environnement serveur
- Limitation de la taille des prompts et de l'historique transmis à l'API
- Validation et sanitation systématique des entrées utilisateur et des réponses de l'IA
- Détection des objectifs d'entraînement irréalistes avec proposition d'une alternative réaliste
- Respect du format ICS standard, gestion du fuseau horaire, rappels automatiques
- Aucune donnée utilisateur utilisée pour l'entraînement des modèles Mistral (option désactivée)
