import { Event, type EventRepository } from '../../domain'

export interface CreateEventDTO {
	title: string
	description?: string
	startDate: Date
	endDate?: Date
	venue: string
	capacity: number
	price?: number
	organizerId: string
	category: string
	imageUrl?: string
}

export class CreateEventUseCase {
	constructor(private readonly eventRepository: EventRepository) {}

	async execute(dto: CreateEventDTO): Promise<Event> {
		const event = new Event({
			title: dto.title,
			description: dto.description,
			startDate: new Date(dto.startDate),
			endDate: dto.endDate ? new Date(dto.endDate) : undefined,
			venue: dto.venue,
			capacity: dto.capacity,
			price: dto.price,
			organizerId: dto.organizerId,
			category: dto.category,
			imageUrl: dto.imageUrl,
		})

		return this.eventRepository.save(event)
	}
}
