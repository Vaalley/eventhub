import type { PrismaClient } from '@prisma/client'
import type { RecoveryCodeData, RecoveryCodeRepositoryInterface } from '../../domain'

export class PrismaRecoveryCodeRepository implements RecoveryCodeRepositoryInterface {
	constructor(private readonly prisma: PrismaClient) {}

	async saveMany(userId: string, codeHashes: string[]): Promise<void> {
		await this.prisma.recoveryCode.createMany({
			data: codeHashes.map((codeHash) => ({
				userId,
				codeHash,
				used: false,
			})),
		})
	}

	async findByUserId(userId: string): Promise<RecoveryCodeData[]> {
		const codes = await this.prisma.recoveryCode.findMany({
			where: { userId },
		})

		return codes.map((c) => ({
			id: c.id,
			userId: c.userId,
			codeHash: c.codeHash,
			used: c.used,
			createdAt: c.createdAt,
		}))
	}

	async markAsUsed(id: string): Promise<void> {
		await this.prisma.recoveryCode.update({
			where: { id },
			data: { used: true },
		})
	}

	async deleteByUserId(userId: string): Promise<void> {
		await this.prisma.recoveryCode.deleteMany({
			where: { userId },
		})
	}
}
