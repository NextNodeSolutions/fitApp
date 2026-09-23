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
	},
})
