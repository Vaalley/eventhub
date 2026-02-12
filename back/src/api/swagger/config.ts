import swaggerJsdoc from 'swagger-jsdoc'

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'EventHub API',
			version: '1.0.0',
			description: 'API de gestion des événements',
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Serveur de développement',
			},
		],
		components: {
			schemas: {
				Event: {
					type: 'object',
					properties: {
						id: { type: 'string', format: 'uuid' },
						title: { type: 'string' },
						description: { type: 'string' },
						startDate: { type: 'string', format: 'date-time' },
						endDate: { type: 'string', format: 'date-time' },
						venue: { type: 'string' },
						capacity: { type: 'integer' },
						price: { type: 'number' },
						organizerId: { type: 'string' },
						category: {
							type: 'string',
							enum: ['concert', 'conference', 'workshop', 'meetup', 'sport', 'other'],
						},
						imageUrl: { type: 'string' },
						createdAt: { type: 'string', format: 'date-time' },
						updatedAt: { type: 'string', format: 'date-time' },
					},
				},
				CreateEventInput: {
					type: 'object',
					required: ['title', 'startDate', 'venue', 'capacity', 'category'],
					properties: {
						title: { type: 'string', example: 'Concert de Jazz' },
						description: { type: 'string', example: 'Un super concert de jazz' },
						startDate: {
							type: 'string',
							format: 'date-time',
							example: '2025-02-01T20:00:00Z',
						},
						endDate: {
							type: 'string',
							format: 'date-time',
							example: '2025-02-01T23:00:00Z',
						},
						venue: { type: 'string', example: 'Salle Pleyel' },
						capacity: { type: 'integer', example: 100 },
						price: { type: 'number', example: 50 },
						category: {
							type: 'string',
							enum: ['concert', 'conference', 'workshop', 'meetup', 'sport', 'other'],
							example: 'concert',
						},
						imageUrl: { type: 'string', example: 'https://example.com/image.jpg' },
					},
				},
				UpdateEventInput: {
					type: 'object',
					properties: {
						title: { type: 'string' },
						description: { type: 'string' },
						startDate: { type: 'string', format: 'date-time' },
						endDate: { type: 'string', format: 'date-time' },
						venue: { type: 'string' },
						capacity: { type: 'integer' },
						price: { type: 'number' },
						category: {
							type: 'string',
							enum: ['concert', 'conference', 'workshop', 'meetup', 'sport', 'other'],
						},
						imageUrl: { type: 'string' },
					},
				},
			},
		},
	},
	apis: ['./src/api/routes/*.ts'],
}

export const swaggerSpec = swaggerJsdoc(options)
