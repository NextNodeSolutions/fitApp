import { parseIsoDate } from '@fitapp/contracts'

import type { DisplayWeightEntry } from './display-weight-entry'

const MIN_TREND_ENTRIES = 2
const PLOT_EXTENT = 100
// A flat series (every weight equal) sits mid-height.
const FLAT_LINE_Y = 50
const COORDINATE_PRECISION = 100

/** A point in the 0-100 plot space: x left to right in time, y top to bottom. */
export type PlotPoint = { x: number; y: number }

export type WeightTrend = {
	start: DisplayWeightEntry
	latest: DisplayWeightEntry
	delta: number
	minWeight: number
	maxWeight: number
	linePath: string
	areaPath: string
	latestPoint: PlotPoint
}

const roundCoordinate = (coordinate: number): number =>
	Math.round(coordinate * COORDINATE_PRECISION) / COORDINATE_PRECISION

const entryTime = (entry: DisplayWeightEntry): number =>
	parseIsoDate(entry.entryDate).getTime()

function createScale(
	domainStart: number,
	domainEnd: number,
	flatPosition: number,
): (domainValue: number) => number {
	const span = domainEnd - domainStart
	if (!span) return () => flatPosition
	return domainValue =>
		roundCoordinate(((domainValue - domainStart) / span) * PLOT_EXTENT)
}

/**
 * Shapes weigh-ins (newest first, as the API returns them) into a trend:
 * start and latest entries, delta and SVG paths in the 0-100 plot space,
 * x spread by date, y from the heaviest (top) to the lightest (bottom).
 * A line needs two entries: returns undefined below that.
 */
export function buildWeightTrend(
	entriesNewestFirst: readonly DisplayWeightEntry[],
): WeightTrend | undefined {
	const [latest] = entriesNewestFirst
	const start = entriesNewestFirst.at(-1)
	if (!latest || !start || entriesNewestFirst.length < MIN_TREND_ENTRIES) {
		return undefined
	}

	const chronological = entriesNewestFirst.toReversed()
	const weights = chronological.map(entry => entry.weight)
	const minWeight = Math.min(...weights)
	const maxWeight = Math.max(...weights)
	const toX = createScale(entryTime(start), entryTime(latest), 0)
	// Inverted domain: the heaviest weight sits at the top of the plot (y = 0).
	const toY = createScale(maxWeight, minWeight, FLAT_LINE_Y)
	const toPoint = (entry: DisplayWeightEntry): PlotPoint => ({
		x: toX(entryTime(entry)),
		y: toY(entry.weight),
	})
	const line = chronological
		.map(toPoint)
		.map(point => `${point.x},${point.y}`)
		.join(' L ')

	return {
		start,
		latest,
		delta: latest.weight - start.weight,
		minWeight,
		maxWeight,
		linePath: `M ${line}`,
		areaPath: `M 0,${PLOT_EXTENT} L ${line} L ${PLOT_EXTENT},${PLOT_EXTENT} Z`,
		latestPoint: toPoint(latest),
	}
}
