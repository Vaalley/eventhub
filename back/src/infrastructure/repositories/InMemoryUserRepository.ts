import type { UserRepositoryInterface } from '../../domain'
import { User } from '../../domain/entities/User'

export class InMemoryUserRepository implements UserRepositoryInterface {
	private users: Map<string, User> = new Map()

	async save(user: User): Promise<User> {
		const id = user.id || crypto.randomUUID()

		const savedUser = new User({
			id,
			email: user.email,
			name: user.name,
			passwordHash: user.passwordHash,
			otpSecret: user.otpSecret,
			otpEnabled: user.otpEnabled,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		})

		this.users.set(id, savedUser)
		return savedUser
	}

	async findById(id: string): Promise<User | null> {
		return this.users.get(id) || null
	}

	async findByEmail(email: string): Promise<User | null> {
		for (const user of this.users.values()) {
			if (user.email === email) {
				return user
			}
		}
		return null
	}

	async updateOtpSecret(userId: string, secret: string): Promise<void> {
		const user = this.users.get(userId)
		if (!user) return

		const updatedUser = new User({
			id: user.id,
			email: user.email,
			name: user.name,
			passwordHash: user.passwordHash,
			otpSecret: secret,
			otpEnabled: user.otpEnabled,
			createdAt: user.createdAt,
			updatedAt: new Date(),
		})

		this.users.set(userId, updatedUser)
	}

	async enableOtp(userId: string): Promise<void> {
		const user = this.users.get(userId)
		if (!user) return

		const updatedUser = new User({
			id: user.id,
			email: user.email,
			name: user.name,
			passwordHash: user.passwordHash,
			otpSecret: user.otpSecret,
			otpEnabled: true,
			createdAt: user.createdAt,
			updatedAt: new Date(),
		})

		this.users.set(userId, updatedUser)
	}

	async disableOtp(userId: string): Promise<void> {
		const user = this.users.get(userId)
		if (!user) return

		const updatedUser = new User({
			id: user.id,
			email: user.email,
			name: user.name,
			passwordHash: user.passwordHash,
			otpSecret: null,
			otpEnabled: false,
			createdAt: user.createdAt,
			updatedAt: new Date(),
		})

		this.users.set(userId, updatedUser)
	}

	clear(): void {
		this.users.clear()
	}
}
