import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import {
	AuthController,
	EventController,
	authMiddleware,
	createAuthRoutes,
	createEventRoutes,
} from '../../api'
import { errorHandler } from '../../api/middlewares/errorHandler'
import {
	CreateEventUseCase,
	DeleteEventUseCase,
	DisableOtpUseCase,
	GetEventUseCase,
	ListEventsUseCase,
	LoginUseCase,
	RegisterUseCase,
	SetupOtpUseCase,
	UpdateEventUseCase,
	VerifyOtpUseCase,
} from '../../application'
import {
	InMemoryEventRepository,
	InMemoryRecoveryCodeRepository,
	InMemoryUserRepository,
} from '../../infrastructure'

const TEST_JWT_SECRET = 'test-jwt-secret'
const TEST_APP_NAME = 'EventHub-Test'

export async function setupTestDatabase() {
	// In-memory repositories don't need database setup
}

export async function teardownTestDatabase() {
	// In-memory repositories don't need cleanup
}

export function createTestApp() {
	const app = express()

	app.use(
		cors({
			origin: true,
			credentials: true,
		}),
	)
	app.use(cookieParser())
	app.use(express.json())

	// Setup dependencies - Events
	const eventRepository = new InMemoryEventRepository()
	const createEventUseCase = new CreateEventUseCase(eventRepository)
	const getEventUseCase = new GetEventUseCase(eventRepository)
	const listEventsUseCase = new ListEventsUseCase(eventRepository)
	const updateEventUseCase = new UpdateEventUseCase(eventRepository)
	const deleteEventUseCase = new DeleteEventUseCase(eventRepository)

	const eventController = new EventController(
		createEventUseCase,
		getEventUseCase,
		listEventsUseCase,
		updateEventUseCase,
		deleteEventUseCase,
	)

	// Setup dependencies - Auth
	const userRepository = new InMemoryUserRepository()
	const recoveryCodeRepository = new InMemoryRecoveryCodeRepository()

	const registerUseCase = new RegisterUseCase(userRepository)
	const loginUseCase = new LoginUseCase(userRepository, TEST_JWT_SECRET)
	const setupOtpUseCase = new SetupOtpUseCase(userRepository, TEST_APP_NAME)
	const verifyOtpUseCase = new VerifyOtpUseCase(
		userRepository,
		recoveryCodeRepository,
		TEST_JWT_SECRET,
	)
	const disableOtpUseCase = new DisableOtpUseCase(userRepository, recoveryCodeRepository)

	const authController = new AuthController(
		registerUseCase,
		loginUseCase,
		setupOtpUseCase,
		verifyOtpUseCase,
		disableOtpUseCase,
	)

	const auth = authMiddleware(TEST_JWT_SECRET)

	// Routes
	app.use('/api/auth', createAuthRoutes(authController, auth))
	app.use('/api/events', createEventRoutes(eventController))

	app.get('/', (_req, res) => {
		res.json({ message: 'EventHub Test API' })
	})

	// Error handling middleware
	app.use(errorHandler)

	return app
}

export async function startTestServer(app: express.Application) {
	const server = app.listen(0) // Use random available port
	const address = server.address()
	const port = typeof address === 'object' && address ? address.port : 3001
	const baseUrl = `http://localhost:${port}`

	return { server, baseUrl, port }
}

export async function stopTestServer(server: { close: (callback: () => void) => void }) {
	return new Promise<void>((resolve) => {
		server.close(() => resolve())
	})
}
