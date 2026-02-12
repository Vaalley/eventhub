import type { UserRepositoryInterface } from '../../domain'
import { User, ValidationError } from '../../domain'

export interface RegisterDTO {
	email: string
	name: string
	password: string
}

export class RegisterUseCase {
	constructor(private readonly userRepository: UserRepositoryInterface) {}

	async execute(input: RegisterDTO): Promise<User> {
		const existing = await this.userRepository.findByEmail(input.email)
		if (existing) {
			throw new ValidationError('Un utilisateur avec cet email existe déjà')
		}

		if (!input.password || input.password.length < 6) {
			throw new ValidationError('Le mot de passe doit contenir au moins 6 caractères')
		}

		const passwordHash = await Bun.password.hash(input.password, { algorithm: 'bcrypt' })

		const user = new User({
			email: input.email,
			name: input.name,
			passwordHash,
		})

		return this.userRepository.save(user)
	}
}
