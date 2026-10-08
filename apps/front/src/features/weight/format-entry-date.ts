import { parseIsoDate } from '@fitapp/contracts'

const ENTRY_DATE_FORMATS = {
	long: new Intl.DateTimeFormat('fr-FR', {
		timeZone: 'UTC',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}),
	short: new Intl.DateTimeFormat('fr-FR', {
		timeZone: 'UTC',
		day: 'numeric',
		month: 'short',
	}),
} as const

export type EntryDateFormat = keyof typeof ENTRY_DATE_FORMATS

/** Formats an ISO `YYYY-MM-DD` entry date, read as a UTC calendar day. */
export function formatEntryDate(
	entryDate: string,
	format: EntryDateFormat,
): string {
	return ENTRY_DATE_FORMATS[format].format(parseIsoDate(entryDate))
}
