import type { AuthenticatedIngest } from '../domain/ingest-request'

export interface IngestRepository {
	findUserIdByApiToken(apiToken: string): Promise<string | null>
	insertEntries(ingest: AuthenticatedIngest): Promise<number>
}
