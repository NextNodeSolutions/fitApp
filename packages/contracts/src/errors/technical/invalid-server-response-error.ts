import { AppError } from '../app-error'

export class InvalidServerResponseError extends AppError {
	readonly code = 'INVALID_SERVER_RESPONSE'

	constructor() {
		super('Réponse serveur invalide')
	}
}
