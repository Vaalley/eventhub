import type { MongoPageViewRepository } from '../../infrastructure/repositories/MongoPageViewRepository'

export interface TrackPageViewDTO {
	path: string
	userId?: string
	userAgent?: string
	referrer?: string
}

export class TrackPageViewUseCase {
	constructor(private readonly pageViewRepository: MongoPageViewRepository) {}

	async execute(dto: TrackPageViewDTO): Promise<void> {
		await this.pageViewRepository.track(dto)
	}
}
