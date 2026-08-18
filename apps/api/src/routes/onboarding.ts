import { vValidator } from '@hono/valibot-validator'
import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'
import * as v from 'valibot'

import * as schema from '../db/schema'

const HTTP_CREATED = 201
const HTTP_NOT_FOUND = 404
const HTTP_BAD_REQUEST = 400

const MIN_HEIGHT = 100
const MAX_HEIGHT = 250
const MIN_WEIGHT = 30
const MAX_WEIGHT = 300
const MIN_AGE = 10
const MAX_AGE = 120

const OnboardingBodySchema = v.object({
	height: v.pipe(
		v.number('La taille doit être un nombre valide'),
		v.minValue(MIN_HEIGHT, 'La taille doit être comprise entre 100 et 250'),
		v.maxValue(MAX_HEIGHT, 'La taille doit être comprise entre 100 et 250'),
	),
	weight: v.pipe(
		v.number('Le poids doit être un nombre valide'),
		v.minValue(MIN_WEIGHT, 'Le poids doit être compris entre 30 et 300'),
		v.maxValue(MAX_WEIGHT, 'Le poids doit être compris entre 30 et 300'),
	),
	age: v.pipe(
		v.number("L'âge doit être un nombre valide"),
		v.minValue(MIN_AGE, "L'âge doit être compris entre 10 et 120"),
		v.maxValue(MAX_AGE, "L'âge doit être compris entre 10 et 120"),
	),
	sex: v.picklist(['male', 'female'], 'Le sexe est obligatoire'),
	activityLevel: v.picklist(
		['sedentary', 'light', 'moderate', 'active', 'very_active'],
		"Le niveau d'activité est obligatoire",
	),
})

const onboarding = new Hono<{ Bindings: Env }>()

onboarding.post(
	'/',
	vValidator('json', OnboardingBodySchema, (parseResult, c) => {
		if (!parseResult.success) {
			return c.json(
				{ errors: parseResult.issues.map(i => i.message) },
				HTTP_BAD_REQUEST,
			)
		}
	}),
	async c => {
		const body = c.req.valid('json')
		const sessionId = crypto.randomUUID()

		await c.env.DB.prepare(
			`INSERT INTO profiles (session_id, height, weight, age, sex, activity_level) VALUES (?, ?, ?, ?, ?, ?)`,
		)
			.bind(
				sessionId,
				body.height,
				body.weight,
				body.age,
				body.sex,
				body.activityLevel,
			)
			.run()

		return c.json(
			{
				profile: {
					height: body.height,
					weight: body.weight,
					age: body.age,
					sex: body.sex,
					activityLevel: body.activityLevel,
				},
				sessionId,
			},
			HTTP_CREATED,
		)
	},
)

onboarding.get('/:sessionId', async c => {
	const { sessionId } = c.req.param()

	const d1 = drizzle(c.env.DB, { schema })

	const [profile] = await d1
		.select({
			height: schema.profiles.height,
			weight: schema.profiles.weight,
			age: schema.profiles.age,
			sex: schema.profiles.sex,
			activityLevel: schema.profiles.activityLevel,
		})
		.from(schema.profiles)
		.where(eq(schema.profiles.sessionId, sessionId))
		.limit(1)

	if (!profile) {
		return c.json({ error: 'Profil non trouvé' }, HTTP_NOT_FOUND)
	}

	return c.json({ profile })
})

export { onboarding }
