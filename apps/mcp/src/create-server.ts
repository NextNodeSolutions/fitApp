import { McpServer } from '@modelcontextprotocol/server'

import { logMealInputSchema } from './log-meal-input-schema.ts'
import { logMeal } from './log-meal.ts'
import { readFitAppConfig } from './read-fitapp-config.ts'

export function createServer(): McpServer {
	const config = readFitAppConfig()
	const server = new McpServer({
		name: 'fitapp',
		version: '0.0.1',
	})
	server.registerTool(
		'log_meal',
		{
			title: 'Enregistrer un repas',
			description: 'Enregistre un ou plusieurs repas dans FitApp.',
			inputSchema: logMealInputSchema,
		},
		async input => logMeal(config, input),
	)
	return server
}
