import type { User } from '../entities/User'

export interface UserRepositoryInterface {
	save(user: User): Promise<User>
	findById(id: string): Promise<User | null>
	findByEmail(email: string): Promise<User | null>
	updateOtpSecret(userId: string, secret: string): Promise<void>
	enableOtp(userId: string): Promise<void>
	disableOtp(userId: string): Promise<void>
}
