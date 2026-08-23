export interface ApiTokenRepository {
	findByUserId(userId: string): Promise<string | null>
}
