import { Temporal } from '@js-temporal/polyfill'

export function todayIsoDate(): string {
	return Temporal.Now.plainDateISO().toString()
}
