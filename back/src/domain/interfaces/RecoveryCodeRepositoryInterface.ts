export interface RecoveryCodeData {
	id?: string
	userId: string
	codeHash: string
	used: boolean
	createdAt?: Date
}

export interface RecoveryCodeRepositoryInterface {
	saveMany(userId: string, codeHashes: string[]): Promise<void>
	findByUserId(userId: string): Promise<RecoveryCodeData[]>
	markAsUsed(id: string): Promise<void>
	deleteByUserId(userId: string): Promise<void>
}
