import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import type { RecoveryCodeRepositoryInterface, UserRepositoryInterface } from '../../domain'
import { NotFoundError, UnauthorizedError } from '../../domain'

export class VerifyRecoveryCodeUseCase {
	constructor(
		private readonly userRepository: UserRepositoryInterface,
		private readonly recoveryCodeRepository: RecoveryCodeRepositoryInterface,
		private readonly jwtSecret: string,
	) {}

	async execute(userId: string, code: string): Promise<{ token: string }> {
		const user = await this.userRepository.findById(userId)
		if (!user || !user.id) {
			throw new NotFoundError('Utilisateur non trouvé')
		}

		const codeHash = crypto.createHash('sha256').update(code).digest('hex')

		const storedCodes = await this.recoveryCodeRepository.findByUserId(user.id)
		const matchingCode = storedCodes.find((c) => c.codeHash === codeHash && !c.used)

		if (!matchingCode || !matchingCode.id) {
			throw new UnauthorizedError('Code de récupération invalide')
		}

		await this.recoveryCodeRepository.markAsUsed(matchingCode.id)

		const token = jwt.sign({ userId: user.id }, this.jwtSecret, { expiresIn: '24h' })

		return { token }
	}
}
