import { type RequestHandler, Router } from 'express'
import type { AnalyticsController } from '../controllers/AnalyticsController'
import { requireFullAuth } from '../middlewares/authMiddleware'

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Page view tracking and statistics
 */
export function createAnalyticsRoutes(
	controller: AnalyticsController,
	authMiddleware: RequestHandler,
): Router {
	const router = Router()

	/**
	 * @swagger
	 * /api/analytics/track:
	 *   post:
	 *     summary: Track a page view
	 *     tags: [Analytics]
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             type: object
	 *             required: [path]
	 *             properties:
	 *               path:
	 *                 type: string
	 *                 example: /events
	 *               referrer:
	 *                 type: string
	 *                 example: https://google.com
	 *     responses:
	 *       204:
	 *         description: Page view tracked
	 */
	router.post('/track', (req, res, next) => controller.track(req, res, next))

	/**
	 * @swagger
	 * /api/analytics/stats:
	 *   get:
	 *     summary: Get page view statistics
	 *     tags: [Analytics]
	 *     security:
	 *       - bearerAuth: []
	 *     parameters:
	 *       - in: query
	 *         name: days
	 *         schema:
	 *           type: integer
	 *           default: 30
	 *         description: Number of days to include in statistics
	 *     responses:
	 *       200:
	 *         description: Statistics retrieved
	 *       401:
	 *         description: Not authenticated
	 */
	router.get('/stats', authMiddleware, requireFullAuth, (req, res, next) =>
		controller.getStats(req, res, next),
	)

	return router
}
