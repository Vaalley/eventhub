import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import {
	createTestApp,
	setupTestDatabase,
	startTestServer,
	stopTestServer,
	teardownTestDatabase,
} from './test-setup'

describe('Auth Integration Tests', () => {
	let baseUrl: string
	let server: { close: (callback: () => void) => void }

	beforeAll(async () => {
		await setupTestDatabase()
		const app = createTestApp()
		const result = await startTestServer(app)
		baseUrl = result.baseUrl
		server = result.server
	})

	afterAll(async () => {
		await stopTestServer(server)
		await teardownTestDatabase()
	})

	describe('POST /api/auth/register', () => {
		it('should register a new user', async () => {
			const response = await fetch(`${baseUrl}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: 'test@example.com',
					name: 'Test User',
					password: 'password123',
				}),
			})

			expect(response.status).toBe(201)
			const data = await response.json()
			expect(data.id).toBeDefined()
			expect(data.email).toBe('test@example.com')
			expect(data.name).toBe('Test User')
			expect(data.passwordHash).toBeUndefined()
		})

		it('should fail with duplicate email', async () => {
			const userData = {
				email: 'duplicate@example.com',
				name: 'Duplicate User',
				password: 'password123',
			}

			// First registration should succeed
			const firstResponse = await fetch(`${baseUrl}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userData),
			})
			expect(firstResponse.status).toBe(201)

			// Second registration should fail
			const secondResponse = await fetch(`${baseUrl}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userData),
			})
			expect(secondResponse.status).toBe(400)
			const data = await secondResponse.json()
			expect(data.error).toContain('existe déjà')
		})

		it('should fail with invalid email format', async () => {
			const response = await fetch(`${baseUrl}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: 'invalid-email',
					name: 'Test User',
					password: 'password123',
				}),
			})

			expect(response.status).toBe(400)
		})

		it('should fail with short password', async () => {
			const response = await fetch(`${baseUrl}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: 'test2@example.com',
					name: 'Test User',
					password: '12345',
				}),
			})

			expect(response.status).toBe(400)
		})

		it('should fail with missing fields', async () => {
			const response = await fetch(`${baseUrl}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: 'test3@example.com',
					// missing name and password
				}),
			})

			expect(response.status).toBe(400)
		})
	})

	describe('POST /api/auth/login', () => {
		const testUser = {
			email: 'login@example.com',
			name: 'Login User',
			password: 'password123',
		}

		beforeAll(async () => {
			// Register a user for login tests
			await fetch(`${baseUrl}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(testUser),
			})
		})

		it('should login with valid credentials', async () => {
			const response = await fetch(`${baseUrl}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: testUser.email,
					password: testUser.password,
				}),
			})

			expect(response.status).toBe(200)
			const data = await response.json()
			expect(data.requireOtp).toBe(false)
			expect(data.user).toBeDefined()
			expect(data.user.email).toBe(testUser.email)
			expect(data.user.name).toBe(testUser.name)
			expect(data.user.otpEnabled).toBe(false)

			// Check for token cookie
			const cookies = response.headers.get('set-cookie')
			expect(cookies).toContain('token=')
		})

		it('should fail with wrong password', async () => {
			const response = await fetch(`${baseUrl}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: testUser.email,
					password: 'wrongpassword',
				}),
			})

			expect(response.status).toBe(401)
		})

		it('should fail with non-existent email', async () => {
			const response = await fetch(`${baseUrl}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: 'nonexistent@example.com',
					password: 'password123',
				}),
			})

			expect(response.status).toBe(401)
		})

		it('should fail with missing fields', async () => {
			const response = await fetch(`${baseUrl}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: testUser.email,
					// missing password
				}),
			})

			expect(response.status).toBe(401)
		})
	})

	describe('POST /api/auth/logout', () => {
		it('should logout successfully', async () => {
			const response = await fetch(`${baseUrl}/api/auth/logout`, {
				method: 'POST',
			})

			expect(response.status).toBe(200)
			const data = await response.json()
			expect(data.message).toContain('Déconnexion réussie')

			// Check for token cookie being cleared
			const cookies = response.headers.get('set-cookie')
			expect(cookies).toContain('token=')
		})
	})

	describe('Full Auth Flow', () => {
		it('should complete register -> login -> logout flow', async () => {
			// Register
			const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: 'flow@example.com',
					name: 'Flow User',
					password: 'password123',
				}),
			})
			expect(registerResponse.status).toBe(201)

			// Login
			const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: 'flow@example.com',
					password: 'password123',
				}),
			})
			expect(loginResponse.status).toBe(200)
			const loginData = await loginResponse.json()
			expect(loginData.user.email).toBe('flow@example.com')

			// Get token from cookies
			const cookies = loginResponse.headers.get('set-cookie') || ''
			const tokenMatch = cookies.match(/token=([^;]+)/)
			const token = tokenMatch ? tokenMatch[1] : null
			expect(token).toBeTruthy()

			// Logout
			const logoutResponse = await fetch(`${baseUrl}/api/auth/logout`, {
				method: 'POST',
				headers: { Cookie: `token=${token}` },
			})
			expect(logoutResponse.status).toBe(200)
		})
	})
})
