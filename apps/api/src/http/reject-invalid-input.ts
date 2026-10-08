import { HTTP_BAD_REQUEST } from '@fitapp/contracts'

import type { Context } from 'hono'

type ParseResult =
	| { success: true }
	| { success: false; error: readonly { message: string }[] }

// Validator hook: answers a failed parse with 400 and every issue message.
export function rejectInvalidInput(
	parseResult: ParseResult,
	res: Context,
): Response | undefined {
	if (parseResult.success) return
	return res.json(
		{ errors: parseResult.error.map(issue => issue.message) },
		HTTP_BAD_REQUEST,
	)
}
