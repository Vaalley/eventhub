import jwt from 'jsonwebtoken'
import type { UserRepositoryInterface } from '../../domain'
import { UnauthorizedError } from '../../domain'

export interface LoginDTO {
	email: string
	password: string
}

export interface LoginResult {
	token: string
	requireOtp: boolean
	user: { id: string; email: string; name: string; otpEnabled: boolean }
}

export class LoginUseCase {
	constructor(
		private readonly userRepository: UserRepositoryInterface,
		private readonly jwtSecret: string,
	) {}

	async execute(input: LoginDTO): Promise<LoginResult> {
		const user = await this.userRepository.findByEmail(input.email)
		if (!user || !user.id) {
			throw new UnauthorizedError('Email ou mot de passe incorrect')
		}

		const valid = await Bun.password.verify(input.password, user.passwordHash)
		if (!valid) {
			throw new UnauthorizedError('Email ou mot de passe incorrect')
		}

		if (user.otpEnabled) {
			const partialToken = jwt.sign({ userId: user.id, otpPending: true }, this.jwtSecret, {
				expiresIn: '5m',
			})

			return {
				token: partialToken,
				requireOtp: true,
				user: { id: user.id, email: user.email, name: user.name, otpEnabled: true },
			}
		}

		const token = jwt.sign({ userId: user.id }, this.jwtSecret, { expiresIn: '24h' })

		return {
			token,
			requireOtp: false,
			user: { id: user.id, email: user.email, name: user.name, otpEnabled: false },
		}
	}
}
