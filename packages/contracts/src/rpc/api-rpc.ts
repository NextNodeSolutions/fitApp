import type { MealsRangeQuery } from '../meals/query-schema'
import type { MealListResponse } from '../meals/responses'
import type {
	SettingsProfileResponse,
	SettingsTokenResponse,
} from '../settings/responses'
import type { WeightPeriod } from '../weight/constants'
import type { WeightListResponse } from '../weight/responses'

/**
 * Reads the API worker serves over RPC, through a service binding only (the
 * front). RPC never leaves Cloudflare, so the API trusts the user id: the
 * caller has already verified the session. Payloads match the HTTP shapes.
 */
export type ApiRpc = {
	/** null when the user has not completed onboarding yet. */
	getSettingsProfile(userId: string): Promise<SettingsProfileResponse | null>
	getApiToken(userId: string): Promise<SettingsTokenResponse>
	listWeightEntries(
		userId: string,
		period: WeightPeriod,
	): Promise<WeightListResponse>
	listMealEntries(
		userId: string,
		range: MealsRangeQuery,
	): Promise<MealListResponse>
}
