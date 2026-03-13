import type { NextFunction, Request, Response } from 'express'
import type { GetPageViewStatsUseCase } from '../../application/usecases/GetPageViewStatsUseCase'
import type { TrackPageViewUseCase } from '../../application/usecases/TrackPageViewUseCase'

export class AnalyticsController {
	constructor(
		private readonly trackPageViewUseCase: TrackPageViewUseCase,
		private readonly getPageViewStatsUseCase: GetPageViewStatsUseCase,
	) {}

	async track(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const { path, referrer } = req.body
			const userId = req.user?.userId
			const userAgent = req.headers['user-agent']

			await this.trackPageViewUseCase.execute({
				path,
				userId,
				userAgent,
				referrer,
			})

			res.status(204).send()
		} catch (error) {
			next(error)
		}
	}

	async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const days = req.query.days ? Number.parseInt(req.query.days as string, 10) : 30
			const stats = await this.getPageViewStatsUseCase.execute(days)
			res.json(stats)
		} catch (error) {
			next(error)
		}
	}
}
