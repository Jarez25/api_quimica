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
 *     summary: Mezcla elementos químicos y obtiene posibles compuestos y sugerencias
 *     tags: [Mezclar]
 *     requestBody:
 *       description: Lista de símbolos de elementos para mezclar (mínimo 2)
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
 *                 example: ["C", "H", "O"]
 *     responses:
 *       200:
 *         description: Resultado con fórmula, descripción, elementos similares y sugerencias
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultado:
 *                   type: string
 *                   example: "CH4, CO2"
 *                 descripcion:
 *                   type: string
 *                   example: "Se pueden formar metano y dióxido de carbono."
 *                 elementos_similares:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["N", "S"]
 *                 sugerencias:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["CH4 + O2", "CO2 + H2O"]
 *       400:
 *         description: Error por datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Proporcione al menos dos elementos para mezclar."
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error al procesar la mezcla"
 */

router.post('/', mezclarElementos);

export default router;
