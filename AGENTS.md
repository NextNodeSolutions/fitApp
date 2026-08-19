# fitApp

Monorepo Turborepo — 2 Workers Cloudflare (nextnode-deploy).

## Structure

- `apps/front` — Astro 7 + React, servie sur `front-fitapp.nextnode.fr`
- `apps/api` — Hono + Drizzle + D1, servie sur `api-fitapp.nextnode.fr`
- `packages/contracts` (`@fitapp/contracts`) — schémas valibot, types et constantes métier partagés front ↔ api
- `packages/ui` (`@fitapp/ui`) — design system partagé (composants shadcn via Base UI + lucide-react)

## Commandes

| Commande                                | Effet                                                     |
| --------------------------------------- | --------------------------------------------------------- |
| `pnpm dev`                              | Turborepo dev (front: astro dev, api: wrangler dev)       |
| `pnpm build`                            | Build tous les packages                                   |
| `pnpm lint`                             | oxlint par package via turbo                              |
| `pnpm test`                             | Vitest par package via turbo                              |
| `pnpm type-check`                       | astro check (front) / tsc --noEmit (api + packages)       |
| `pnpm format:check`                     | oxfmt --check (global)                                    |
| `pnpm types:gen`                        | Génère `worker-configuration.d.ts` depuis `nextnode.toml` |
| `pnpm --filter @fitapp/api db:generate` | Génère une migration Drizzle                              |
| `pnpm --filter @fitapp/api db:check`    | Vérifie la cohérence Drizzle                              |

## Conventions

### Architecture API — hexagonale

Tout module métier de `apps/api` vit dans `src/<module>/` avec ce découpage :

- `domain/` — entités et types, pur, zéro dépendance infra.
- `ports/` — interfaces des dépendances (ex : `ProfileRepository`).
- `application/` — use cases, dépendances injectées (repository, générateurs d'id...).
- `infrastructure/` — adapters concrets des ports (D1/Drizzle).
- `http/` — adapter Hono thin : validation (vValidator) → use case → réponse.

`src/index.ts` est la composition root : seul endroit qui câble les adapters concrets aux ports. Jamais d'import Drizzle/D1 hors de `infrastructure/`, jamais de logique métier dans `http/`.
- Paramètre du context Hono : `res`, jamais `c`.

### Architecture front — SOLID/SRP par feature et par fichier

- Code métier UI dans `apps/front/src/features/<feature>/`.
- **Un composant par fichier, sans exception** — jamais de sous-composant co-localisé, même tiny ou privé : il part dans son propre fichier.
- **Un fichier = une responsabilité, composant thin** : le composant ne fait que du rendu. État/validation → hook `use-<feature>.ts` (`react-hook-form` + schéma contracts) ; appels réseau/submit → module dédié (`submit-<feature>.ts`).
- Jamais de wrapper `<Feature>` qui ne fait que `<FeatureView form={form} />` — le composant feature rend le JSX. Extraire un enfant seulement s'il a sa propre raison d'exister.

### Validation — `@fitapp/contracts`, source de vérité unique

- Un domaine = un dossier `packages/contracts/src/<domaine>/`, une responsabilité par fichier (`constants`, `body-schema`, `form-schema`, `form-fields`, `responses`, `index`). Jamais un monolithe `<domaine>.ts`.
- Schémas valibot consommés par l'api (`vValidator`) ET le front (`react-hook-form`). Jamais de validateur hand-rolled dans une app — étendre le schéma dans contracts.
- Specs de champs (labels, options, bornes) et constantes métier dans contracts, jamais re-hardcodées ailleurs.
- Statuts HTTP et messages d'erreur réutilisables dans `packages/contracts/src/errors.ts`. Jamais de `const HTTP_*` ni de string d'erreur dans une route ou un submit.

### Composants UI — `@fitapp/ui`, source unique

- Tout composant UI générique (Button, Input, Label, RadioGroup...) vit dans `packages/ui`, construit sur `@base-ui/react` + `class-variance-authority` + `tailwind-merge`, icônes `lucide-react`.
- Jamais de composant UI hand-rolled dans `apps/front` — ajouter le composant à `@fitapp/ui` et l'importer.
- Le thème est consommé via `@import '@fitapp/ui/index.css'` dans `apps/front/src/styles.css`.

### Service binding (front → api)

Le front accède à l'api exclusivement via le service binding `env.API` (Fetcher) — jamais d'URL peer. Configuré par `needs = ["api"]` dans `nextnode.toml`.

### D1 / Drizzle

- Les migrations sont générées par Drizzle (`pnpm db:generate`) et appliquées en CI par `wrangler d1 migrations apply --remote` — **jamais au démarrage de l'app**.
- Le schéma est dans `apps/api/src/db/schema.ts`.

### Garde-fous Cloudflare (coût)

- **Plan Workers Free** : pas de bloc `limits` dans la config wrangler (la config est générée par l'infra, aucun `limits` émis).
- **D1** : index sur toute colonne filtrée (WHERE/JOIN), `SELECT` colonnes explicites, jamais de write par requête.
- **Anti-abus** : au WAF, jamais dans le code Worker.
- **Observability Workers Logs** : défaut conservé (true), faible volume au départ.
