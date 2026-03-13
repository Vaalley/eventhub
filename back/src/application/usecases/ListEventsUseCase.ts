import type { Event, EventRepository, PaginatedResult, PaginationParams } from '../../domain'

export class ListEventsUseCase {
	constructor(private readonly eventRepository: EventRepository) {}

	async execute(): Promise<Event[]> {
		return this.eventRepository.findAll()
	}

	async executePaginated(params: PaginationParams): Promise<PaginatedResult<Event>> {
		return this.eventRepository.findAllPaginated(params)
	}
}
