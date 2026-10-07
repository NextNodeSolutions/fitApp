import * as v from 'valibot'

import { addDaysIso, isIsoDate } from '../dates/iso-dates'

import { MEALS_MAX_RANGE_DAYS } from './constants'

import type { IsoDateRange } from '../dates/iso-dates'

type IsoDateField = v.SchemaWithPipe<
	readonly [v.StringSchema<string>, v.CheckAction<string, string>]
>

function isoDateField(invalidMessage: string): IsoDateField {
	return v.pipe(
		v.string(invalidMessage),
		v.check(candidate => isIsoDate(candidate), invalidMessage),
	)
}

// valibot still runs object-level checks after a field check failed: the
// cross-field rules stay silent until both bounds are real calendar dates.
function hasValidBounds({ from, to }: IsoDateRange): boolean {
	return isIsoDate(from) && isIsoDate(to)
}

function isOrderedRange(range: IsoDateRange): boolean {
	if (!hasValidBounds(range)) return true
	return range.from <= range.to
}

function isWithinMaxRange(range: IsoDateRange): boolean {
	if (!hasValidBounds(range)) return true
	return range.to <= addDaysIso(range.from, MEALS_MAX_RANGE_DAYS - 1)
}

export const MealsRangeQuerySchema = v.pipe(
	v.object(
		{
			from: isoDateField('La date de début est invalide'),
			to: isoDateField('La date de fin est invalide'),
		},
		'Les dates de début et de fin sont obligatoires',
	),
	v.check(
		isOrderedRange,
		'La date de début doit être antérieure ou égale à la date de fin',
	),
	v.check(
		isWithinMaxRange,
		`La période demandée ne peut pas dépasser ${MEALS_MAX_RANGE_DAYS} jours`,
	),
)

export type MealsRangeQuery = v.InferOutput<typeof MealsRangeQuerySchema>
