import { AppError } from '../app-error'
import { UNAUTHORIZED_MESSAGE } from '../constants'

export class UnauthorizedError extends AppError {
	readonly code = 'UNAUTHORIZED'
	override readonly status = 401

	constructor() {
		super(UNAUTHORIZED_MESSAGE)
	}

	override toJSON(): { error: string } {
		return { error: this.message }
	}
}
