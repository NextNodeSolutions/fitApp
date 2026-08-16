export class ApiError extends Error {
	readonly status: number

	constructor(path: string, status: number) {
		super(`fitApp API request to ${path} failed with status ${status}`)
		this.name = 'ApiError'
		this.status = status
	}
}
