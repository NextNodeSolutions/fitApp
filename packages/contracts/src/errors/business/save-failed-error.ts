import { AppError } from '../app-error'

export class SaveFailedError extends AppError {
	readonly code = 'SAVE_FAILED'

	constructor(messages?: readonly string[]) {
		super(
			messages && messages.length > 0
				? messages.join(' ')
				: 'Enregistrement impossible, réessaie',
		)
	}
}
