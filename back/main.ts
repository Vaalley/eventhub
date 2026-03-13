import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import {
	AnalyticsController,
	AuthController,
	EventController,
	authMiddleware,
	createAnalyticsRoutes,
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
	GetPageViewStatsUseCase,
	ListEventsUseCase,
	LoginUseCase,
	RegisterUseCase,
	SetupOtpUseCase,
	TrackPageViewUseCase,
	UpdateEventUseCase,
	VerifyOtpUseCase,
} from './src/application'
import {
	MongoPageViewRepository,
	PrismaEventRepository,
	PrismaRecoveryCodeRepository,
	PrismaUserRepository,
	connectDatabase,
	connectMongoDB,
	prisma,
} from './src/infrastructure'

const app = express()
const port = process.env.PORT || 3000
const jwtSecret = process.env.JWT_SECRET || 'eventhub-secret-change-me'
const appName = process.env.APP_NAME || 'EventHub'

app.use(
	cors({
		origin: true,
		credentials: true,
	}),
)
app.use(cookieParser())
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

// Analytics routes will be set up after MongoDB connects
let analyticsController: AnalyticsController | null = null

app.get('/', (_req, res) => {
	res.json({ message: 'EventHub API', docs: '/api-docs' })
})

// Error handling middleware
app.use(errorHandler)

// Start server
async function start() {
	try {
		await connectDatabase()

		// Connect MongoDB and setup analytics
		const mongoDB = await connectMongoDB()
		const pageViewRepository = new MongoPageViewRepository(mongoDB)
		const trackPageViewUseCase = new TrackPageViewUseCase(pageViewRepository)
		const getPageViewStatsUseCase = new GetPageViewStatsUseCase(pageViewRepository)
		analyticsController = new AnalyticsController(trackPageViewUseCase, getPageViewStatsUseCase)
		app.use('/api/analytics', createAnalyticsRoutes(analyticsController, auth))

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
