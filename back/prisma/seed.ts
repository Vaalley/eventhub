import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const venues = [
	'Salle Pleyel',
	'Paris Expo',
	'Le Wagon Paris',
	'Station F',
	'Champs-Élysées',
	'Zénith de Paris',
	'AccorHotels Arena',
	'Palais des Congrès',
	'La Cigale',
	'Olympia',
	'Stade de France',
	'Roland-Garros',
]

const eventTemplates = [
	{ title: 'Concert Rock', category: 'concert', priceRange: [25, 80] },
	{ title: 'Festival Électro', category: 'concert', priceRange: [40, 120] },
	{ title: 'Soirée Jazz', category: 'concert', priceRange: [20, 60] },
	{ title: 'Concert Classique', category: 'concert', priceRange: [30, 100] },
	{ title: 'Conférence IA', category: 'conference', priceRange: [50, 200] },
	{ title: 'Summit DevOps', category: 'conference', priceRange: [100, 300] },
	{ title: 'Forum Startup', category: 'conference', priceRange: [0, 50] },
	{ title: 'Workshop Node.js', category: 'workshop', priceRange: [60, 120] },
	{
		title: 'Formation TypeScript',
		category: 'workshop',
		priceRange: [80, 150],
	},
	{ title: 'Atelier Docker', category: 'workshop', priceRange: [50, 100] },
	{
		title: 'Cours React Native',
		category: 'workshop',
		priceRange: [70, 140],
	},
	{ title: 'Meetup Python', category: 'meetup', priceRange: [0, 10] },
	{ title: 'Meetup Go', category: 'meetup', priceRange: [0, 10] },
	{ title: 'Meetup Rust', category: 'meetup', priceRange: [0, 10] },
	{ title: 'Match de Football', category: 'sport', priceRange: [20, 150] },
	{ title: 'Tournoi de Tennis', category: 'sport', priceRange: [30, 200] },
	{ title: 'Course à Pied', category: 'sport', priceRange: [15, 50] },
	{ title: 'Salon du Livre', category: 'other', priceRange: [10, 25] },
	{ title: 'Exposition Art', category: 'other', priceRange: [12, 30] },
	{ title: 'Marché de Noël', category: 'other', priceRange: [0, 5] },
]

function randomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateEvents(count: number) {
	const events = []
	const baseDate = new Date('2026-03-20')

	for (let i = 0; i < count; i++) {
		const template = eventTemplates[i % eventTemplates.length]
		const dayOffset = randomInt(1, 180)
		const startDate = new Date(baseDate)
		startDate.setDate(startDate.getDate() + dayOffset)
		startDate.setHours(randomInt(9, 20), 0, 0, 0)

		const endDate = new Date(startDate)
		endDate.setHours(endDate.getHours() + randomInt(2, 6))

		events.push({
			title: `${template.title} #${i + 1}`,
			description: `Description de l'événement ${template.title} numéro ${i + 1}`,
			startDate,
			endDate,
			venue: venues[randomInt(0, venues.length - 1)],
			capacity: randomInt(20, 5000),
			price: randomInt(template.priceRange[0], template.priceRange[1]),
			organizerId: `user-${randomInt(1, 10).toString().padStart(3, '0')}`,
			category: template.category,
		})
	}

	return events
}

async function main() {
	console.log('Seeding database...')

	// Clear existing data
	await prisma.event.deleteMany()

	// Generate 50 events for pagination testing
	const eventData = generateEvents(50)
	const result = await prisma.event.createMany({ data: eventData })

	console.log(`Created ${result.count} events`)
	console.log('Seeding completed!')
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
