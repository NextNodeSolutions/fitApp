import {
	HTTP_BAD_REQUEST,
	HTTP_OK,
	HTTP_UNAUTHORIZED,
	INGEST_INVALID_BODY_MESSAGE,
	INGEST_INVALID_TOKEN_MESSAGE,
	IngestBodySchema,
	IngestInsertedResponseSchema,
	IngestInvalidBodyResponseSchema,
	IngestInvalidTokenResponseSchema,
} from '@fitapp/contracts'
import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'

import { ingestEntries } from '../application/ingest-entries'

import { readBearerToken } from './bearer-token'

import type { Context, Next } from 'hono'
import type { IngestRepository } from '../ports/ingest-repository'

export type IngestDeps = {
	createRepository: (db: D1Database) => IngestRepository
}

const describeIngestRoute = describeRoute({
	summary: 'Ingest meal entries',
	tags: ['Ingest'],
	security: [{ bearerAuth: [] }],
	responses: {
		[HTTP_OK]: {
			description: 'Entries ingested',
			content: {
				'application/json': {
					schema: resolver(IngestInsertedResponseSchema),
				},
			},
		},
		[HTTP_BAD_REQUEST]: {
			description: 'Invalid body',
			content: {
				'application/json': {
					schema: resolver(IngestInvalidBodyResponseSchema),
				},
			},
		},
		[HTTP_UNAUTHORIZED]: {
			description: 'Invalid API token',
			content: {
				'application/json': {
					schema: resolver(IngestInvalidTokenResponseSchema),
				},
			},
		},
	},
})

const validateIngestBody = validator(
	'json',
	IngestBodySchema,
	(parseResult, res) => {
		if (parseResult.success) return
		return res.json(
			{ error: INGEST_INVALID_BODY_MESSAGE },
			HTTP_BAD_REQUEST,
		)
	},
)

export function createIngestRoutes(deps: IngestDeps): Hono<{ Bindings: Env }> {
	const routes = new Hono<{ Bindings: Env }>()
	routes.post(
		'/',
		describeIngestRoute,
		requireBearerToken,
		validateJsonSyntax,
		validateIngestBody,
		async res => {
			const apiToken = readBearerToken(res.req.header('Authorization'))
			if (!apiToken) {
				return res.json(
					{ error: INGEST_INVALID_TOKEN_MESSAGE },
					HTTP_UNAUTHORIZED,
				)
			}
			const inserted = await ingestEntries(
				deps.createRepository(res.env.DB),
				apiToken,
				res.req.valid('json'),
			)
			if (inserted === null) {
				return res.json(
					{ error: INGEST_INVALID_TOKEN_MESSAGE },
					HTTP_UNAUTHORIZED,
				)
			}
			return res.json({ inserted }, HTTP_OK)
		},
	)
	return routes
}

async function validateJsonSyntax(
	res: Context<{ Bindings: Env }>,
	next: Next,
): Promise<Response | void> {
	try {
		await res.req.json()
	} catch {
		return res.json(
			{ error: INGEST_INVALID_BODY_MESSAGE },
			HTTP_BAD_REQUEST,
		)
	}
	return next()
}

function requireBearerToken(
	res: Context<{ Bindings: Env }>,
	next: Next,
): Response | Promise<void> {
	if (!readBearerToken(res.req.header('Authorization'))) {
		return res.json(
			{ error: INGEST_INVALID_TOKEN_MESSAGE },
			HTTP_UNAUTHORIZED,
		)
	}
	return next()
}
