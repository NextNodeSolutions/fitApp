const HEX_CHARS_PER_BYTE = 2
export const API_TOKEN_BYTE_LENGTH = 16
export const API_TOKEN_HEX_LENGTH = API_TOKEN_BYTE_LENGTH * HEX_CHARS_PER_BYTE
export const API_TOKEN_HEX_PATTERN = new RegExp(
	`^[0-9a-f]{${API_TOKEN_HEX_LENGTH}}$`,
)

export const INGEST_SOURCE_VALUES = ['ai'] as const
export const INGEST_SOURCE_AI = INGEST_SOURCE_VALUES[0]
export type IngestSource = (typeof INGEST_SOURCE_VALUES)[number]

export const INGEST_INVALID_BODY_MESSAGE = 'Invalid body schema'
export const INGEST_INVALID_TOKEN_MESSAGE = 'Invalid API token'

export const INGEST_PATH = '/api/ingest'
