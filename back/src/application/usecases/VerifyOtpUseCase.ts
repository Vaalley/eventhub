import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'
import { verify as otpVerify } from 'otplib'
import type { RecoveryCodeRepositoryInterface, UserRepositoryInterface } from '../../domain'
import { NotFoundError, UnauthorizedError } from '../../domain'

export interface VerifyOtpDTO {
	userId: string
	code: string
	isEnabling?: boolean
	isRecoveryCode?: boolean
}

export interface VerifyOtpResult {
	token: string
	recoveryCodes?: string[]
}

export class VerifyOtpUseCase {
	constructor(
		private readonly userRepository: UserRepositoryInterface,
		private readonly recoveryCodeRepository: RecoveryCodeRepositoryInterface,
		private readonly jwtSecret: string,
	) {}

	async execute(input: VerifyOtpDTO): Promise<VerifyOtpResult> {
		const user = await this.userRepository.findById(input.userId)
		if (!user || !user.id) {
			throw new NotFoundError('Utilisateur non trouvé')
		}

		if (input.isRecoveryCode) {
			await this.verifyRecoveryCode(user.id, input.code)
		} else {
			if (!user.otpSecret) {
				throw new UnauthorizedError("L'OTP n'est pas configuré")
			}
			const result = await otpVerify({
				token: input.code,
				secret: user.otpSecret,
			})
			if (!result.valid) throw new UnauthorizedError('Code OTP invalide')
		}

		let recoveryCodes: string[] | undefined
		if (input.isEnabling) {
			await this.userRepository.enableOtp(user.id)
			recoveryCodes = Array.from({ length: 8 }, () =>
				crypto.randomBytes(4).toString('hex').toUpperCase(),
			)
			const hashes = recoveryCodes.map((c) =>
				crypto.createHash('sha256').update(c).digest('hex'),
			)
			await this.recoveryCodeRepository.deleteByUserId(user.id)
			await this.recoveryCodeRepository.saveMany(user.id, hashes)
		}

		const token = jwt.sign({ userId: user.id }, this.jwtSecret, {
			expiresIn: '24h',
		})
		return { token, recoveryCodes }
	}

	private async verifyRecoveryCode(userId: string, code: string): Promise<void> {
		const hash = crypto.createHash('sha256').update(code).digest('hex')
		const codes = await this.recoveryCodeRepository.findByUserId(userId)
		const match = codes.find((c) => c.codeHash === hash && !c.used)
		if (!match?.id) {
			throw new UnauthorizedError('Code de récupération invalide')
		}
		await this.recoveryCodeRepository.markAsUsed(match.id)
	}
}
