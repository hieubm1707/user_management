import Joi from '@hapi/joi';
import { celebrate } from 'celebrate';

// Custom validation schemas
const schemas = {
  id: Joi.number().integer().positive(),
  firstName: Joi.string().min(2).max(50).trim(),
  lastName: Joi.string().min(2).max(50).trim(),
  email: Joi.string().max(255).email(),
  password: Joi.string().min(8).max(64),
  uuid: Joi.string().guid(),
  username: Joi.string().min(2).max(64).trim(),
  phone: Joi.string().min(10).max(10).trim(),
  title: Joi.string().min(2).max(255).trim(),
  description: Joi.string().max(255).trim(),
  string: Joi.string(),
};

const salaryschemas = {
  salaryAmount: Joi.number().min(0), 
  salaryMonth: Joi.number().min(1).max(12),
  salaryYear: Joi.number().min(2000).max(2100),
};

// Validation for filter API
const filterSalariesSchema = Joi.object({
    search: Joi.string().allow('').optional(),
    minAmount: salaryschemas.salaryAmount.optional(),
    maxAmount: salaryschemas.salaryAmount.optional(),
    month: salaryschemas.salaryMonth.optional(),
    year: salaryschemas.salaryYear.optional(),
    userId: schemas.uuid.optional(),
    sortBy: Joi.string().valid('amount', 'month', 'year', 'createdAt').optional(),
    sortOrder: Joi.string().valid('ASC', 'DESC').optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
  })
    .or('search', 'minAmount', 'maxAmount', 'month', 'year', 'userId');

export { celebrate, Joi, schemas, salaryschemas, filterSalariesSchema };