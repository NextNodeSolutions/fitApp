const ALLOWED_PROTOCOLS = new Set(['http:', 'https:'])

export type FitAppConfig = {
	fitappUrl: string
	apiToken: string
}

export function readFitAppConfig(): FitAppConfig {
	const { FITAPP_URL, FITAPP_API_TOKEN } = process.env
	const fitappUrl = FITAPP_URL?.trim()
	const apiToken = FITAPP_API_TOKEN?.trim()
	if (!fitappUrl) {
		throw new Error(
			"FITAPP_URL est manquant. Définis FITAPP_URL vers l'origine FitApp, par exemple https://api-fitapp.nextnode.fr.",
		)
	}
	if (!apiToken) {
		throw new Error(
			'FITAPP_API_TOKEN est manquant. Définis FITAPP_API_TOKEN avec ton jeton API FitApp.',
		)
	}
	return {
		fitappUrl: parseFitAppUrl(fitappUrl),
		apiToken,
	}
}

function parseFitAppUrl(fitAppUrlValue: string): string {
	try {
		const fitAppUrl = new URL(fitAppUrlValue)
		if (!ALLOWED_PROTOCOLS.has(fitAppUrl.protocol)) throw new Error()
		return fitAppUrl.origin
	} catch {
		throw new Error(
			`FITAPP_URL est invalide (${fitAppUrlValue}). Utilise une URL HTTP ou HTTPS absolue.`,
		)
	}
}
