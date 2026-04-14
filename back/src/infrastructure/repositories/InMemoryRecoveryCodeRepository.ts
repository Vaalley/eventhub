import type { RecoveryCodeData, RecoveryCodeRepositoryInterface } from '../../domain'

export class InMemoryRecoveryCodeRepository implements RecoveryCodeRepositoryInterface {
	private recoveryCodes: Map<string, RecoveryCodeData[]> = new Map()

	async saveMany(userId: string, codeHashes: string[]): Promise<void> {
		const existingCodes = this.recoveryCodes.get(userId) || []
		const newCodes: RecoveryCodeData[] = codeHashes.map((codeHash) => ({
			id: crypto.randomUUID(),
			userId,
			codeHash,
			used: false,
			createdAt: new Date(),
		}))
		this.recoveryCodes.set(userId, [...existingCodes, ...newCodes])
	}

	async findByUserId(userId: string): Promise<RecoveryCodeData[]> {
		return this.recoveryCodes.get(userId) || []
	}

	async markAsUsed(id: string): Promise<void> {
		for (const codes of this.recoveryCodes.values()) {
			const code = codes.find((c) => c.id === id)
			if (code) {
				code.used = true
				return
			}
		}
	}

	async deleteByUserId(userId: string): Promise<void> {
		this.recoveryCodes.delete(userId)
	}
}
