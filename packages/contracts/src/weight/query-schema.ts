import * as v from 'valibot'

import { WEIGHT_PERIODS } from './constants'

export const WeightPeriodSchema = v.picklist(
	WEIGHT_PERIODS,
	'La période demandée est invalide',
)
