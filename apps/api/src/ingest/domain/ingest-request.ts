import type { IngestBody } from '@fitapp/contracts'

export type AuthenticatedIngest = IngestBody & {
	userId: string
}
