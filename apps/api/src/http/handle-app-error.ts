import { AppError } from '@fitapp/contracts'

import type { ErrorHandler } from 'hono'

// Renders an AppError that carries an HTTP status as its JSON body. Anything
// else is rethrown so Sentry captures it.
export const handleAppError: ErrorHandler<{ Bindings: Env }> = (error, res) => {
	if (error instanceof AppError && error.status) {
		return res.json(error.toJSON(), error.status)
	}
	throw error
}
