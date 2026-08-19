import { AppError } from '../app-error'

export class ProfileNotFoundError extends AppError {
	readonly code = 'PROFILE_NOT_FOUND'
	override readonly status = 404

	constructor() {
		super('Profil non trouvé')
	}
}
