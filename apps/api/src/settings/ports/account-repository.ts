export interface AccountRepository {
	deleteByUserId(userId: string): Promise<void>
}
