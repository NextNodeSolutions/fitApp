import {
	HTTP_BAD_REQUEST,
	HTTP_OK,
	HTTP_UNAUTHORIZED,
	MealListResponseSchema,
	MealUnauthorizedResponseSchema,
	MealValidationErrorResponseSchema,
	MealsRangeQuerySchema,
	SETTINGS_UNAUTHORIZED_MESSAGE,
} from '@fitapp/contracts'
import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'

import { listMealEntries } from '../application/list-meal-entries'

import type { MealListResponse } from '@fitapp/contracts'
import type { MealRepository } from '../ports/meal-repository'

export type MealDeps = {
	createRepository: (db: D1Database) => MealRepository
	getUserId: (env: Env, headers: Headers) => Promise<string | null>
}

const describeListMealsRoute = describeRoute({
	summary: 'List meal entries logged between two dates (inclusive)',
	tags: ['Meals'],
	security: [{ cookieAuth: [] }],
	responses: {
		[HTTP_OK]: {
			description: 'Meal entries ordered by date then log time',
			content: {
				'application/json': {
					schema: resolver(MealListResponseSchema),
				},
			},
		},
		[HTTP_BAD_REQUEST]: {
			description: 'Invalid date range',
			content: {
				'application/json': {
					schema: resolver(MealValidationErrorResponseSchema),
				},
			},
		},
		[HTTP_UNAUTHORIZED]: {
			description: 'Missing session',
			content: {
				'application/json': {
					schema: resolver(MealUnauthorizedResponseSchema),
				},
			},
		},
	},
})

const validateMealsRangeQuery = validator(
	'query',
	MealsRangeQuerySchema,
	(parseResult, res) => {
		if (parseResult.success) return
		return res.json(
			{ errors: parseResult.error.map(issue => issue.message) },
			HTTP_BAD_REQUEST,
		)
	},
)

export function createMealRoutes(deps: MealDeps): Hono<{ Bindings: Env }> {
	const routes = new Hono<{ Bindings: Env }>()
	routes.get(
		'/',
		describeListMealsRoute,
		validateMealsRangeQuery,
		async res => {
			const userId = await deps.getUserId(res.env, res.req.raw.headers)
			if (!userId) {
				return res.json(
					{ error: SETTINGS_UNAUTHORIZED_MESSAGE },
					HTTP_UNAUTHORIZED,
				)
			}
			const { from, to } = res.req.valid('query')
			const entries = await listMealEntries(
				deps.createRepository(res.env.DB),
				userId,
				from,
				to,
			)
			return res.json({ entries } satisfies MealListResponse, HTTP_OK)
		},
	)
	return routes
}
