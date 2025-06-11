import Joi from '@hapi/joi';
import { celebrate } from 'celebrate';

// Declare here custom validation schemas
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
  positionId: Joi.number().integer().valid(0, 1, 2, 3, 4).optional(),
};


const salaryschemas = {
// Schema for salary
salaryAmount: Joi.number().min(0).required(),
salaryMonth: Joi.number().min(1).max(12).required(),
salaryYear: Joi.number().min(2000).max(2100).required(),
}


// Validation for filterSalary API
const filterSalarySchema = Joi.object({
  search: Joi.string().trim().allow('').optional(),
  minAmount: salaryschemas.salaryAmount.optional(),
  maxAmount: salaryschemas.salaryAmount.optional(),
  month: salaryschemas.salaryMonth.optional(),
  year: salaryschemas.salaryYear.optional(),
  userId: schemas.uuid.optional(),
  sortBy: Joi.string().valid('amount', 'month', 'year', 'createdAt').optional(),
  sortOrder: Joi.string().valid('ASC', 'DESC').optional(),
})
  .or('search', 'minAmount', 'maxAmount', 'month', 'year', 'userId');


// Validation for userFilter API
const userFilterSchema = Joi.object({
    search: Joi.string().allow('').optional(),
    id: schemas.uuid.optional(),
    username: schemas.username.optional(),
    phone: Joi.string().length(10).regex(/^[0-9]{10}$/).optional(),
    email: schemas.email.optional(),
    role: Joi.string().valid('user', 'admin').optional(),
    positionId: Joi.number().integer().valid(0, 1, 2, 3, 4).allow(null).optional(),
  }).or('search', 'id', 'username', 'phone', 'email', 'role', 'positionId');
 
  
// validation for sumsalary
const sumSalarySchema = Joi.object({
  userId: schemas.uuid.optional(),
  fromMonth: Joi.number().integer().min(1).max(12).required(),
  fromYear: Joi.number().integer().min(2000).max(2100).required(),
  toMonth: Joi.number().integer().min(1).max(12).required(),
  toYear: Joi.number().integer().min(2000).max(2100).required(),
})


export { celebrate, Joi, schemas,userFilterSchema ,salaryschemas,filterSalarySchema,sumSalarySchema};
