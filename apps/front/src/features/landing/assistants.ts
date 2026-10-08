export const ASSISTANTS = [
	{
		name: 'ChatGPT',
		detail: 'OpenAI',
		availability: '1 clic',
		tier: 'primary',
	},
	{
		name: 'Claude',
		detail: 'Anthropic',
		availability: '1 clic',
		tier: 'primary',
	},
	{
		name: 'Gemini',
		detail: 'Google',
		availability: '1 clic',
		tier: 'primary',
	},
	{
		name: 'Hermes et tout client MCP',
		detail: 'Une adresse et ta clé personnelle',
		availability: 'MCP',
		tier: 'secondary',
	},
	{
		name: 'App iPhone et Android',
		detail: 'Pour les jours sans assistant',
		availability: 'Bientôt',
		tier: 'secondary',
	},
] as const
