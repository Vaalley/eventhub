import type { EventRepository, ValidCategory } from '../../domain'
import { Event, NotFoundError } from '../../domain'

export interface UpdateEventInput {
	title?: string
	description?: string
	startDate?: Date
	endDate?: Date
	venue?: string
	capacity?: number
	price?: number
	category?: ValidCategory
	imageUrl?: string
}

export class UpdateEventUseCase {
	constructor(private readonly eventRepository: EventRepository) {}

	async execute(id: string, input: UpdateEventInput): Promise<Event> {
		const existingEvent = await this.eventRepository.findById(id)

		if (!existingEvent) {
			throw new NotFoundError(`Événement avec l'id ${id} non trouvé`)
		}

		// Create updated event with validation in constructor
		const updatedEvent = new Event({
			id: existingEvent.id,
			title: input.title ?? existingEvent.title,
			description: input.description ?? existingEvent.description,
			startDate: input.startDate ? new Date(input.startDate) : existingEvent.startDate,
			endDate: input.endDate ? new Date(input.endDate) : existingEvent.endDate,
			venue: input.venue ?? existingEvent.venue,
			capacity: input.capacity ?? existingEvent.capacity,
			price: input.price ?? existingEvent.price,
			category: input.category ?? existingEvent.category,
			imageUrl: input.imageUrl ?? existingEvent.imageUrl,
			organizerId: existingEvent.organizerId,
			createdAt: existingEvent.createdAt,
			updatedAt: new Date(),
		})

		const updated = await this.eventRepository.update(id, {
			title: updatedEvent.title,
			description: updatedEvent.description,
			startDate: updatedEvent.startDate,
			endDate: updatedEvent.endDate,
			venue: updatedEvent.venue,
			capacity: updatedEvent.capacity,
			price: updatedEvent.price,
			category: updatedEvent.category,
			imageUrl: updatedEvent.imageUrl,
		})

		if (!updated) {
			throw new NotFoundError(`Événement avec l'id ${id} non trouvé`)
		}

		return updated
	}
}
