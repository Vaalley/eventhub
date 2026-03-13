const API_BASE = '/api'

export interface Event {
	id: string
	title: string
	description?: string
	startDate: string
	endDate?: string
	venue: string
	capacity: number
	price?: number
	organizerId: string
	category: string
	imageUrl?: string
	createdAt: string
	updatedAt: string
}

export interface PaginatedEvents {
	data: Event[]
	total: number
	page: number
	limit: number
	totalPages: number
}

export const eventsApi = {
	async list(): Promise<Event[]> {
		const res = await fetch(`${API_BASE}/events`, {
			credentials: 'include',
		})
		if (!res.ok) throw new Error('Failed to fetch events')
		return res.json()
	},

	async listPaginated(page = 1, limit = 10): Promise<PaginatedEvents> {
		const res = await fetch(`${API_BASE}/events?page=${page}&limit=${limit}`, {
			credentials: 'include',
		})
		if (!res.ok) throw new Error('Failed to fetch events')
		return res.json()
	},

	async getById(id: string): Promise<Event> {
		const res = await fetch(`${API_BASE}/events/${id}`, {
			credentials: 'include',
		})
		if (!res.ok) throw new Error('Event not found')
		return res.json()
	},
}
