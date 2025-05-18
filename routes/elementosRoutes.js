import express from 'express';
import {
  getAllElements,
  getElementById,
  getElementByAtomicNumber,
  getElementBySymbol,
  getElementByName,
  getElementsByGroup
} from '../controllers/elementosController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Elementos
 *   description: Operaciones relacionadas con elementos químicos
 */

/**
 * @swagger
 * /elementos:
 *   get:
 *     summary: Obtiene todos los elementos
 *     tags: [Elementos]
 *     responses:
 *       200:
 *         description: Lista de elementos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/', getAllElements);

/**
 * @swagger
 * /elementos/{id}:
 *   get:
 *     summary: Obtiene un elemento por ID MongoDB
 *     tags: [Elementos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del elemento (MongoDB ObjectId)
 *     responses:
 *       200:
 *         description: Elemento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Elemento no encontrado
 */
router.get('/:id', getElementById);

/**
 * @swagger
 * /elementos/atomic_number/{atomic_number}:
 *   get:
 *     summary: Obtiene un elemento por número atómico
 *     tags: [Elementos]
 *     parameters:
 *       - in: path
 *         name: atomic_number
 *         required: true
 *         schema:
 *           type: string
 *         description: Número atómico del elemento
 *     responses:
 *       200:
 *         description: Elemento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Elemento no encontrado
 */
router.get('/atomic_number/:atomic_number', getElementByAtomicNumber);

/**
 * @swagger
 * /elementos/symbol/{symbol}:
 *   get:
 *     summary: Obtiene un elemento por símbolo químico
 *     tags: [Elementos]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Símbolo químico del elemento
 *     responses:
 *       200:
 *         description: Elemento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Elemento no encontrado
 */
router.get('/symbol/:symbol', getElementBySymbol);

/**
 * @swagger
 * /elementos/name/{name}:
 *   get:
 *     summary: Obtiene un elemento por nombre (insensible a mayúsculas)
 *     tags: [Elementos]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del elemento químico
 *     responses:
 *       200:
 *         description: Elemento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Elemento no encontrado
 */
router.get('/name/:name', getElementByName);

/**
 * @swagger
 * /elementos/grupo/{grupo}:
 *   get:
 *     summary: Obtiene elementos por grupo y muestra familia química
 *     tags: [Elementos]
 *     parameters:
 *       - in: path
 *         name: grupo
 *         required: true
 *         schema:
 *           type: string
 *         description: Grupo químico
 *     responses:
 *       200:
 *         description: Lista de elementos con grupo y familia
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 grupo:
 *                   type: string
 *                 familia:
 *                   type: string
 *                 elementos:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: No se encontraron elementos en ese grupo
 */
router.get('/grupo/:grupo', getElementsByGroup);

export default router;
