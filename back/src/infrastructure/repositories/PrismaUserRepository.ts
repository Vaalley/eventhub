import type { PrismaClient } from '@prisma/client'
import { User, type UserRepositoryInterface } from '../../domain'

export class PrismaUserRepository implements UserRepositoryInterface {
	constructor(private readonly prisma: PrismaClient) {}

	async save(user: User): Promise<User> {
		const created = await this.prisma.user.create({
			data: {
				email: user.email,
				name: user.name,
				passwordHash: user.passwordHash,
				otpSecret: user.otpSecret,
				otpEnabled: user.otpEnabled,
			},
		})

		return new User({
			id: created.id,
			email: created.email,
			name: created.name,
			passwordHash: created.passwordHash,
			otpSecret: created.otpSecret,
			otpEnabled: created.otpEnabled,
			createdAt: created.createdAt,
			updatedAt: created.updatedAt,
		})
	}

	async findById(id: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({ where: { id } })
		if (!user) return null

		return new User({
			id: user.id,
			email: user.email,
			name: user.name,
			passwordHash: user.passwordHash,
			otpSecret: user.otpSecret,
			otpEnabled: user.otpEnabled,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		})
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = await this.prisma.user.findUnique({ where: { email } })
		if (!user) return null

		return new User({
			id: user.id,
			email: user.email,
			name: user.name,
			passwordHash: user.passwordHash,
			otpSecret: user.otpSecret,
			otpEnabled: user.otpEnabled,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		})
	}

	async updateOtpSecret(userId: string, secret: string): Promise<void> {
		await this.prisma.user.update({
			where: { id: userId },
			data: { otpSecret: secret },
		})
	}

	async enableOtp(userId: string): Promise<void> {
		await this.prisma.user.update({
			where: { id: userId },
			data: { otpEnabled: true },
		})
	}

	async disableOtp(userId: string): Promise<void> {
		await this.prisma.user.update({
			where: { id: userId },
			data: { otpEnabled: false, otpSecret: null },
		})
	}
}
