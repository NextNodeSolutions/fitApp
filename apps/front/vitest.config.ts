// La variante standards/vitest/astro charge astro.config.mjs via getViteConfig, ce qui
// active le plugin Cloudflare Vite de l'adapter et entre en conflit avec le
// resolve.external du SSR (crash au démarrage). Les tests du front sont des tests
// unitaires TS purs (environnement node, pas de rendu .astro) : la variante backend suffit.
import config from '@nextnode-solutions/standards/vitest/backend'

export default config
