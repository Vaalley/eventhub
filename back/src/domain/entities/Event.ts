import { ValidationError } from '../errors/DomainError'

export interface EventProps {
	id?: string
	title: string
	description?: string
	startDate: Date
	endDate?: Date
	venue: string
	capacity: number
	price?: number
	organizerId: string
	category: ValidCategory
	imageUrl?: string
	createdAt?: Date
	updatedAt?: Date
}

export const VALID_CATEGORIES = [
	'concert',
	'conference',
	'workshop',
	'meetup',
	'sport',
	'other',
] as const

export type ValidCategory = (typeof VALID_CATEGORIES)[number]

export class Event {
	private props: EventProps

	constructor(props: EventProps) {
		this.validate(props)
		this.props = {
			...props,
			createdAt: props.createdAt || new Date(),
			updatedAt: props.updatedAt || new Date(),
		}
	}

	private validate(props: EventProps): void {
		if (!props.title || props.title.trim() === '') {
			throw new ValidationError('Le titre est obligatoire')
		}

		if (!props.startDate) {
			throw new ValidationError('La date de début est obligatoire')
		}

		if (new Date(props.startDate) <= new Date()) {
			throw new ValidationError('La date de début doit être dans le futur')
		}

		if (!props.venue || props.venue.trim() === '') {
			throw new ValidationError('Le lieu est obligatoire')
		}

		if (props.capacity === undefined || props.capacity < 1) {
			throw new ValidationError('La capacité doit être au moins 1')
		}

		if (!VALID_CATEGORIES.includes(props.category)) {
			throw new ValidationError(
				`La catégorie doit être parmi: ${VALID_CATEGORIES.join(', ')}`,
			)
		}

		if (!props.organizerId || props.organizerId.trim() === '') {
			throw new ValidationError("L'organisateur est obligatoire")
		}

		if (props.price !== undefined && props.price < 0) {
			throw new ValidationError('Le prix doit être positif')
		}

		if (props.endDate && new Date(props.endDate) <= new Date(props.startDate)) {
			throw new ValidationError('La date de fin doit être après la date de début')
		}
	}

	get id(): string | undefined {
		return this.props.id
	}
	get title(): string {
		return this.props.title
	}
	get description(): string | undefined {
		return this.props.description
	}
	get startDate(): Date {
		return this.props.startDate
	}
	get endDate(): Date | undefined {
		return this.props.endDate
	}
	get venue(): string {
		return this.props.venue
	}
	get capacity(): number {
		return this.props.capacity
	}
	get price(): number | undefined {
		return this.props.price
	}
	get organizerId(): string {
		return this.props.organizerId
	}
	get category(): ValidCategory {
		return this.props.category
	}
	get imageUrl(): string | undefined {
		return this.props.imageUrl
	}
	get createdAt(): Date | undefined {
		return this.props.createdAt
	}
	get updatedAt(): Date | undefined {
		return this.props.updatedAt
	}
}
