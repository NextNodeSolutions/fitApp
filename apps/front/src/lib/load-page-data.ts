import { captureException } from '@sentry/astro'

/**
 * Runs a page's API reads. A failure is reported to Sentry and returns null,
 * so the page shows that loading failed instead of rendering empty data.
 */
export async function loadPageData<Data>(
	load: () => Promise<Data>,
): Promise<Data | null> {
	try {
		return await load()
	} catch (error) {
		captureException(error)
		return null
	}
}
