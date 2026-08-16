# fitApp

Monorepo Turborepo — 2 Workers Cloudflare (nextnode-deploy).

## Structure

- `apps/front` — Astro 7 + React, servie sur `front-fitapp.nextnode.fr`
- `apps/api` — Hono + Drizzle + D1, servie sur `api-fitapp.nextnode.fr`

## Commandes

| Commande                                | Effet                                                     |
| --------------------------------------- | --------------------------------------------------------- |
| `pnpm dev`                              | Turborepo dev (front: astro dev, api: wrangler dev)       |
| `pnpm build`                            | Build tous les packages                                   |
| `pnpm lint`                             | oxlint par package via turbo                              |
| `pnpm test`                             | Vitest par package via turbo                              |
| `pnpm type-check`                       | astro check (front) / tsc --noEmit (api)                  |
| `pnpm format:check`                     | oxfmt --check (global)                                    |
| `pnpm types:gen`                        | Génère `worker-configuration.d.ts` depuis `nextnode.toml` |
| `pnpm --filter @fitapp/api db:generate` | Génère une migration Drizzle                              |
| `pnpm --filter @fitapp/api db:check`    | Vérifie la cohérence Drizzle                              |

## Conventions

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
