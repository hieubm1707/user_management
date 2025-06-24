import { Router, Response } from 'express';
import { Container } from 'typedi';
import { SalaryService } from '../services/salary.service';
import { validation } from '../middlewares';
import { Joi, celebrate, filterSalarySchema, sumSalarySchema, validateDateRangeQuery } from '../middlewares/validation.middleware';
import { AuthUser } from '../types';
import { Salary, SalarySumResult } from '../types/salary.type';


const router = Router();


/**
 * API: GET /my-salaries
 * Description: Get the salary list of the currently logged-in user
 */
router.get<{}, Salary[] | { message: string }>(
  '/me',
  async (req, res) => {
    const user = req.auth as AuthUser;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    const salaries = await Container.get(SalaryService).getUserSalaries(user.id);
    return res.status(200).json(salaries);
  }
);


/** Calculate the total salary of a user within a time range
 * GET /salary/sumsalary
 */
router.get<{}, SalarySumResult>(
  '/sumsalary',
  celebrate({
    query: sumSalarySchema,
  }),
  validateDateRangeQuery,
  async (req, res) => {
    const { userId, fromMonth, fromYear, toMonth, toYear } = req.query as any;
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
  }
);


/** Calculate the total salary of all users within a time range
 * GET /salary/sumall
 */
router.get<{}, { total: number}>(
  '/sumall',
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
router.get<{}, Salary[]>(
  '/filter',
  validation.celebrate({
    query: filterSalarySchema,
  }),
  validateDateRangeQuery,
  async (req, res) => {
    const filter = req.query;
    const salaries = await Container.get(SalaryService).getSalaries(filter as any);
    return res.status(200).json(salaries);
  }
);


/**
 * GET /salary/:userId
 */
router.get<{userId: string}, Salary[]>(
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
router.get<{}, Salary[]>(
  '/',
  validation.celebrate({
    query: Joi.object({
      userId: Joi.string().guid().optional(),
    }),
  }),
  async (req, res) => {
    const { userId } = req.query;
    if (userId) {
      const salaries = await Container.get(SalaryService).getSalaryByUser(userId as string);
      return res.status(200).json(salaries);
    }
    const salaries = await Container.get(SalaryService).getAllSalaries();
    return res.status(200).json(salaries);
  }
);


/**
 * GET /salary/:userId/:year/:month
 */
router.get<{userId: string, year: string, month: string}, Salary | { error: string }>(
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
       res.status(404).json({ error: 'Salary not found' });
       return;
    }
     res.status(200).json(salary);
     
     return;
  }
);


/**
 * POST /salary/:userId
 */
router.post<{userId: string}, Salary, {amount: number, month: number, year: number}>(
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
    const salaryDetails = req.body;
    const salary = await Container.get(SalaryService).createSalary(userId, salaryDetails);
    return res.status(201).json(salary);
  }
);


/**
 * PUT /salary/:userId/:year/:month
 */
router.put<{userId: string, year: string, month: string}, Salary, {amount: number}>(
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
    const salaryService = Container.get(SalaryService);
    const updatedSalary = await salaryService.updateSalary(userId, parseInt(year), parseInt(month), { amount });
    return res.status(200).json(updatedSalary);
  }
);


/**
 * DELETE /salary/:userId/:year/:month
 */
router.delete<{userId: string, year: string, month: string}, {message: string}>(
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
    const salaryService = Container.get(SalaryService);
    await salaryService.deleteSalary(userId, parseInt(year), parseInt(month));
    return res.status(200).json({ message: 'Deleted successfully' });
  }
);


export default router;