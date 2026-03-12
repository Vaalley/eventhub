import type { RecoveryCodeRepositoryInterface, UserRepositoryInterface } from '../../domain'
import { NotFoundError } from '../../domain'

export class DisableOtpUseCase {
	constructor(
		private readonly userRepository: UserRepositoryInterface,
		private readonly recoveryCodeRepository: RecoveryCodeRepositoryInterface,
	) {}

	async execute(userId: string): Promise<void> {
		const user = await this.userRepository.findById(userId)
		if (!user || !user.id) {
			throw new NotFoundError('Utilisateur non trouvé')
		}

		await this.userRepository.disableOtp(user.id)
		await this.recoveryCodeRepository.deleteByUserId(user.id)
	}
}
