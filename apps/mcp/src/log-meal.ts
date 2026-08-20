import { formatMealSummary } from './format-meal-summary.ts'
import { ingestMeals } from './ingest-meals.ts'

import type { IngestBody, IngestItem } from '@fitapp/contracts'
import type { CallToolResult } from '@modelcontextprotocol/server'
import type { IngestMealsOutcome } from './ingest-meals.ts'
import type { LogMealInput } from './log-meal-input-schema.ts'
import type { FitAppConfig } from './read-fitapp-config.ts'

export async function logMeal(
	config: FitAppConfig,
	input: LogMealInput,
	fetchImpl: typeof fetch = fetch,
): Promise<CallToolResult> {
	const body = toIngestBody(input)
	const outcome = await ingestMeals(config, body, fetchImpl)
	return toLogMealResult(outcome, body)
}

function toIngestBody(input: LogMealInput): IngestBody {
	return {
		date: input.date,
		items: input.items.map(toIngestItem),
	}
}

function toIngestItem(food: LogMealInput['items'][number]): IngestItem {
	return {
		name: food.name,
		calories: food.calories,
		protein_g: food.protein_g ?? 0,
		carbs_g: food.carbs_g ?? 0,
		fat_g: food.fat_g ?? 0,
	}
}

function toLogMealResult(
	outcome: IngestMealsOutcome,
	body: IngestBody,
): CallToolResult {
	switch (outcome.kind) {
		case 'success':
			return textToolResult(formatMealSummary(body.date, body.items))
		case 'invalid-token':
			return errorToolResult('🔒 Jeton API invalide')
		case 'network':
			return errorToolResult(`❌ Erreur réseau : ${outcome.message}`)
		case 'fitapp-error':
			return errorToolResult(
				`❌ Erreur FitApp (${outcome.status}) : ${outcome.error}`,
			)
	}
}

function textToolResult(text: string): CallToolResult {
	return { content: [{ type: 'text', text }] }
}

function errorToolResult(text: string): CallToolResult {
	return { content: [{ type: 'text', text }], isError: true }
}
