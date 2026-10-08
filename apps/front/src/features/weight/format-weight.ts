import { formatNumber } from '../../lib/format/format-number'

export function formatWeight(weight: number, unitLabel: string): string {
	return `${formatNumber(weight)} ${unitLabel}`
}
