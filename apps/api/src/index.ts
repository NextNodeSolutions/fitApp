import { Hono } from 'hono'

import { onboarding } from './routes/onboarding'

const app = new Hono<{ Bindings: Env }>()

app.get('/healthz', c => c.json({ status: 'ok', service: 'api' }))
app.route('/api/onboarding', onboarding)

export { app }

// oxlint-disable-next-line import/no-default-export
export default { fetch: app.fetch } satisfies ExportedHandler<Env>
