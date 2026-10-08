import { APP_NAME } from '@fitapp/contracts'

import DayScreen from './DayScreen.astro'
import LoggedScreen from './LoggedScreen.astro'
import PromptScreen from './PromptScreen.astro'
import WeekScreen from './WeekScreen.astro'

export const HOW_STEPS = [
	{
		title: 'Tu le dis.',
		text: "Comme à un ami, avec tes mots. Pas de balance, pas de code-barres, pas d'aliment à chercher.",
		Screen: PromptScreen,
		kind: 'chat',
	},
	{
		title: 'Ton IA compte.',
		text: `Elle estime calories et macros, puis enregistre le repas dans ${APP_NAME} en une seconde.`,
		Screen: LoggedScreen,
		kind: 'chat',
	},
	{
		title: 'Tu vois ta journée.',
		text: "Calories, protéines, glucides, lipides : où tu en es par rapport à ton objectif, d'un coup d'œil.",
		Screen: DayScreen,
		kind: 'app',
	},
	{
		title: 'Tu demandes ton bilan.',
		text: "Demande-lui comment s'est passée ta semaine : ton IA te répond avec tes vrais chiffres.",
		Screen: WeekScreen,
		kind: 'chat',
		// Follow-up prompts, shown under the step on mobile only: the phone has no room.
		suggestions: ['Et ce soir, je mange quoi ?', 'Détaille mes protéines'],
	},
] as const
