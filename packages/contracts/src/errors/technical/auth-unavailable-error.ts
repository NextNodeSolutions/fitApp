import { AppError } from '../app-error'

export class AuthUnavailableError extends AppError {
	readonly code = 'AUTH_UNAVAILABLE'

	constructor() {
		super("Service d'authentification momentanément indisponible")
	}
}
