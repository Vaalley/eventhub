import { Router } from 'express'
import type { EventController } from '../controllers/EventController'

export function createEventRoutes(controller: EventController): Router {
	const router = Router()

	/**
	 * @swagger
	 * /api/events:
	 *   get:
	 *     summary: Liste tous les événements
	 *     tags: [Events]
	 *     responses:
	 *       200:
	 *         description: Liste des événements
	 *         content:
	 *           application/json:
	 *             schema:
	 *               type: array
	 *               items:
	 *                 $ref: '#/components/schemas/Event'
	 */
	router.get('/', (req, res, next) => controller.list(req, res, next))

	/**
	 * @swagger
	 * /api/events/{id}:
	 *   get:
	 *     summary: Récupère un événement par son ID
	 *     tags: [Events]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: ID de l'événement
	 *     responses:
	 *       200:
	 *         description: Événement trouvé
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Event'
	 *       404:
	 *         description: Événement non trouvé
	 */
	router.get('/:id', (req, res, next) => controller.getById(req, res, next))

	/**
	 * @swagger
	 * /api/events:
	 *   post:
	 *     summary: Crée un nouvel événement
	 *     tags: [Events]
	 *     parameters:
	 *       - in: header
	 *         name: x-user-id
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: ID de l'utilisateur (organisateur)
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/CreateEventInput'
	 *     responses:
	 *       201:
	 *         description: Événement créé
	 *         content:
	 *           application/json:
	 *             schema:
	 *               $ref: '#/components/schemas/Event'
	 *       400:
	 *         description: Données invalides
	 */
	router.post('/', (req, res, next) => controller.create(req, res, next))

	/**
	 * @swagger
	 * /api/events/{id}:
	 *   put:
	 *     summary: Met à jour un événement
	 *     tags: [Events]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: ID de l'événement
	 *     requestBody:
	 *       required: true
	 *       content:
	 *         application/json:
	 *           schema:
	 *             $ref: '#/components/schemas/UpdateEventInput'
	 *     responses:
	 *       200:
	 *         description: Événement mis à jour
	 *       404:
	 *         description: Événement non trouvé
	 */
	router.put('/:id', (req, res, next) => controller.update(req, res, next))

	/**
	 * @swagger
	 * /api/events/{id}:
	 *   delete:
	 *     summary: Supprime un événement
	 *     tags: [Events]
	 *     parameters:
	 *       - in: path
	 *         name: id
	 *         required: true
	 *         schema:
	 *           type: string
	 *         description: ID de l'événement
	 *     responses:
	 *       204:
	 *         description: Événement supprimé
	 *       404:
	 *         description: Événement non trouvé
	 */
	router.delete('/:id', (req, res, next) => controller.delete(req, res, next))

	return router
}
