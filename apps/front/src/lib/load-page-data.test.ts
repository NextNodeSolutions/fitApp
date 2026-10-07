import { describe, expect, it } from 'vitest'

import { loadPageData } from './load-page-data'

describe('loadPageData', () => {
	it('returns what the reads produced', async () => {
		await expect(loadPageData(async () => ({ meals: 3 }))).resolves.toEqual(
			{
				meals: 3,
			},
		)
	})

	it('returns null when a read fails, instead of empty data', async () => {
		await expect(
			loadPageData(async () => {
				throw new Error('binding down')
			}),
		).resolves.toBeNull()
	})
})
