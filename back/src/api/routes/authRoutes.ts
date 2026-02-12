import { type RequestHandler, Router } from 'express'
import type { AuthController } from '../controllers/AuthController'
import { requireFullAuth } from '../middlewares/authMiddleware'
import { otpRateLimiter } from '../middlewares/rateLimiter'

export function createAuthRoutes(
	controller: AuthController,
	authMiddleware: RequestHandler,
): Router {
	const router = Router()

	/**
	 * @swagger
	 * /api/auth/register:
	 *   post:
	 *     summary: Créer un compte utilisateur
	 *     tags: [Auth]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required: [email, name, password]
	 *             properties:
	 *               email:
	 *                 type: string
	 *                 example: user@example.com
	 *               name:
	 *                 type: string
	 *                 example: John Doe
	 *               password:
	 *                 type: string
	 *                 example: secret123
	 *     responses:
	 *       201:
	 *         description: Utilisateur créé
	 *       400:
	 *         description: Données invalides
	 */
	router.post('/register', (req, res, next) => controller.register(req, res, next))

	/**
	 * @swagger
	 * /api/auth/login:
	 *   post:
	 *     summary: Connexion utilisateur
	 *     tags: [Auth]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required: [email, password]
	 *             properties:
	 *               email:
	 *                 type: string
	 *                 example: user@example.com
	 *               password:
	 *                 type: string
	 *                 example: secret123
	 *     responses:
	 *       200:
	 *         description: Token JWT (partiel si 2FA activée)
	 *       401:
	 *         description: Identifiants invalides
	 */
	router.post('/login', (req, res, next) => controller.login(req, res, next))

	/**
	 * @swagger
	 * /api/auth/otp/verify:
	 *   post:
	 *     summary: Vérifier un code OTP ou recovery code
	 *     tags: [Auth]
	 *     security:
	 *       - bearerAuth: []
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required: [code]
	 *             properties:
	 *               code:
	 *                 type: string
	 *                 example: '123456'
	 *               isEnabling:
	 *                 type: boolean
	 *                 default: false
	 *               isRecoveryCode:
	 *                 type: boolean
	 *                 default: false
	 *     responses:
	 *       200:
	 *         description: Token JWT complet (+ recovery codes si isEnabling)
	 *       401:
	 *         description: Code invalide
	 *       429:
	 *         description: Trop de tentatives
	 */
	router.post('/otp/verify', authMiddleware, otpRateLimiter, (req, res, next) =>
		controller.verifyOtp(req, res, next),
	)

	/**
	 * @swagger
	 * /api/auth/otp/setup:
	 *   get:
	 *     summary: Générer un QR code pour configurer la 2FA
	 *     tags: [Auth]
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: QR code et secret TOTP
	 *       401:
	 *         description: Non authentifié
	 */
	router.get('/otp/setup', authMiddleware, requireFullAuth, (req, res, next) =>
		controller.setupOtp(req, res, next),
	)

	/**
	 * @swagger
	 * /api/auth/otp:
	 *   delete:
	 *     summary: Désactiver la double authentification
	 *     tags: [Auth]
	 *     security:
	 *       - bearerAuth: []
	 *     responses:
	 *       200:
	 *         description: 2FA désactivée
	 *       401:
	 *         description: Non authentifié
	 */
	router.delete('/otp', authMiddleware, requireFullAuth, (req, res, next) =>
		controller.disableOtp(req, res, next),
	)

	return router
}
