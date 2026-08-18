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

type OnboardingBody = {
	height: number
	weight: number
	age: number
	sex: string
	activityLevel: string
}

const onboarding = new Hono<{ Bindings: Env }>()

function validateNumericField(
	value: unknown,
	min: number,
	max: number,
	label: string,
): string | null {
	if (typeof value !== 'number' || !Number.isFinite(value)) {
		return `${label} doit être un nombre valide`
	}
	if (value < min || value > max) {
		return `${label} doit être compris entre ${min} et ${max}`
	}
	return null
}

function validateOnboardingBody(body: OnboardingBody): string[] {
	const errors: string[] = []

	const heightError = validateNumericField(
		body.height,
		MIN_HEIGHT,
		MAX_HEIGHT,
		'La taille',
	)
	if (heightError) errors.push(heightError)

	const weightError = validateNumericField(
		body.weight,
		MIN_WEIGHT,
		MAX_WEIGHT,
		'Le poids',
	)
	if (weightError) errors.push(weightError)

	const ageError = validateNumericField(body.age, MIN_AGE, MAX_AGE, "L'âge")
	if (ageError) errors.push(ageError)

	if (!isValidSex(body.sex)) {
		errors.push('Le sexe est obligatoire')
	}
	if (!isValidActivityLevel(body.activityLevel)) {
		errors.push("Le niveau d'activité est obligatoire")
	}

	return errors
}

onboarding.post('/', async c => {
	const body = await c.req.json<OnboardingBody>()

	const errors = validateOnboardingBody(body)

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
})

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
