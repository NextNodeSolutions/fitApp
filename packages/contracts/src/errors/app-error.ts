export type AppErrorStatus = 400 | 404 | 500

export abstract class AppError extends Error {
	abstract readonly code: string
	readonly status?: AppErrorStatus

	constructor(message: string) {
		super(message)
		this.name = new.target.name
		Object.setPrototypeOf(this, new.target.prototype)
	}

	toJSON(): { code: string; message: string } {
		return { code: this.code, message: this.message }
	}
}
