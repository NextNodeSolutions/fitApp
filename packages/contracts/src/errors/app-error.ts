export type AppErrorStatus = 400 | 401 | 404 | 500

// Most errors render as `{ code, message }`; `{ error }` is the body 401
// responses have always sent, which clients already parse.
export type AppErrorBody = { code: string; message: string } | { error: string }

export abstract class AppError extends Error {
	abstract readonly code: string
	readonly status?: AppErrorStatus

	constructor(message: string) {
		super(message)
		this.name = new.target.name
		Object.setPrototypeOf(this, new.target.prototype)
	}

	toJSON(): AppErrorBody {
		return { code: this.code, message: this.message }
	}
}
