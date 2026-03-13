import type { NextFunction, Request, Response } from 'express'
import type {
	CreateEventUseCase,
	DeleteEventUseCase,
	GetEventUseCase,
	ListEventsUseCase,
	UpdateEventUseCase,
} from '../../application'

export class EventController {
	constructor(
		private readonly createEventUseCase: CreateEventUseCase,
		private readonly getEventUseCase: GetEventUseCase,
		private readonly listEventsUseCase: ListEventsUseCase,
		private readonly updateEventUseCase: UpdateEventUseCase,
		private readonly deleteEventUseCase: DeleteEventUseCase,
	) {}

	async create(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const organizerId = (req.headers['x-user-id'] as string) || 'anonymous'

			const event = await this.createEventUseCase.execute({
				...req.body,
				startDate: new Date(req.body.startDate),
				endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
				organizerId,
			})

			res.status(201).json(event)
		} catch (error) {
			next(error)
		}
	}

	async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = req.params.id as string
			const event = await this.getEventUseCase.execute(id)
			res.json(event)
		} catch (error) {
			next(error)
		}
	}

	async list(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const page = req.query.page ? Number.parseInt(req.query.page as string, 10) : undefined
			const limit = req.query.limit
				? Number.parseInt(req.query.limit as string, 10)
				: undefined

			if (page || limit) {
				const result = await this.listEventsUseCase.executePaginated({
					page,
					limit,
				})
				res.json(result)
			} else {
				const events = await this.listEventsUseCase.execute()
				res.json(events)
			}
		} catch (error) {
			next(error)
		}
	}

	async update(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = req.params.id as string
			const event = await this.updateEventUseCase.execute(id, {
				...req.body,
				startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
				endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
			})
			res.json(event)
		} catch (error) {
			next(error)
		}
	}

	async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
		try {
			const id = req.params.id as string
			await this.deleteEventUseCase.execute(id)
			res.status(204).send()
		} catch (error) {
			next(error)
		}
	}
}
