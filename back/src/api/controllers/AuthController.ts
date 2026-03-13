import type { NextFunction, Request, Response } from 'express'
import type { DisableOtpUseCase } from '../../application/usecases/DisableOtpUseCase'
import type { LoginUseCase } from '../../application/usecases/LoginUseCase'
import type { RegisterUseCase } from '../../application/usecases/RegisterUseCase'
import type { SetupOtpUseCase } from '../../application/usecases/SetupOtpUseCase'
import type { VerifyOtpUseCase } from '../../application/usecases/VerifyOtpUseCase'

export class AuthController {
	constructor(
		private readonly registerUseCase: RegisterUseCase,
		private readonly loginUseCase: LoginUseCase,
		private readonly setupOtpUseCase: SetupOtpUseCase,
		private readonly verifyOtpUseCase: VerifyOtpUseCase,
		private readonly disableOtpUseCase: DisableOtpUseCase,
	) {}

	async register(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const user = await this.registerUseCase.execute(req.body)
			res.status(201).json({
				id: user.id,
				email: user.email,
				name: user.name,
			})
		} catch (error) {
			next(error)
		}
	}

	async login(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const result = await this.loginUseCase.execute(req.body)
			const maxAge = result.requireOtp ? 5 * 60 * 1000 : 24 * 60 * 60 * 1000
			res.cookie('token', result.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge,
			})
			res.json({
				requireOtp: result.requireOtp,
				user: result.user,
			})
		} catch (error) {
			next(error)
		}
	}

	async setupOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			res.json(await this.setupOtpUseCase.execute(req.user!.userId))
		} catch (error) {
			next(error)
		}
	}

	async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { code, isEnabling, isRecoveryCode } = req.body
			const result = await this.verifyOtpUseCase.execute({
				userId: req.user!.userId,
				code,
				isEnabling,
				isRecoveryCode,
			})
			res.cookie('token', result.token, {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'strict',
				maxAge: 24 * 60 * 60 * 1000,
			})
			res.json({ recoveryCodes: result.recoveryCodes })
		} catch (error) {
			next(error)
		}
	}

	async disableOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			await this.disableOtpUseCase.execute(req.user!.userId)
			res.json({ message: 'Double authentification désactivée' })
		} catch (error) {
			next(error)
		}
	}

	async logout(_req: Request, res: Response): Promise<void> {
		res.clearCookie('token', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
		})
		res.json({ message: 'Déconnexion réussie' })
	}
}
