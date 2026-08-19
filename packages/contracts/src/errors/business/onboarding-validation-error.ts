import { AppError } from '../app-error'

export class OnboardingValidationError extends AppError {
	readonly code = 'ONBOARDING_VALIDATION'
	override readonly status = 400

	constructor(messages: readonly string[]) {
		super(messages.join(' '))
	}
}
