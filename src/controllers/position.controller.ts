// src/controllers/position.controller.ts
import { Router } from 'express';
import { Container } from 'typedi';
import { SalaryService } from '../services/salary.service';
import { validation } from '../middlewares';
import { Salary, CreateSalaryDTO, ErrorResponse, FilterSalaryDTO } from '../types/salary.type';
import { Joi, celebrate, filterSalarySchema } from '../middlewares/validation.middleware';
import PositionService from '../services/position.service';

const router = Router();

/**
 * GET /positions
 */
router.get('/', async (req, res) => {
  try {
    const positions = await PositionService.getAllPositions();
    return res.status(200).json(positions);
  } catch (err: any) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * GET /positions/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const position = await PositionService.getPositionById(id);
    if (!position) return res.status(404).json({ message: 'Position not found' });
    return res.status(200).json(position);
  } catch (err: any) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * POST /positions
 */
router.post(
  '/',
  celebrate({
    body: Joi.object({
      name: Joi.string().valid('DIRECTOR', 'MANAGER', 'STAFF', 'INTERN').required(),
      description: Joi.string().optional(),
    })
  }),
  async (req, res) => {
    try {
      const { name, description } = req.body;
      const position = await PositionService.createPosition({ name, description });
      return res.status(201).json(position);
    } catch (err: any) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

/**
 * PUT /positions/:id
 */
router.put(
  '/:id',
  celebrate({
    body: Joi.object({
      name: Joi.string().valid('DIRECTOR', 'MANAGER', 'STAFF', 'INTERN').optional(),
      description: Joi.string().optional(),
    })
  }),
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { name, description } = req.body;
      const position = await PositionService.updatePosition(id, { name, description });
      if (!position) return res.status(404).json({ message: 'Position not found' });
      return res.status(200).json(position);
    } catch (err: any) {
      return res.status(500).json({ message: 'Server error', error: err.message });
    }
  }
);

/**
 * DELETE /positions/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await PositionService.deletePosition(id);
    if (!deleted) return res.status(404).json({ message: 'Position not found' });
    return res.status(200).json({ message: 'Position deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
});

export default router;