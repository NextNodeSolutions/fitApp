// @ts-check
import { defineConfig } from 'astro/config'

import cloudflare from '@astrojs/cloudflare'
import react from '@astrojs/react'
// oxlint-disable-next-line import(default): the exports map routes to a runtime module where the default export is dynamic
import sentry from '@sentry/astro'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
	output: 'server',
	adapter: cloudflare({
		configPath: 'wrangler.dev.jsonc',
	}),
	integrations: [react(), sentry()],
	vite: {
		plugins: [tailwindcss()],
		ssr: {
			optimizeDeps: {
				// The SSR dependency scan only crawls pages and components. What only
				// the middleware reaches (Sentry server config) or what is injected at
				// runtime (Sentry's middleware, Astro's JSON logger) would be found
				// late, re-run the optimizer and leave two copies of React in workerd,
				// which breaks hooks. Not `environments.ssr`: declaring it replaces the
				// adapter's SSR build input and renames dist/server/entry.mjs.
				include: [
					'@sentry/astro',
					'@sentry/astro/middleware',
					'astro/logger/json',
				],
			},
		},
	},
})
