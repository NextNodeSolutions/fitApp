export const API_TOKEN_BYTE_LENGTH = 16
export const API_TOKEN_HEX_LENGTH = 32
export const API_TOKEN_HEX_PATTERN = /^[0-9a-f]{32}$/

export const INGEST_SOURCE_VALUES = ['ai'] as const
export const INGEST_SOURCE_AI = INGEST_SOURCE_VALUES[0]
export type IngestSource = (typeof INGEST_SOURCE_VALUES)[number]

export const INGEST_INVALID_BODY_MESSAGE = 'Invalid body schema'
export const INGEST_INVALID_TOKEN_MESSAGE = 'Invalid API token'
