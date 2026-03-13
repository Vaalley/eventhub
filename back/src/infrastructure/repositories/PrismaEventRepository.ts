import type { PrismaClient } from '@prisma/client'
import {
	Event,
	type EventRepository,
	type PaginatedResult,
	type PaginationParams,
	type ValidCategory,
} from '../../domain'

export class PrismaEventRepository implements EventRepository {
	constructor(private readonly prisma: PrismaClient) {}

	async save(event: Event): Promise<Event> {
		const created = await this.prisma.event.create({
			data: {
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
			},
		})

		return new Event({
			id: created.id,
			title: created.title,
			description: created.description ?? undefined,
			startDate: created.startDate,
			endDate: created.endDate ?? undefined,
			venue: created.venue,
			capacity: created.capacity,
			price: created.price ?? undefined,
			organizerId: created.organizerId,
			category: created.category as ValidCategory,
			imageUrl: created.imageUrl ?? undefined,
			createdAt: created.createdAt,
			updatedAt: created.updatedAt,
		})
	}

	async findById(id: string): Promise<Event | null> {
		const event = await this.prisma.event.findUnique({
			where: { id },
		})

		if (!event) return null

		return new Event({
			id: event.id,
			title: event.title,
			description: event.description ?? undefined,
			startDate: event.startDate,
			endDate: event.endDate ?? undefined,
			venue: event.venue,
			capacity: event.capacity,
			price: event.price ?? undefined,
			organizerId: event.organizerId,
			category: event.category as ValidCategory,
			imageUrl: event.imageUrl ?? undefined,
			createdAt: event.createdAt,
			updatedAt: event.updatedAt,
			skipDateValidation: true,
		})
	}

	async findAll(): Promise<Event[]> {
		const events = await this.prisma.event.findMany({
			orderBy: { startDate: 'asc' },
		})

		return events.map(
			(e) =>
				new Event({
					id: e.id,
					title: e.title,
					description: e.description ?? undefined,
					startDate: e.startDate,
					endDate: e.endDate ?? undefined,
					venue: e.venue,
					capacity: e.capacity,
					price: e.price ?? undefined,
					organizerId: e.organizerId,
					category: e.category as ValidCategory,
					imageUrl: e.imageUrl ?? undefined,
					createdAt: e.createdAt,
					updatedAt: e.updatedAt,
					skipDateValidation: true,
				}),
		)
	}

	async findAllPaginated(params: PaginationParams): Promise<PaginatedResult<Event>> {
		const page = params.page ?? 1
		const limit = params.limit ?? 10
		const skip = (page - 1) * limit

		const [events, total] = await Promise.all([
			this.prisma.event.findMany({
				orderBy: { startDate: 'asc' },
				skip,
				take: limit,
			}),
			this.prisma.event.count(),
		])

		return {
			data: events.map(
				(e) =>
					new Event({
						id: e.id,
						title: e.title,
						description: e.description ?? undefined,
						startDate: e.startDate,
						endDate: e.endDate ?? undefined,
						venue: e.venue,
						capacity: e.capacity,
						price: e.price ?? undefined,
						organizerId: e.organizerId,
						category: e.category as ValidCategory,
						imageUrl: e.imageUrl ?? undefined,
						createdAt: e.createdAt,
						updatedAt: e.updatedAt,
						skipDateValidation: true,
					}),
			),
			total,
			page,
			limit,
			totalPages: Math.ceil(total / limit),
		}
	}

	async update(id: string, data: Partial<Event>): Promise<Event | null> {
		try {
			const updated = await this.prisma.event.update({
				where: { id },
				data: {
					title: data.title,
					description: data.description,
					startDate: data.startDate,
					endDate: data.endDate,
					venue: data.venue,
					capacity: data.capacity,
					price: data.price,
					category: data.category,
					imageUrl: data.imageUrl,
				},
			})

			return new Event({
				id: updated.id,
				title: updated.title,
				description: updated.description ?? undefined,
				startDate: updated.startDate,
				endDate: updated.endDate ?? undefined,
				venue: updated.venue,
				capacity: updated.capacity,
				price: updated.price ?? undefined,
				organizerId: updated.organizerId,
				category: updated.category as ValidCategory,
				imageUrl: updated.imageUrl ?? undefined,
				createdAt: updated.createdAt,
				updatedAt: updated.updatedAt,
				skipDateValidation: true,
			})
		} catch {
			return null
		}
	}

	async delete(id: string): Promise<void> {
		await this.prisma.event.delete({
			where: { id },
		})
	}

	async findByOrganizerId(organizerId: string): Promise<Event[]> {
		const events = await this.prisma.event.findMany({
			where: { organizerId },
			orderBy: { startDate: 'asc' },
		})

		return events.map(
			(e) =>
				new Event({
					id: e.id,
					title: e.title,
					description: e.description ?? undefined,
					startDate: e.startDate,
					endDate: e.endDate ?? undefined,
					venue: e.venue,
					capacity: e.capacity,
					price: e.price ?? undefined,
					organizerId: e.organizerId,
					category: e.category as ValidCategory,
					imageUrl: e.imageUrl ?? undefined,
					createdAt: e.createdAt,
					updatedAt: e.updatedAt,
					skipDateValidation: true,
				}),
		)
	}

	async findByCategoryId(categoryId: string): Promise<Event[]> {
		const events = await this.prisma.event.findMany({
			where: { category: categoryId },
			orderBy: { startDate: 'asc' },
		})

		return events.map(
			(e) =>
				new Event({
					id: e.id,
					title: e.title,
					description: e.description ?? undefined,
					startDate: e.startDate,
					endDate: e.endDate ?? undefined,
					venue: e.venue,
					capacity: e.capacity,
					price: e.price ?? undefined,
					organizerId: e.organizerId,
					category: e.category as ValidCategory,
					imageUrl: e.imageUrl ?? undefined,
					createdAt: e.createdAt,
					updatedAt: e.updatedAt,
					skipDateValidation: true,
				}),
		)
	}
}
