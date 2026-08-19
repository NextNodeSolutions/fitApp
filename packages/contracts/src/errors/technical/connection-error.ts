import { AppError } from '../app-error'

export class ConnectionError extends AppError {
	readonly code = 'CONNECTION'

	constructor() {
		super('Erreur de connexion au serveur')
	}
}
