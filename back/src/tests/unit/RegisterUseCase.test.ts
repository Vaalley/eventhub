import { beforeEach, describe, expect, it } from 'bun:test'
import { type RegisterDTO, RegisterUseCase } from '../../application/usecases/RegisterUseCase'
import { ValidationError } from '../../domain'
import { InMemoryUserRepository } from '../../infrastructure/repositories/InMemoryUserRepository'

describe('RegisterUseCase', () => {
	let useCase: RegisterUseCase
	let repository: InMemoryUserRepository

	const validRegisterDTO: RegisterDTO = {
		email: 'test@example.com',
		name: 'Test User',
		password: 'password123',
	}

	beforeEach(() => {
		repository = new InMemoryUserRepository()
		useCase = new RegisterUseCase(repository)
	})

	it('devrait créer un utilisateur avec des données valides', async () => {
		const result = await useCase.execute(validRegisterDTO)

		expect(result.id).toBeDefined()
		expect(result.email).toBe(validRegisterDTO.email)
		expect(result.name).toBe(validRegisterDTO.name)
		expect(result.passwordHash).toBeDefined()
		expect(result.otpEnabled).toBe(false)
	})

	it('devrait échouer si l email existe déjà', async () => {
		// Create a user first
		await useCase.execute(validRegisterDTO)

		// Try to create another user with the same email
		expect(useCase.execute(validRegisterDTO)).rejects.toThrow(ValidationError)
		expect(useCase.execute(validRegisterDTO)).rejects.toThrow(
			'Un utilisateur avec cet email existe déjà',
		)
	})

	it('devrait échouer si le mot de passe est trop court', async () => {
		const dto: RegisterDTO = {
			email: 'test2@example.com',
			name: 'Test User 2',
			password: '12345',
		}

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
		expect(useCase.execute(dto)).rejects.toThrow(
			'Le mot de passe doit contenir au moins 6 caractères',
		)
	})

	it('devrait échouer si le mot de passe est vide', async () => {
		const dto: RegisterDTO = {
			email: 'test2@example.com',
			name: 'Test User 2',
			password: '',
		}

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
		expect(useCase.execute(dto)).rejects.toThrow(
			'Le mot de passe doit contenir au moins 6 caractères',
		)
	})

	it('devrait échouer si le mot de passe est manquant', async () => {
		const dto = {
			email: 'test2@example.com',
			name: 'Test User 2',
		} as RegisterDTO

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
	})

	it('devrait hacher le mot de passe', async () => {
		const result = await useCase.execute(validRegisterDTO)

		expect(result.passwordHash).not.toBe(validRegisterDTO.password)
		expect(result.passwordHash.length).toBeGreaterThan(0)
	})

	it('devrait sauvegarder l utilisateur dans le repository', async () => {
		const result = await useCase.execute(validRegisterDTO)

		if (result.id) {
			const saved = await repository.findById(result.id)
			expect(saved).not.toBeNull()
			expect(saved?.email).toBe(validRegisterDTO.email)
		}
	})

	it('devrait échouer si l email est invalide (format)', async () => {
		const dto: RegisterDTO = {
			email: 'invalid-email',
			name: 'Test User',
			password: 'password123',
		}

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
		expect(useCase.execute(dto)).rejects.toThrow("L'email n'est pas valide")
	})

	it('devrait échouer si l email est vide', async () => {
		const dto: RegisterDTO = {
			email: '',
			name: 'Test User',
			password: 'password123',
		}

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
		expect(useCase.execute(dto)).rejects.toThrow("L'email est obligatoire")
	})

	it('devrait échouer si le nom est vide', async () => {
		const dto: RegisterDTO = {
			email: 'test@example.com',
			name: '',
			password: 'password123',
		}

		expect(useCase.execute(dto)).rejects.toThrow(ValidationError)
		expect(useCase.execute(dto)).rejects.toThrow('Le nom est obligatoire')
	})
})
