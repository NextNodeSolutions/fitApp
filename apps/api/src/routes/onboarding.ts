import { eq } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/d1'
import { Hono } from 'hono'

import * as schema from '../db/schema'

function isValidSex(sex: string): sex is 'male' | 'female' {
	return sex === 'male' || sex === 'female'
}

const VALID_ACTIVITY_LEVELS = [
	'sedentary',
	'light',
	'moderate',
	'active',
	'very_active',
] as const

function isValidActivityLevel(
	level: string,
): level is (typeof VALID_ACTIVITY_LEVELS)[number] {
	for (const valid of VALID_ACTIVITY_LEVELS) {
		if (valid === level) return true
	}
	return false
}

const MIN_HEIGHT = 100
const MAX_HEIGHT = 250
const MIN_WEIGHT = 30
const MAX_WEIGHT = 300
const MIN_AGE = 10
const MAX_AGE = 120

const HTTP_BAD_REQUEST = 400
const HTTP_CREATED = 201
const HTTP_NOT_FOUND = 404

const onboarding = new Hono<{ Bindings: Env }>()

onboarding.post('/', async c => {
	const body = await c.req.json<{
		height: number
		weight: number
		age: number
		sex: string
		activityLevel: string
	}>()

	const errors: string[] = []

	if (body.height < MIN_HEIGHT || body.height > MAX_HEIGHT) {
		errors.push('La taille doit être comprise entre 100 et 250 cm')
	}
	if (body.weight < MIN_WEIGHT || body.weight > MAX_WEIGHT) {
		errors.push('Le poids doit être compris entre 30 et 300 kg')
	}
	if (body.age < MIN_AGE || body.age > MAX_AGE) {
		errors.push("L'âge doit être compris entre 10 et 120 ans")
	}
	if (!isValidSex(body.sex)) {
		errors.push('Le sexe est obligatoire')
	}
	if (!isValidActivityLevel(body.activityLevel)) {
		errors.push("Le niveau d'activité est obligatoire")
	}

	if (errors.length > 0) {
		return c.json({ errors }, HTTP_BAD_REQUEST)
	}

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

	const d1 = drizzle(c.env.DB, { schema })

	const [profile] = await d1
		.select()
		.from(schema.profiles)
		.where(eq(schema.profiles.sessionId, sessionId))
		.limit(1)

	return c.json({ profile, sessionId }, HTTP_CREATED)
})

onboarding.get('/:sessionId', async c => {
	const { sessionId } = c.req.param()

	const d1 = drizzle(c.env.DB, { schema })

	const [profile] = await d1
		.select()
		.from(schema.profiles)
		.where(eq(schema.profiles.sessionId, sessionId))
		.limit(1)

	if (!profile) {
		return c.json({ error: 'Profil non trouvé' }, HTTP_NOT_FOUND)
	}

	return c.json({ profile })
})

export { onboarding }
