import { beforeEach, describe, expect, it } from 'bun:test'
import { type LoginDTO, LoginUseCase } from '../../application/usecases/LoginUseCase'
import { UnauthorizedError } from '../../domain'
import { User } from '../../domain/entities/User'
import { InMemoryUserRepository } from '../../infrastructure/repositories/InMemoryUserRepository'

describe('LoginUseCase', () => {
	let useCase: LoginUseCase
	let repository: InMemoryUserRepository
	const jwtSecret = 'test-secret-key'

	const validLoginDTO: LoginDTO = {
		email: 'test@example.com',
		password: 'password123',
	}

	beforeEach(async () => {
		repository = new InMemoryUserRepository()
		useCase = new LoginUseCase(repository, jwtSecret)

		// Create a test user
		const passwordHash = await Bun.password.hash('password123', {
			algorithm: 'bcrypt',
		})
		const user = new User({
			id: 'user-123',
			email: 'test@example.com',
			name: 'Test User',
			passwordHash,
		})
		await repository.save(user)
	})

	it('devrait connecter un utilisateur avec des identifiants valides sans OTP', async () => {
		const result = await useCase.execute(validLoginDTO)

		expect(result.token).toBeDefined()
		expect(typeof result.token).toBe('string')
		expect(result.requireOtp).toBe(false)
		expect(result.user.id).toBe('user-123')
		expect(result.user.email).toBe('test@example.com')
		expect(result.user.name).toBe('Test User')
		expect(result.user.otpEnabled).toBe(false)
	})

	it('devrait retourner requireOtp=true si l utilisateur a OTP activé', async () => {
		// Update user to have OTP enabled
		const user = await repository.findByEmail('test@example.com')
		if (user?.id) {
			await repository.updateOtpSecret(user.id, 'test-secret')
			await repository.enableOtp(user.id)
		}

		const result = await useCase.execute(validLoginDTO)

		expect(result.token).toBeDefined()
		expect(result.requireOtp).toBe(true)
		expect(result.user.otpEnabled).toBe(true)
	})

	it('devrait échouer si l email n existe pas', async () => {
		const dto: LoginDTO = {
			email: 'nonexistent@example.com',
			password: 'password123',
		}

		expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedError)
		expect(useCase.execute(dto)).rejects.toThrow('Email ou mot de passe incorrect')
	})

	it('devrait échouer si le mot de passe est incorrect', async () => {
		const dto: LoginDTO = {
			email: 'test@example.com',
			password: 'wrongpassword',
		}

		expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedError)
		expect(useCase.execute(dto)).rejects.toThrow('Email ou mot de passe incorrect')
	})

	it('devrait échouer si l email est vide', async () => {
		const dto: LoginDTO = {
			email: '',
			password: 'password123',
		}

		expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedError)
	})

	it('devrait échouer si le mot de passe est vide', async () => {
		const dto: LoginDTO = {
			email: 'test@example.com',
			password: '',
		}

		expect(useCase.execute(dto)).rejects.toThrow(UnauthorizedError)
	})

	it('devrait générer un token JWT valide', async () => {
		const result = await useCase.execute(validLoginDTO)

		// Verify the token can be decoded
		const decoded = JSON.parse(atob(result.token.split('.')[1]))
		expect(decoded.userId).toBe('user-123')
		expect(decoded.otpPending).toBeUndefined()
	})

	it('devrait générer un token partiel avec otpPending=true pour OTP', async () => {
		// Update user to have OTP enabled
		const user = await repository.findByEmail('test@example.com')
		if (user?.id) {
			await repository.updateOtpSecret(user.id, 'test-secret')
			await repository.enableOtp(user.id)
		}

		const result = await useCase.execute(validLoginDTO)

		// Verify the token can be decoded
		const decoded = JSON.parse(atob(result.token.split('.')[1]))
		expect(decoded.userId).toBe('user-123')
		expect(decoded.otpPending).toBe(true)
	})
})
