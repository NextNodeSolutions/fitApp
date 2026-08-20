import * as v from 'valibot'

import {
	INGEST_INVALID_BODY_MESSAGE,
	INGEST_INVALID_TOKEN_MESSAGE,
} from './constants'

export const IngestInsertedResponseSchema = v.object({
	inserted: v.pipe(v.number(), v.integer(), v.minValue(1)),
})

export const IngestInvalidBodyResponseSchema = v.object({
	error: v.literal(INGEST_INVALID_BODY_MESSAGE),
})

export const IngestInvalidTokenResponseSchema = v.object({
	error: v.literal(INGEST_INVALID_TOKEN_MESSAGE),
})

export type IngestInsertedResponse = v.InferOutput<
	typeof IngestInsertedResponseSchema
>
export type IngestInvalidBodyResponse = v.InferOutput<
	typeof IngestInvalidBodyResponseSchema
>
export type IngestInvalidTokenResponse = v.InferOutput<
	typeof IngestInvalidTokenResponseSchema
>
