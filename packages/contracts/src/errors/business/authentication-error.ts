import { AppError } from '../app-error'

export class AuthenticationError extends AppError {
	readonly code = 'AUTHENTICATION'
	override readonly status = 400

	constructor() {
		super('Email ou mot de passe incorrect')
	}
}
