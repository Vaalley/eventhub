import cors from 'cors'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { EventController, createEventRoutes, swaggerSpec } from './src/api'
import { errorHandler } from './src/api/middlewares/errorHandler'
import {
	CreateEventUseCase,
	DeleteEventUseCase,
	GetEventUseCase,
	ListEventsUseCase,
	UpdateEventUseCase,
} from './src/application'
import { PrismaEventRepository, connectDatabase, prisma } from './src/infrastructure'

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Setup dependencies
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

// Routes
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
