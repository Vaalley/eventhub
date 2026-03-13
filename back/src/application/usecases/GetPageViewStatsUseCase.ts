import type {
	MongoPageViewRepository,
	PageViewStats,
} from '../../infrastructure/repositories/MongoPageViewRepository'

export class GetPageViewStatsUseCase {
	constructor(private readonly pageViewRepository: MongoPageViewRepository) {}

	async execute(days = 30): Promise<PageViewStats> {
		return this.pageViewRepository.getStats(days)
	}
}
