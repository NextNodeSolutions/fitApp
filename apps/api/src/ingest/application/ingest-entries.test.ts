import { describe, expect, it, vi } from 'vitest'

import { ingestEntries } from './ingest-entries'

import type { IngestRepository } from '../ports/ingest-repository'

const BODY = {
	date: '2026-08-20',
	items: [
		{
			name: 'Poulet rôti',
			calories: 250,
			protein_g: 30,
			carbs_g: 0,
			fat_g: 14,
		},
	],
}

function createRepository(userId: string | null): IngestRepository {
	return {
		findUserIdByApiToken: vi.fn(async () => userId),
		insertEntries: vi.fn(async ingest => ingest.items.length),
	}
}

describe('ingestEntries', () => {
	it('rejects an unknown API token without writing', async () => {
		const repository = createRepository(null)

		await expect(
			ingestEntries(repository, 'unknown', BODY),
		).resolves.toBeNull()
		expect(repository.insertEntries).not.toHaveBeenCalled()
	})

	it('inserts every item for the token owner', async () => {
		const repository = createRepository('user-1')

		await expect(ingestEntries(repository, 'token', BODY)).resolves.toBe(1)
		expect(repository.insertEntries).toHaveBeenCalledWith({
			...BODY,
			userId: 'user-1',
		})
	})
})
