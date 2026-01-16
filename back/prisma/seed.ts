import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
	console.log('Seeding database...')

	// Clear existing data
	await prisma.event.deleteMany()

	// Create sample events
	const events = await Promise.all([
		prisma.event.create({
			data: {
				title: 'Concert de Jazz',
				description: 'Un super concert de jazz avec des artistes internationaux',
				startDate: new Date('2026-02-15T20:00:00Z'),
				endDate: new Date('2026-02-15T23:00:00Z'),
				venue: 'Salle Pleyel',
				capacity: 500,
				price: 45.0,
				organizerId: 'user-001',
				category: 'concert',
				imageUrl: 'https://example.com/jazz.jpg',
			},
		}),
		prisma.event.create({
			data: {
				title: 'Conférence Tech 2026',
				description: 'Les dernières innovations en développement web',
				startDate: new Date('2026-03-10T09:00:00Z'),
				endDate: new Date('2026-03-10T18:00:00Z'),
				venue: 'Paris Expo',
				capacity: 1000,
				price: 150.0,
				organizerId: 'user-002',
				category: 'conference',
				imageUrl: 'https://example.com/tech.jpg',
			},
		}),
		prisma.event.create({
			data: {
				title: 'Workshop React Avancé',
				description: 'Apprenez les patterns avancés de React',
				startDate: new Date('2026-02-20T14:00:00Z'),
				endDate: new Date('2026-02-20T18:00:00Z'),
				venue: 'Le Wagon Paris',
				capacity: 30,
				price: 80.0,
				organizerId: 'user-003',
				category: 'workshop',
			},
		}),
		prisma.event.create({
			data: {
				title: 'Meetup JavaScript Paris',
				description: 'Rencontre mensuelle des développeurs JS',
				startDate: new Date('2026-02-25T19:00:00Z'),
				venue: 'Station F',
				capacity: 100,
				price: 0,
				organizerId: 'user-001',
				category: 'meetup',
			},
		}),
		prisma.event.create({
			data: {
				title: 'Marathon de Paris',
				description: 'Course annuelle dans les rues de Paris',
				startDate: new Date('2026-04-05T08:00:00Z'),
				endDate: new Date('2026-04-05T16:00:00Z'),
				venue: 'Champs-Élysées',
				capacity: 50000,
				price: 120.0,
				organizerId: 'user-004',
				category: 'sport',
				imageUrl: 'https://example.com/marathon.jpg',
			},
		}),
	])

	console.log(`Created ${events.length} events:`)
	for (const event of events) {
		console.log(`  - ${event.title} (${event.id})`)
	}

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
