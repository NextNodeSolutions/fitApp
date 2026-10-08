import { DISPLAY_TIME_ZONE } from './display-time-zone'

const TIME_FORMAT = new Intl.DateTimeFormat('fr-FR', {
	hour: '2-digit',
	minute: '2-digit',
	timeZone: DISPLAY_TIME_ZONE,
})

export function formatMealTime(loggedAt: number): string {
	return TIME_FORMAT.format(loggedAt)
}
