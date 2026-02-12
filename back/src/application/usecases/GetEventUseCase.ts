import { type Event, type EventRepository, NotFoundError } from '../../domain'

export class GetEventUseCase {
	constructor(private readonly eventRepository: EventRepository) {}

	async execute(id: string): Promise<Event> {
		const event = await this.eventRepository.findById(id)

		if (!event) {
			throw new NotFoundError(`Événement avec l'id ${id} non trouvé`)
		}

		return event
	}
}
