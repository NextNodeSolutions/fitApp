import { describe, expect, it } from 'vitest'

import { AppError } from './app-error'
import { OnboardingSaveError } from './business/onboarding-save-error'
import { OnboardingValidationError } from './business/onboarding-validation-error'
import { ProfileNotFoundError } from './business/profile-not-found-error'
import { ConnectionError } from './technical/connection-error'
import { InvalidServerResponseError } from './technical/invalid-server-response-error'

describe('business errors', () => {
	it('exposes a profile-not-found code and HTTP status', () => {
		const error = new ProfileNotFoundError()

		expect(error).toBeInstanceOf(AppError)
		expect(error).toBeInstanceOf(Error)
		expect(error.code).toBe('PROFILE_NOT_FOUND')
		expect(error.status).toBe(404)
		expect(error.toJSON()).toEqual({
			code: 'PROFILE_NOT_FOUND',
			message: 'Profil non trouvé',
		})
	})

	it('exposes an onboarding-save code without HTTP status', () => {
		const error = new OnboardingSaveError()

		expect(error).toBeInstanceOf(AppError)
		expect(error.code).toBe('ONBOARDING_SAVE')
		expect(error.status).toBeUndefined()
	})

	it('joins validation messages into one business error', () => {
		const error = new OnboardingValidationError([
			'La taille est obligatoire',
			"L'âge doit être entre 10 et 120",
		])

		expect(error.code).toBe('ONBOARDING_VALIDATION')
		expect(error.status).toBe(400)
		expect(error.message).toBe(
			"La taille est obligatoire L'âge doit être entre 10 et 120",
		)
	})
})

describe('technical errors', () => {
	it('exposes a connection code', () => {
		const error = new ConnectionError()

		expect(error).toBeInstanceOf(AppError)
		expect(error.code).toBe('CONNECTION')
		expect(error.message).toBe('Erreur de connexion au serveur')
	})

	it('exposes an invalid-server-response code', () => {
		const error = new InvalidServerResponseError()

		expect(error).toBeInstanceOf(AppError)
		expect(error.code).toBe('INVALID_SERVER_RESPONSE')
	})
})
