import {
	HTTP_BAD_REQUEST,
	HTTP_OK,
	HTTP_UNAUTHORIZED,
	INGEST_INVALID_BODY_MESSAGE,
	INGEST_INVALID_TOKEN_MESSAGE,
	IngestBodySchema,
} from '@fitapp/contracts'
import { Hono } from 'hono'
import * as v from 'valibot'

import { ingestEntries } from '../application/ingest-entries'

import { readBearerToken } from './bearer-token'

import type { IngestRepository } from '../ports/ingest-repository'

export type IngestDeps = {
	createRepository: (db: D1Database) => IngestRepository
}

export function createIngestRoutes(deps: IngestDeps): Hono<{ Bindings: Env }> {
	const routes = new Hono<{ Bindings: Env }>()
	routes.post('/', async res => {
		const apiToken = readBearerToken(res.req.header('Authorization'))
		if (!apiToken) {
			return res.json(
				{ error: INGEST_INVALID_TOKEN_MESSAGE },
				HTTP_UNAUTHORIZED,
			)
		}
		const payload = await readJson(res.req.raw)
		const parsed = v.safeParse(IngestBodySchema, payload)
		if (!parsed.success) {
			return res.json(
				{ error: INGEST_INVALID_BODY_MESSAGE },
				HTTP_BAD_REQUEST,
			)
		}
		const inserted = await ingestEntries(
			deps.createRepository(res.env.DB),
			apiToken,
			parsed.output,
		)
		if (inserted === null) {
			return res.json(
				{ error: INGEST_INVALID_TOKEN_MESSAGE },
				HTTP_UNAUTHORIZED,
			)
		}
		return res.json({ inserted }, HTTP_OK)
	})
	return routes
}

async function readJson(request: Request): Promise<unknown> {
	try {
		return await request.json()
	} catch {
		return null
	}
}
