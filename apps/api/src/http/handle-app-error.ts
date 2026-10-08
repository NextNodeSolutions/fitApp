import { AppError, HTTP_BAD_REQUEST } from '@fitapp/contracts'
import { HTTPException } from 'hono/http-exception'

import type { ValidationErrorResponse } from '@fitapp/contracts'
import type { ErrorHandler } from 'hono'

// Renders an AppError that carries an HTTP status as its JSON body, and Hono's
// own 400 (malformed JSON body) in the validation shape the routes document.
// Anything else is rethrown so Sentry captures it.
export const handleAppError: ErrorHandler<{ Bindings: Env }> = (error, res) => {
	if (error instanceof AppError && error.status) {
		return res.json(error.toJSON(), error.status)
	}
	if (error instanceof HTTPException && error.status === HTTP_BAD_REQUEST) {
		const body: ValidationErrorResponse = { errors: [error.message] }
		return res.json(body, HTTP_BAD_REQUEST)
	}
	throw error
}
