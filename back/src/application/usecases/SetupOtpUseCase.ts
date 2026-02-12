import { generateSecret, generateURI } from 'otplib'
import qrcode from 'qrcode'
import type { UserRepositoryInterface } from '../../domain'
import { NotFoundError } from '../../domain'

export interface SetupOtpResult {
	qrCodeDataUrl: string
	secret: string
}

export class SetupOtpUseCase {
	constructor(
		private readonly userRepository: UserRepositoryInterface,
		private readonly appName: string,
	) {}

	async execute(userId: string): Promise<SetupOtpResult> {
		const user = await this.userRepository.findById(userId)
		if (!user || !user.id) {
			throw new NotFoundError('Utilisateur non trouvé')
		}

		const secret = generateSecret()

		await this.userRepository.updateOtpSecret(user.id, secret)

		const otpAuthUrl = generateURI({
			secret,
			issuer: this.appName,
			label: user.email,
		})
		const qrCodeDataUrl = await qrcode.toDataURL(otpAuthUrl)

		return { qrCodeDataUrl, secret }
	}
}
