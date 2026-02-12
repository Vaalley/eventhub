import { type RequestHandler, Router } from 'express'
import type { AuthController } from '../controllers/AuthController'
import { requireFullAuth } from '../middlewares/authMiddleware'
import { otpRateLimiter } from '../middlewares/rateLimiter'

export function createAuthRoutes(
	controller: AuthController,
	authMiddleware: RequestHandler,
): Router {
	const router = Router()

	router.post('/register', (req, res, next) => controller.register(req, res, next))
	router.post('/login', (req, res, next) => controller.login(req, res, next))
	router.post('/otp/verify', authMiddleware, otpRateLimiter, (req, res, next) =>
		controller.verifyOtp(req, res, next),
	)
	router.get('/otp/setup', authMiddleware, requireFullAuth, (req, res, next) =>
		controller.setupOtp(req, res, next),
	)
	router.delete('/otp', authMiddleware, requireFullAuth, (req, res, next) =>
		controller.disableOtp(req, res, next),
	)

	return router
}
