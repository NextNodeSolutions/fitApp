const MIN_HEIGHT = 100
const MAX_HEIGHT = 250
const MIN_WEIGHT = 30
const MAX_WEIGHT = 300
const MIN_AGE = 10
const MAX_AGE = 120

export type FieldErrors = Record<string, string>

export function validateHeight(weight: string): string | null {
	if (!weight) return 'La taille est obligatoire'
	const num = Number(weight)
	if (num < MIN_HEIGHT || num > MAX_HEIGHT) {
		return 'La taille doit être entre 100 et 250 cm'
	}
	return null
}

export function validateWeight(weight: string): string | null {
	if (!weight) return 'Le poids est obligatoire'
	const num = Number(weight)
	if (num < MIN_WEIGHT || num > MAX_WEIGHT) {
		return 'Le poids doit être entre 30 et 300 kg'
	}
	return null
}

export function validateAge(age: string): string | null {
	if (!age) return "L'âge est obligatoire"
	const num = Number(age)
	if (num < MIN_AGE || num > MAX_AGE) {
		return "L'âge doit être entre 10 et 120 ans"
	}
	return null
}

function validateRequired(value: string, label: string): string | null {
	if (!value) return `${label} est obligatoire`
	return null
}

export const VALIDATORS: Record<string, (value: string) => string | null> = {
	height: validateHeight,
	weight: validateWeight,
	age: validateAge,
	sex: (v: string) => validateRequired(v, 'Le sexe'),
	activityLevel: (v: string) => validateRequired(v, "Le niveau d'activité"),
}

export function validateAllFields(fields: [string, string][]): FieldErrors {
	const errors: FieldErrors = {}
	for (const [name, value] of fields) {
		const validator = VALIDATORS[name]
		if (!validator) continue
		const error = validator(value)
		if (error) errors[name] = error
	}
	return errors
}

export function validateOneField(name: string, value: string): string | null {
	const validator = VALIDATORS[name]
	if (!validator) return null
	return validator(value)
}
