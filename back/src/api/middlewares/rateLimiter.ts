import rateLimit from 'express-rate-limit'

export const otpRateLimiter = rateLimit({
	windowMs: 60 * 1000,
	max: 10,
	message: { error: 'Trop de tentatives. Réessayez dans une minute.' },
	standardHeaders: true,
	legacyHeaders: false,
})
