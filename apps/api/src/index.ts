import { Hono } from 'hono'

const app = new Hono<{ Bindings: Env }>()

app.get('/healthz', c => c.json({ status: 'ok', service: 'api' }))

export { app }

// oxlint-disable-next-line import/no-default-export
export default { fetch: app.fetch } satisfies ExportedHandler<Env>
