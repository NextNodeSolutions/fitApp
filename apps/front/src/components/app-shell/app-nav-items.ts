import { Scale, Settings, Sun } from 'lucide-react'

import { ROUTES } from '../../lib/routes'

export const APP_NAV_ITEMS = [
	{ key: 'today', href: ROUTES.dashboard, label: "Aujourd'hui", icon: Sun },
	{ key: 'weight', href: ROUTES.weight, label: 'Poids', icon: Scale },
	{
		key: 'settings',
		href: ROUTES.settings,
		label: 'Réglages',
		icon: Settings,
	},
] as const

export type AppNavKey = (typeof APP_NAV_ITEMS)[number]['key']
