import type { Event } from '../entities/Event'

export interface EventRepositoryInterface {
	save(event: Event): Promise<Event>
	findById(id: string): Promise<Event | null>
	findAll(): Promise<Event[]>
	update(id: string, data: Partial<Event>): Promise<Event | null>
	delete(id: string): Promise<void>
	findByOrganizerId(organizerId: string): Promise<Event[]>
	findByCategoryId(categoryId: string): Promise<Event[]>
}
