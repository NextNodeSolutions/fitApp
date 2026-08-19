import { AppError } from '../app-error'

export class OnboardingSaveError extends AppError {
	readonly code = 'ONBOARDING_SAVE'

	constructor() {
		super("Erreur lors de l'enregistrement")
	}
}
