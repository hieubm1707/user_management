import { UserService } from '../services';
import { Router, Response } from 'express';
import { Container } from 'typedi';
import { SalaryService } from '../services/salary.service';
import { validation } from '../middlewares';
import { Salary, CreateSalaryDTO, ErrorResponse, FilterSalaryDTO } from '../types/salary.type';
import { Joi, celebrate, filterSalarySchema, sumSalarySchema, validateDateRangeQuery } from '../middlewares/validation.middleware';
import UserModel from '../models/user.model';
import { AuthUser } from '../types';
import { checkPermission } from '../middlewares/permission.middleware';
import { auth } from '../middlewares/jwt.middleware';

const router = Router();

/**
 * API: GET /my-salaries
 * Mô tả: Lấy danh sách lương của người dùng đang đăng nhập
 */
router.get(
  '/me',
  checkPermission(),
  async (req, res) => {
    const user = req.auth as AuthUser;
    if (!user) return res.status(401).json({ message: 'Chưa đăng nhập!' });

    const salaries = await Container.get(SalaryService).getUserSalaries(user.id);
    return res.status(200).json(salaries);
  }
);

/** Calculate the total salary of a user within a time range
 * GET /salary/sumsalary
 */
router.get(
  '/sumsalary',
  checkPermission(),
  celebrate({
    query: sumSalarySchema,
  }),
  validateDateRangeQuery,
  async (req, res) => {
    const { userId, fromMonth, fromYear, toMonth, toYear } = req.query as any;
    try {
      const parsedFromMonth = parseInt(fromMonth as string, 10);
      const parsedFromYear = parseInt(fromYear as string, 10);
      const parsedToMonth = parseInt(toMonth as string, 10);
      const parsedToYear = parseInt(toYear as string, 10);
      const result = await Container.get(SalaryService).getSalarySumByDateRange({
        userId: userId as string,
        fromMonth: parsedFromMonth,
        fromYear: parsedFromYear,
        toMonth: parsedToMonth,
        toYear: parsedToYear,
      });
      return res.status(200).json(result);
    } catch (error) {
      const err = error as Error;
      return res.status(400).json({ message: err.message });
    }
  }
);

/** Calculate the total salary of all users within a time range
 * GET /salary/sumall
 */
router.get(
  '/sumall',
  checkPermission(),
  celebrate({
    query: Joi.object({
      fromMonth: Joi.number().min(1).max(12).required(),
      fromYear: Joi.number().min(2000).required(),
      toMonth: Joi.number().min(1).max(12).required(),
      toYear: Joi.number().min(2000).required(),
    }),
  }),
  validateDateRangeQuery,
  async (req, res) => {
    const { fromMonth, fromYear, toMonth, toYear } = req.query;
    const total = await Container.get(SalaryService).getTotalSalaryByDateRange(
      parseInt(fromMonth as string),
      parseInt(fromYear as string),
      parseInt(toMonth as string),
      parseInt(toYear as string)
    );
    return res.status(200).json({ total });
  }
);

/**
 * GET /salary/filter
 */
router.get(
  '/filter',
  checkPermission(),
  validation.celebrate({
    query: filterSalarySchema,
  }),
  validateDateRangeQuery,
  async (req, res) => {
    const filter = req.query;
    const salaries = await Container.get(SalaryService).getSalaries(filter as any);
    if (salaries.length === 0) {
      return res.status(404).json({ message: 'No matching results found' });
    }
    return res.status(200).json(salaries);
  }
);

/**
 * GET /salary/:userId
 */
router.get(
  '/:userId',
  checkPermission(),
  validation.celebrate({
    params: {
      userId: validation.schemas.uuid.required(),
    },
  }),
  async (req, res) => {
    const { userId } = req.params;
    const salaries = await Container.get(SalaryService).getSalaryByUser(userId);
    if (!salaries || salaries.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(salaries);
  }
);

/**
 * GET /salary/
 */
router.get(
  '/',
  checkPermission(),
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
router.get(
  '/:userId/:year/:month',
  checkPermission(),
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
router.post(
  '/:userId',
  checkPermission(),
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
 */
router.put(
  '/:userId/:year/:month',
  checkPermission(),
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
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(400).json({ error: 'UserId does not exist' });
    }
    const salaryService = Container.get(SalaryService);
    const oldSalary = await salaryService.getSalaryByMonth(userId, parseInt(year), parseInt(month));
    if (!oldSalary) {
      return res.status(404).json({ error: 'Salary not found' });
    }
    const updatedSalary = await oldSalary.update({ amount });
    return res.status(200).json(updatedSalary);
  }
);

/**
 * DELETE /salary/:userId/:year/:month
 */
router.delete(
  '/:userId/:year/:month',
  checkPermission(),
  validation.celebrate({
    params: {
      userId: validation.schemas.uuid.required(),
      year: validation.salaryschemas.salaryYear,
      month: validation.salaryschemas.salaryMonth,
    },
  }),
  async (req, res) => {
    const { userId, year, month } = req.params;
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(400).json({ error: 'UserId does not exist' });
    }
    const salaryService = Container.get(SalaryService);
    const oldSalary = await salaryService.getSalaryByMonth(userId, parseInt(year), parseInt(month));
    if (!oldSalary) {
      return res.status(404).json({ error: 'Salary not found' });
    }
    await oldSalary.destroy();
    return res.status(200).json({ message: 'Deleted successfully' });
  }
);

export default router;