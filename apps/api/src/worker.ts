import { WorkerEntrypoint } from 'cloudflare:workers'

import { apiRpc, app } from './index'

import type {
	ApiRpc,
	MealListResponse,
	MealsRangeQuery,
	SettingsProfileResponse,
	SettingsTokenResponse,
	WeightListResponse,
	WeightPeriod,
} from '@fitapp/contracts'

// Worker entry. fetch serves the public HTTP API. The other methods are RPC:
// only a service binding (the front) can call them, never the internet.
// oxlint-disable-next-line import/no-default-export
export default class ApiWorker extends WorkerEntrypoint<Env> implements ApiRpc {
	override fetch(request: Request): Promise<Response> {
		return Promise.resolve(app.fetch(request, this.env, this.ctx))
	}

	getSettingsProfile(
		userId: string,
	): Promise<SettingsProfileResponse | null> {
		return apiRpc(this.env).getSettingsProfile(userId)
	}

	getApiToken(userId: string): Promise<SettingsTokenResponse> {
		return apiRpc(this.env).getApiToken(userId)
	}

	listWeightEntries(
		userId: string,
		period: WeightPeriod,
	): Promise<WeightListResponse> {
		return apiRpc(this.env).listWeightEntries(userId, period)
	}

	listMealEntries(
		userId: string,
		range: MealsRangeQuery,
	): Promise<MealListResponse> {
		return apiRpc(this.env).listMealEntries(userId, range)
	}
}
