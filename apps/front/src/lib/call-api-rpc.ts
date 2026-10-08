import { ApiRpcError } from './errors/api-rpc-error'

import type { ApiRpc } from '@fitapp/contracts'

/**
 * Calls an API worker RPC method over the service binding, without a session
 * check on the API side: pass the user id the middleware verified. The binding
 * is typed as a plain Fetcher, so callers validate the result with the
 * contracts schema of the payload.
 */
export async function callApiRpc<Method extends keyof ApiRpc>(
	env: Pick<Env, 'API'>,
	method: Method,
	...args: Parameters<ApiRpc[Method]>
): Promise<unknown> {
	const procedure: unknown = Reflect.get(env.API, method)
	if (typeof procedure !== 'function') throw new ApiRpcError(method)
	return Reflect.apply(procedure, env.API, args)
}
