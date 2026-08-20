import type { AppError } from '@fitapp/contracts'

export type SubmitAuthResult = { ok: true } | { ok: false; error: AppError }
