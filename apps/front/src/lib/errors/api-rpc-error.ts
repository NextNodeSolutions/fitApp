export class ApiRpcError extends Error {
	constructor(method: string) {
		super(`fitApp API binding exposes no RPC method named ${method}`)
		this.name = 'ApiRpcError'
	}
}
