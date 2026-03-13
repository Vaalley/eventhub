import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
	userId: string
	otpPending?: boolean
}

declare global {
	namespace Express {
		interface Request {
			user?: AuthPayload
		}
	}
}

export function authMiddleware(jwtSecret: string) {
	return (req: Request, res: Response, next: NextFunction): void => {
		const token = req.cookies?.token
		if (!token) {
			res.status(401).json({ error: 'Token manquant' })
			return
		}

		try {
			const payload = jwt.verify(token, jwtSecret) as AuthPayload
			req.user = payload
			next()
		} catch {
			res.status(401).json({ error: 'Token invalide' })
		}
	}
}

export function requireFullAuth(req: Request, res: Response, next: NextFunction): void {
	if (!req.user) {
		res.status(401).json({ error: 'Non authentifié' })
		return
	}

	if (req.user.otpPending) {
		res.status(403).json({ error: 'Vérification OTP requise' })
		return
	}

	next()
}
