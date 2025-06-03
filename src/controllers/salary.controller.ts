// src/controllers/salary.controller.ts
import Router from 'express-promise-router';
import { Container } from 'typedi';
import { SalaryService } from '../services/salary.service';
import { validation } from '../middlewares';
import {salaryschemas} from '../middlewares/validation.middleware';
const router = Router();

/**
 * GET /salary/:userId
 */
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  const salaries = await Container.get(SalaryService).getSalaryByUser(userId);
  return res.status(200).json(salaries);
});


/**
 * GET /salary/
 */
router.get('/', async (req, res) => {
    const salaries = await Container.get(SalaryService).getAllSalaries();
    return res.status(200).json(salaries);
  });

  
/**
 * GET /salary/:userId/:year/:month
 */
router.get('/:userId/:year/:month', async (req, res) => {
  const { userId, year, month } = req.params;
  const salary = await Container.get(SalaryService).getSalaryByMonth(userId, parseInt(year), parseInt(month));
  if (!salary) return res.status(404).json({ message: 'Salary not found' });
  return res.status(200).json(salary);
});

/**
 * POST /salary/:userId
 */
router.post(
  '/:userId',
  validation.celebrate({
    params: {
      userId: validation.schemas.uuid.required(),
    },
    body: {
      amount: validation.salaryschemas.salaryAmount,
      month: validation.salaryschemas.salaryMonth,
      year: validation.salaryschemas.salaryYear,
    },
  }),
  async (req, res) => {
    const { userId } = req.params;
    const { amount, month, year } = req.body;
    const salary = await Container.get(SalaryService).createSalary(userId, { amount, month, year });
    return res.status(201).json(salary);
  }
);

/**
 * PUT /salary/:userId/:year/:month
 */
router.put(
  '/:userId/:year/:month',
  validation.celebrate({
    params: {
      userId: validation.schemas.uuid.required(),
      year: validation.salaryschemas.salaryYear,
      month: validation.salaryschemas.salaryMonth,
    },
    body: {
      amount: validation.salaryschemas.salaryAmount,
    },
  }),
  async (req, res) => {
    const { userId, year, month } = req.params;
    const { amount } = req.body;
    const salary = await Container.get(SalaryService).updateSalary(userId, parseInt(year), parseInt(month), { amount });
    return res.status(200).json(salary);
  }
);

/**
 * DELETE /salary/:userId/:year/:month
 */
router.delete('/:userId/:year/:month', async (req, res) => {
  const { userId, year, month } = req.params;
  await Container.get(SalaryService).deleteSalary(userId, parseInt(year), parseInt(month));
  return res.status(204).send();
});

export default router;