import { AppError } from '../app-error'

export class EmailAlreadyUsedError extends AppError {
	readonly code = 'EMAIL_ALREADY_USED'
	override readonly status = 400

	constructor() {
		super('Cet email est déjà utilisé')
	}
}
