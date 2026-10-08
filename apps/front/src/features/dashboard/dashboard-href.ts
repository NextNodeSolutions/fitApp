import { ROUTES } from '../../lib/routes'

export function dashboardHref(isoDate: string, today: string): string {
	if (isoDate >= today) return ROUTES.dashboard
	return `${ROUTES.dashboard}?date=${isoDate}`
}
