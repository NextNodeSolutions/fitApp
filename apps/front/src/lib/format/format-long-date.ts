import { parseIsoDate } from '@fitapp/contracts'

const LONG_DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', {
	weekday: 'long',
	day: 'numeric',
	month: 'long',
	timeZone: 'UTC',
})

export function formatLongDate(isoDate: string): string {
	const label = LONG_DATE_FORMAT.format(parseIsoDate(isoDate))
	return label.charAt(0).toLocaleUpperCase('fr-FR') + label.slice(1)
}
