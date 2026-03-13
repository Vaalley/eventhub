const API_BASE = '/api'

export interface PageViewStats {
	totalViews: number
	uniquePaths: number
	viewsByPath: { path: string; count: number }[]
	viewsByDay: { date: string; count: number }[]
}

export const analyticsApi = {
	async trackPageView(path: string, referrer?: string): Promise<void> {
		await fetch(`${API_BASE}/analytics/track`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ path, referrer }),
		})
	},

	async getStats(days = 30): Promise<PageViewStats> {
		const res = await fetch(`${API_BASE}/analytics/stats?days=${days}`, {
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
		})
		if (!res.ok) {
			throw new Error('Failed to fetch stats')
		}
		return res.json()
	},
}
