import {
	Event,
	type EventRepository,
	type PaginatedResult,
	type PaginationParams,
} from '../../domain'

export class InMemoryEventRepository implements EventRepository {
	private events: Map<string, Event> = new Map()

	async save(event: Event): Promise<Event> {
		const id = event.id || crypto.randomUUID()

		const savedEvent = new Event({
			id,
			title: event.title,
			description: event.description,
			startDate: event.startDate,
			endDate: event.endDate,
			venue: event.venue,
			capacity: event.capacity,
			price: event.price,
			organizerId: event.organizerId,
			category: event.category,
			imageUrl: event.imageUrl,
			createdAt: event.createdAt,
			updatedAt: event.updatedAt,
		})

		this.events.set(id, savedEvent)
		return savedEvent
	}

	async findById(id: string): Promise<Event | null> {
		return this.events.get(id) || null
	}

	async findAll(): Promise<Event[]> {
		return Array.from(this.events.values())
	}

	async findAllPaginated(params: PaginationParams): Promise<PaginatedResult<Event>> {
		const page = params.page ?? 1
		const limit = params.limit ?? 10
		const all = Array.from(this.events.values())
		const start = (page - 1) * limit
		const data = all.slice(start, start + limit)

		return {
			data,
			total: all.length,
			page,
			limit,
			totalPages: Math.ceil(all.length / limit),
		}
	}

	async update(id: string, data: Partial<Event>): Promise<Event | null> {
		const existing = this.events.get(id)
		if (!existing) return null

		const updated = new Event({
			id: existing.id,
			title: data.title ?? existing.title,
			description: data.description ?? existing.description,
			startDate: data.startDate ?? existing.startDate,
			endDate: data.endDate ?? existing.endDate,
			venue: data.venue ?? existing.venue,
			capacity: data.capacity ?? existing.capacity,
			price: data.price ?? existing.price,
			organizerId: existing.organizerId,
			category: data.category ?? existing.category,
			imageUrl: data.imageUrl ?? existing.imageUrl,
			createdAt: existing.createdAt,
			updatedAt: new Date(),
		})

		this.events.set(id, updated)
		return updated
	}

	async delete(id: string): Promise<void> {
		this.events.delete(id)
	}

	async findByOrganizerId(organizerId: string): Promise<Event[]> {
		return Array.from(this.events.values()).filter((e) => e.organizerId === organizerId)
	}

	async findByCategoryId(categoryId: string): Promise<Event[]> {
		return Array.from(this.events.values()).filter((e) => e.category === categoryId)
	}

	clear(): void {
		this.events.clear()
	}
}
