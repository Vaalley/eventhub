import cors from 'cors'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import {
	AuthController,
	EventController,
	authMiddleware,
	createAuthRoutes,
	createEventRoutes,
	swaggerSpec,
} from './src/api'
import { errorHandler } from './src/api/middlewares/errorHandler'
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
} from './src/application'
import {
	PrismaEventRepository,
	PrismaRecoveryCodeRepository,
	PrismaUserRepository,
	connectDatabase,
	prisma,
} from './src/infrastructure'

const app = express()
const port = process.env.PORT || 3000
const jwtSecret = process.env.JWT_SECRET || 'eventhub-secret-change-me'
const appName = process.env.APP_NAME || 'EventHub'

app.use(cors())
app.use(express.json())

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Setup dependencies - Events
const eventRepository = new PrismaEventRepository(prisma)
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
const userRepository = new PrismaUserRepository(prisma)
const recoveryCodeRepository = new PrismaRecoveryCodeRepository(prisma)

const registerUseCase = new RegisterUseCase(userRepository)
const loginUseCase = new LoginUseCase(userRepository, jwtSecret)
const setupOtpUseCase = new SetupOtpUseCase(userRepository, appName)
const verifyOtpUseCase = new VerifyOtpUseCase(userRepository, recoveryCodeRepository, jwtSecret)
const disableOtpUseCase = new DisableOtpUseCase(userRepository, recoveryCodeRepository)

const authController = new AuthController(
	registerUseCase,
	loginUseCase,
	setupOtpUseCase,
	verifyOtpUseCase,
	disableOtpUseCase,
)

const auth = authMiddleware(jwtSecret)

// Routes
app.use('/api/auth', createAuthRoutes(authController, auth))
app.use('/api/events', createEventRoutes(eventController))

app.get('/', (_req, res) => {
	res.json({ message: 'EventHub API', docs: '/api-docs' })
})

// Error handling middleware
app.use(errorHandler)

// Start server
async function start() {
	try {
		await connectDatabase()
		app.listen(port, () => {
			console.log(`Server running on http://localhost:${port}`)
			console.log(`Swagger docs: http://localhost:${port}/api-docs`)
		})
	} catch (error) {
		console.error('Failed to start server:', error)
		process.exit(1)
	}
}

start()
