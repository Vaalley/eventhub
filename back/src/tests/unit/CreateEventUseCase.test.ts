import { describe, it, expect, beforeEach } from 'bun:test'
import { CreateEventUseCase, type CreateEventDTO } from '../../application/usecases/CreateEventUseCase'
import { InMemoryEventRepository } from '../../infrastructure/repositories/InMemoryEventRepository'
import { ValidationError } from '../../domain'

describe('CreateEventUseCase', () => {
	let useCase: CreateEventUseCase
	let repository: InMemoryEventRepository

	const validEventDTO: CreateEventDTO = {
		title: 'Concert de Jazz',
		description: 'Un super concert',
		startDate: new Date(Date.now() + 86400000), // tomorrow
		venue: 'Salle Pleyel',
		capacity: 100,
		price: 50,
		organizerId: 'user-123',
		category: 'concert',
	}

	beforeEach(() => {
		repository = new InMemoryEventRepository()
		useCase = new CreateEventUseCase(repository)
	})

	it('devrait créer un événement avec des données valides et retourner un ID', async () => {
		const result = await useCase.execute(validEventDTO)

		expect(result.id).toBeDefined()
		expect(result.title).toBe(validEventDTO.title)
		expect(result.venue).toBe(validEventDTO.venue)
		expect(result.capacity).toBe(validEventDTO.capacity)
	})

	it('devrait échouer si le titre est vide', async () => {
		const dto = { ...validEventDTO, title: '' }

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
		expect(useCase.execute(dto)).rejects.toThrow('Le titre est obligatoire')
	})

	it('devrait échouer si le titre est manquant', async () => {
		const dto = { ...validEventDTO, title: '   ' }

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
	})

	it('devrait échouer si la date est dans le passé', async () => {
		const dto = { ...validEventDTO, startDate: new Date('2020-01-01') }

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
		expect(useCase.execute(dto)).rejects.toThrow('La date de début doit être dans le futur')
	})

	it('devrait échouer si le lieu est vide', async () => {
		const dto = { ...validEventDTO, venue: '' }

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
		expect(useCase.execute(dto)).rejects.toThrow('Le lieu est obligatoire')
	})

	it('devrait échouer si la capacité est négative', async () => {
		const dto = { ...validEventDTO, capacity: -1 }

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
		expect(useCase.execute(dto)).rejects.toThrow('La capacité doit être au moins 1')
	})

	it('devrait échouer si la capacité est zéro', async () => {
		const dto = { ...validEventDTO, capacity: 0 }

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
	})

	it('devrait échouer si la catégorie est inconnue', async () => {
		const dto = { ...validEventDTO, category: 'invalid-category' }

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
		expect(useCase.execute(dto)).rejects.toThrow('La catégorie doit être parmi')
	})

	it("devrait échouer si l'organisateur est manquant", async () => {
		const dto = { ...validEventDTO, organizerId: '' }

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
		expect(useCase.execute(dto)).rejects.toThrow("L'organisateur est obligatoire")
	})

	it('devrait échouer si le prix est négatif', async () => {
		const dto = { ...validEventDTO, price: -10 }

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
		expect(useCase.execute(dto)).rejects.toThrow('Le prix doit être positif')
	})

	it('devrait accepter un prix à zéro (gratuit)', async () => {
		const dto = { ...validEventDTO, price: 0 }

		const result = await useCase.execute(dto)
		expect(result.price).toBe(0)
	})

	it('devrait échouer si la date de fin est avant la date de début', async () => {
		const dto = {
			...validEventDTO,
			startDate: new Date(Date.now() + 86400000 * 2),
			endDate: new Date(Date.now() + 86400000),
		}

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
		expect(useCase.execute(dto)).rejects.toThrow('La date de fin doit être après la date de début')
	})

	it("devrait sauvegarder l'événement dans le repository", async () => {
		const result = await useCase.execute(validEventDTO)

		const saved = await repository.findById(result.id!)
		expect(saved).not.toBeNull()
		expect(saved?.title).toBe(validEventDTO.title)
	})
})
