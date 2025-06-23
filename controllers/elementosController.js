import Element from '../models/Element.js';
import familiasPorGrupo from '../data/grupos.js';
import { posiciones } from '../data/posiciones.js';
const agregarPosicion = (el) => {
  const pos = posiciones[el.atomic_number];
  return {
    ...el._doc,
    xpos: pos?.xpos || null,
    ypos: pos?.ypos || null,
  };
};

export const getAllElements = async (req, res) => {
  try {
    const elementos = await Element.find();
    const conPosiciones = elementos.map((el) => agregarPosicion(el));
    res.json(conPosiciones);
  } catch (err) {
    console.error('Error al obtener los elementos:', err);
    res.status(500).send('Error al obtener los elementos');
  }
};

export const getElementById = async (req, res) => {
  try {
    const elemento = await Element.findById(req.params.id);
    if (elemento) {
      res.json(agregarPosicion(elemento));
    } else {
      res.status(404).send('Elemento no encontrado');
    }
  } catch (err) {
    console.error('Error al buscar el elemento:', err);
    res.status(500).send('Error al buscar el elemento');
  }
};

export const getElementByAtomicNumber = async (req, res) => {
  try {
    const numeroAtomico = req.params.atomic_number;
    const elemento = await Element.findOne({ atomic_number: numeroAtomico });
    if (elemento) {
      res.json(agregarPosicion(elemento));
    } else {
      res.status(404).send('Elemento no encontrado');
    }
  } catch (err) {
    console.error('Error al buscar el elemento:', err);
    res.status(500).send('Error al buscar el elemento');
  }
};

export const getElementBySymbol = async (req, res) => {
  try {
    const simbolo = req.params.symbol;
    const elemento = await Element.findOne({ symbol: simbolo });
    if (elemento) {
      res.json(agregarPosicion(elemento));
    } else {
      res.status(404).send('Elemento no encontrado');
    }
  } catch (err) {
    console.error('Error al buscar el elemento por símbolo:', err);
    res.status(500).send('Error al buscar el elemento');
  }
};

export const getElementByName = async (req, res) => {
  try {
    const nombre = req.params.name;
    const elemento = await Element.findOne({
      name: new RegExp(`^${nombre}$`, 'i'),
    });
    if (elemento) {
      res.json(agregarPosicion(elemento));
    } else {
      res.status(404).send('Elemento no encontrado');
    }
  } catch (err) {
    console.error('Error al buscar el elemento por nombre:', err);
    res.status(500).send('Error al buscar el elemento');
  }
};

export const getElementsByGroup = async (req, res) => {
  try {
    const grupo = req.params.grupo;
    const familia = familiasPorGrupo[grupo] || 'Familia desconocida';

    const elementos = await Element.find({ group: grupo });

    if (elementos.length > 0) {
      const conPosiciones = elementos.map((el) => agregarPosicion(el));
      res.json({
        grupo: grupo,
        familia: familia,
        elementos: conPosiciones,
      });
    } else {
      res.status(404).send('No se encontraron elementos en ese grupo');
    }
  } catch (err) {
    console.error('Error al buscar elementos por grupo:', err);
    res.status(500).send('Error interno del servidor');
  }
};
