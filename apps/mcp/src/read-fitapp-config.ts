export type FitAppConfig = {
	apiToken: string
}

export function readFitAppConfig(): FitAppConfig {
	const apiToken = process.env.FITAPP_API_TOKEN?.trim()
	if (!apiToken) {
		throw new Error(
			'FITAPP_API_TOKEN est manquant. Définis FITAPP_API_TOKEN avec ton jeton API FitApp.',
		)
	}
	return { apiToken }
}
