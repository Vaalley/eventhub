import { type Db, MongoClient } from 'mongodb'

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/eventhub'

let client: MongoClient | null = null
let db: Db | null = null

export async function connectMongoDB(): Promise<Db> {
	if (db) return db

	client = new MongoClient(mongoUri)
	await client.connect()
	db = client.db()
	console.log('Connected to MongoDB')
	return db
}

export async function disconnectMongoDB(): Promise<void> {
	if (client) {
		await client.close()
		client = null
		db = null
	}
}

export function getMongoDB(): Db {
	if (!db) {
		throw new Error('MongoDB not connected. Call connectMongoDB first.')
	}
	return db
}
