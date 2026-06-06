import express from 'express';
import { mezclarElementos } from '../controllers/mezclarController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Mezclar
 *   description: Operación para mezclar elementos químicos y obtener posibles compuestos
 */

/**
 * @swagger
 * /mezclar:
 *   post:
 *     summary: Mezcla elementos químicos y obtiene posibles compuestos, riesgos y sugerencias
 *     tags: [Mezclar]
 *     requestBody:
 *       description: Lista de símbolos de elementos para mezclar, mínimo 2
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - elementos
 *             properties:
 *               elementos:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["H", "O"]
 *     responses:
 *       200:
 *         description: Resultado de la mezcla generado por IA
 *       400:
 *         description: Error por datos inválidos
 *       500:
 *         description: Error interno del servidor
 */

router.post('/', mezclarElementos);

export default router;