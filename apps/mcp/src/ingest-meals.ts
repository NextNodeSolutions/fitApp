import { HTTP_UNAUTHORIZED } from '@fitapp/contracts/http'

import type { IngestBody } from '@fitapp/contracts'
import type { FitAppConfig } from './read-fitapp-config.ts'

const INGEST_PATH = '/api/ingest'

export type IngestMealsOutcome =
	| { kind: 'success' }
	| { kind: 'invalid-token' }
	| { kind: 'network'; message: string }
	| { kind: 'fitapp-error'; status: number; error: string }

export async function ingestMeals(
	config: FitAppConfig,
	body: IngestBody,
	fetchImpl: typeof fetch = fetch,
): Promise<IngestMealsOutcome> {
	try {
		const response = await fetchImpl(`${config.fitappUrl}${INGEST_PATH}`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${config.apiToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		})
		return await mapIngestResponse(response)
	} catch (caught: unknown) {
		return { kind: 'network', message: networkErrorMessage(caught) }
	}
}

async function mapIngestResponse(
	response: Response,
): Promise<IngestMealsOutcome> {
	if (response.status === HTTP_UNAUTHORIZED) {
		return { kind: 'invalid-token' }
	}
	if (response.ok) {
		return { kind: 'success' }
	}
	return {
		kind: 'fitapp-error',
		status: response.status,
		error: await readFitappError(response),
	}
}

async function readFitappError(response: Response): Promise<string> {
	const payload = await readJsonPayload(response)
	if (hasErrorMessage(payload)) return payload.error
	if (response.statusText) return response.statusText
	return 'réponse invalide'
}

async function readJsonPayload(response: Response): Promise<unknown> {
	try {
		return await response.json()
	} catch {
		return null
	}
}

function hasErrorMessage(payload: unknown): payload is { error: string } {
	if (typeof payload !== 'object' || payload === null) return false
	if (!('error' in payload)) return false
	return typeof payload.error === 'string'
}

function networkErrorMessage(caught: unknown): string {
	if (caught instanceof Error) return caught.message
	return 'erreur inconnue'
}
