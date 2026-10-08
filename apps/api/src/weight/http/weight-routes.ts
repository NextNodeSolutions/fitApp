import {
	DEFAULT_WEIGHT_PERIOD,
	HTTP_BAD_REQUEST,
	HTTP_CREATED,
	HTTP_OK,
	HTTP_UNAUTHORIZED,
	SETTINGS_UNAUTHORIZED_MESSAGE,
	WEIGHT_PERIODS,
	WeightEntryBodySchema,
	WeightEntryResponseSchema,
	WeightListResponseSchema,
	WeightPeriodSchema,
	WeightUnauthorizedResponseSchema,
	WeightValidationErrorResponseSchema,
} from '@fitapp/contracts'
import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import * as v from 'valibot'

import { listWeightEntries } from '../application/list-weight-entries'
import { getPeriodStartDate } from '../application/period-start-date'
import { saveWeightEntry } from '../application/save-weight-entry'

import type { WeightRepository } from '../ports/weight-repository'

export type WeightDeps = {
	createRepository: (db: D1Database) => WeightRepository
	getUserId: (env: Env, headers: Headers) => Promise<string | null>
}

const unauthorizedResponseSchema = resolver(WeightUnauthorizedResponseSchema)
const validationResponseSchema = resolver(WeightValidationErrorResponseSchema)

const describeSaveWeightRoute = describeRoute({
	summary: 'Save or update a weight entry',
	tags: ['Weight'],
	security: [{ cookieAuth: [] }],
	responses: {
		[HTTP_CREATED]: {
			description: 'Weight entry saved',
			content: {
				'application/json': {
					schema: resolver(WeightEntryResponseSchema),
				},
			},
		},
		[HTTP_BAD_REQUEST]: {
			description: 'Invalid body',
			content: {
				'application/json': { schema: validationResponseSchema },
			},
		},
		[HTTP_UNAUTHORIZED]: {
			description: 'Missing session',
			content: {
				'application/json': { schema: unauthorizedResponseSchema },
			},
		},
	},
})

const describeListWeightsRoute = describeRoute({
	summary: 'List weight entries inside a period',
	tags: ['Weight'],
	security: [{ cookieAuth: [] }],
	parameters: [
		{
			name: 'period',
			in: 'query',
			required: false,
			schema: { type: 'string', enum: [...WEIGHT_PERIODS] },
		},
	],
	responses: {
		[HTTP_OK]: {
			description: 'Weight entries',
			content: {
				'application/json': {
					schema: resolver(WeightListResponseSchema),
				},
			},
		},
		[HTTP_BAD_REQUEST]: {
			description: 'Invalid period',
			content: {
				'application/json': { schema: validationResponseSchema },
			},
		},
		[HTTP_UNAUTHORIZED]: {
			description: 'Missing session',
			content: {
				'application/json': { schema: unauthorizedResponseSchema },
			},
		},
	},
})

const validateWeightEntryBody = validator(
	'json',
	WeightEntryBodySchema,
	(parseResult, res) => {
		if (parseResult.success) return
		return res.json(
			{ errors: parseResult.error.map(issue => issue.message) },
			HTTP_BAD_REQUEST,
		)
	},
)

export function createWeightRoutes(deps: WeightDeps): Hono<{ Bindings: Env }> {
	const routes = new Hono<{ Bindings: Env }>()
	registerSaveWeightRoute(routes, deps)
	registerListWeightsRoute(routes, deps)
	return routes
}

function registerSaveWeightRoute(
	routes: Hono<{ Bindings: Env }>,
	deps: WeightDeps,
): void {
	routes.post(
		'/',
		describeSaveWeightRoute,
		validateWeightEntryBody,
		async res => {
			const userId = await deps.getUserId(res.env, res.req.raw.headers)
			if (!userId) {
				return res.json(
					{ error: SETTINGS_UNAUTHORIZED_MESSAGE },
					HTTP_UNAUTHORIZED,
				)
			}
			const body = res.req.valid('json')
			await saveWeightEntry(deps.createRepository(res.env.DB), {
				userId,
				entryDate: body.entryDate,
				weightKg: body.weight,
			})
			return res.json(
				{ entry: { entryDate: body.entryDate, weightKg: body.weight } },
				HTTP_CREATED,
			)
		},
	)
}

function registerListWeightsRoute(
	routes: Hono<{ Bindings: Env }>,
	deps: WeightDeps,
): void {
	routes.get('/', describeListWeightsRoute, async res => {
		const userId = await deps.getUserId(res.env, res.req.raw.headers)
		if (!userId) {
			return res.json(
				{ error: SETTINGS_UNAUTHORIZED_MESSAGE },
				HTTP_UNAUTHORIZED,
			)
		}
		const period = v.safeParse(
			WeightPeriodSchema,
			res.req.query('period') ?? DEFAULT_WEIGHT_PERIOD,
		)
		if (!period.success) {
			return res.json(
				{ errors: period.issues.map(issue => issue.message) },
				HTTP_BAD_REQUEST,
			)
		}
		const entries = await listWeightEntries(
			deps.createRepository(res.env.DB),
			userId,
			getPeriodStartDate(period.output),
		)
		return res.json({ entries }, HTTP_OK)
	})
}
