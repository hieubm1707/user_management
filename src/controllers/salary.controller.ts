// src/controllers/salary.controller.ts
import { UserService } from '../services';
import { Router } from 'express';
import { Container } from 'typedi';
import { SalaryService } from '../services/salary.service';
import { validation } from '../middlewares';
import { Salary, CreateSalaryDTO, ErrorResponse, FilterSalaryDTO } from '../types/salary.type';
import { Joi, celebrate, filterSalarySchema, sumSalarySchema } from '../middlewares/validation.middleware';
import UserModel from '../models/user.model'

const router = Router();


/**
 * GET /salary/filter
 */
router.get<{}, any, {}, any>(
  '/filter',
  validation.celebrate({
    query: filterSalarySchema,
  }),
  async (req, res) => {
    const filter = req.query;
    const salaries = await Container.get(SalaryService).getSalaries(filter as any);
    if (salaries.length === 0) {
      res.status(404).json({ message: 'No matching results found' });
      return;
    }
    return res.status(200).json(salaries);
  }
);



/**
 * GET /salary/:userId
 */
router.get<{ userId: string }, Salary[]>(
  '/:userId',
  validation.celebrate({
    params: {
      userId: validation.schemas.uuid.required(),
    },
  }),
  async (req, res) => {
    const { userId } = req.params;
    const salaries = await Container.get(SalaryService).getSalaryByUser(userId);
    return res.status(200).json(salaries);
  }
);


/**
 * GET /salary/
 */
router.get<{}, Salary[] | { message: string }>(
  '/',
  celebrate({
    query: Joi.object({
      userId: Joi.string().guid().optional(),
    }),
  }),
  async (req, res) => {
    const { userId } = req.query;
    if (userId) {
      const salaries = await Container.get(SalaryService).getSalaryByUser(userId as string);
      if (!salaries || salaries.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(salaries);
    }
    const salaries = await Container.get(SalaryService).getAllSalaries();
    return res.status(200).json(salaries);
  }
);


/**
 * GET /salary/:userId/:year/:month
 */
router.get<{ userId: string; year: string; month: string }, Salary | ErrorResponse>(
  '/:userId/:year/:month',
  validation.celebrate({
    params: {
      userId: validation.schemas.uuid.required(),
      year: validation.salaryschemas.salaryYear,
      month: validation.salaryschemas.salaryMonth,
    },
  }),
  async (req, res) => {
    const { userId, year, month } = req.params;
    const salary = await Container.get(SalaryService).getSalaryByMonth(userId, parseInt(year), parseInt(month));
    if (!salary) {
      return res.status(404).json({ error: 'Salary not found' });
    }
    return res.status(200).json(salary);
  }
);



/**
 * POST /salary/:userId
 */
router.post<{ userId: string }, Salary | ErrorResponse, CreateSalaryDTO>(
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
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }


  // Check if userId exists
  const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(400).json({ error: 'UserId does not exist' });
    }
    const salaryDetails = req.body;
    const salary = await Container.get(SalaryService).createSalary(userId, salaryDetails);
    return res.status(201).json(salary);
  }
);


/**
 * PUT /salary/:userId/:year/:month
 * Update salary by userId, year, month (all via path param)
 */
router.put<{ userId: string; year: string; month: string }, Salary | ErrorResponse, { amount: number }>(
  '/:userId/:year/:month',
  validation.celebrate({
    params: {
      userId: validation.schemas.uuid.required(),
      year: validation.salaryschemas.salaryYear,
      month: validation.salaryschemas.salaryMonth,
    },
    body: {
      amount: validation.salaryschemas.salaryAmount.required(),
    },
  }),
  async (req, res) => {
    const { userId, year, month } = req.params;
    const { amount } = req.body;
    // Check if userId exists
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(400).json({ error: 'UserId does not exist' });
    }
    // Check if salary record exists
    const salaryService = Container.get(SalaryService);
    const oldSalary = await salaryService.getSalaryByMonth(userId, parseInt(year), parseInt(month));
    if (!oldSalary) {
      return res.status(404).json({ error: 'Salary not found' });
    }
    // Update amount
    const updatedSalary = await oldSalary.update({ amount });
    return res.status(200).json(updatedSalary);
  }
);



/**
 * DELETE /salary/:userId/:year/:month
 * Delete salary by userId, year, month (all via path param)
 */
router.delete<{ userId: string; year: string; month: string }, { message: string } | ErrorResponse, {}>(
  '/:userId/:year/:month',
  validation.celebrate({
    params: {
      userId: validation.schemas.uuid.required(),
      year: validation.salaryschemas.salaryYear,
      month: validation.salaryschemas.salaryMonth,
    },
  }),
  async (req, res) => {
    const { userId, year, month } = req.params;
    // Check if userId exists
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(400).json({ error: 'UserId does not exist' });
    }
    // Check if salary record exists
    const salaryService = Container.get(SalaryService);
    const oldSalary = await salaryService.getSalaryByMonth(userId, parseInt(year), parseInt(month));
    if (!oldSalary) {
      return res.status(404).json({ error: 'Salary not found' });
    }
    await oldSalary.destroy();
    return res.status(200).json({ message: 'Deleted successfully' });
  }
);

/**
 * GET /salary/sum-salary
 * Tính tổng lương của 1 user trong khoảng thời gian
 * Query: userId, fromMonth, fromYear, toMonth, toYear
 */
router.get('/sumsalary', async (req, res) => {
  const { error, value } = sumSalarySchema.validate(req.query);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  const { userId, fromMonth, fromYear, toMonth, toYear } = value;
  // Tính tổng lương cho 1 user
  const { Op } = require('sequelize');
  const SalaryModel = require('../models/salary.model').default;
  const total = await SalaryModel.sum('amount', {
    where: {
      userid: userId,
      [Op.and]: [
        {
          [Op.or]: [
            { year: { [Op.gt]: fromYear } },
            { year: fromYear, month: { [Op.gte]: fromMonth } }
          ]
        },
        {
          [Op.or]: [
            { year: { [Op.lt]: toYear } },
            { year: toYear, month: { [Op.lte]: toMonth } }
          ]
        }
      ]
    }
  });

  return res.json({ userId, totalSalary: total || 0 });
});

export default router;