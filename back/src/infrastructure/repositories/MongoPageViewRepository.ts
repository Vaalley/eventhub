import type { Collection, Db } from 'mongodb'

export interface PageView {
	path: string
	userId?: string
	userAgent?: string
	referrer?: string
	timestamp: Date
}

export interface PageViewStats {
	totalViews: number
	uniquePaths: number
	viewsByPath: { path: string; count: number }[]
	viewsByDay: { date: string; count: number }[]
}

export class MongoPageViewRepository {
	private collection: Collection<PageView>

	constructor(db: Db) {
		this.collection = db.collection<PageView>('pageviews')
	}

	async track(pageView: Omit<PageView, 'timestamp'>): Promise<void> {
		await this.collection.insertOne({
			...pageView,
			timestamp: new Date(),
		})
	}

	async getStats(days = 30): Promise<PageViewStats> {
		const since = new Date()
		since.setDate(since.getDate() - days)

		const [totalViews, viewsByPath, viewsByDay] = await Promise.all([
			this.collection.countDocuments({ timestamp: { $gte: since } }),
			this.collection
				.aggregate<{ _id: string; count: number }>([
					{ $match: { timestamp: { $gte: since } } },
					{ $group: { _id: '$path', count: { $sum: 1 } } },
					{ $sort: { count: -1 } },
					{ $limit: 10 },
				])
				.toArray(),
			this.collection
				.aggregate<{ _id: string; count: number }>([
					{ $match: { timestamp: { $gte: since } } },
					{
						$group: {
							_id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
							count: { $sum: 1 },
						},
					},
					{ $sort: { _id: 1 } },
				])
				.toArray(),
		])

		return {
			totalViews,
			uniquePaths: viewsByPath.length,
			viewsByPath: viewsByPath.map((v) => ({ path: v._id, count: v.count })),
			viewsByDay: viewsByDay.map((v) => ({ date: v._id, count: v.count })),
		}
	}
}
