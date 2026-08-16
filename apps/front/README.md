# @fitapp/front

Front de fitApp : Astro 7 + React (îlots), déployé en Worker Cloudflare via
`@astrojs/cloudflare` sur `front-fitapp.nextnode.fr`.

## Conventions

- **Service binding** : l'accès à l'API se fait via `env.API` (Fetcher) depuis
  `src/lib/api.ts` — jamais d'URL peer.
- **Santé** : `GET /healthz` (endpoint SSR, contrat du smoke check infra).
- **Build** : `astro build` produit `dist/server/entry.mjs` + `dist/client`
  (contrat d'entrée de l'infra).

## Commandes

```sh
pnpm --filter @fitapp/front dev         # astro dev
pnpm --filter @fitapp/front build       # build de production
pnpm --filter @fitapp/front type-check  # astro check
pnpm --filter @fitapp/front test        # vitest
```

Les types Worker (`worker-configuration.d.ts`) sont générés depuis la racine :
`pnpm types:gen` (source de vérité : `nextnode.toml`).
