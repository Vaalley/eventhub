import { type EventRepository, NotFoundError } from '../../domain'

export class DeleteEventUseCase {
	constructor(private readonly eventRepository: EventRepository) {}

	async execute(id: string): Promise<void> {
		const event = await this.eventRepository.findById(id)

		if (!event) {
			throw new NotFoundError(`Événement avec l'id ${id} non trouvé`)
		}

		await this.eventRepository.delete(id)
	}
}
