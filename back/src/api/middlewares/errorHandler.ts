import type { Request, Response, NextFunction } from 'express'
import { ValidationError, NotFoundError, DomainError } from '../../domain'

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction): void {
	console.error(error)

	if (error instanceof ValidationError) {
		res.status(400).json({ error: error.message })
		return
	}

	if (error instanceof NotFoundError) {
		res.status(404).json({ error: error.message })
		return
	}

	if (error instanceof DomainError) {
		res.status(400).json({ error: error.message })
		return
	}

	res.status(500).json({ error: 'Erreur interne du serveur' })
}
