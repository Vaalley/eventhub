import type { Event, EventRepository } from '../../domain'

export class ListEventsUseCase {
	constructor(private readonly eventRepository: EventRepository) {}

	async execute(): Promise<Event[]> {
		return this.eventRepository.findAll()
	}
}
