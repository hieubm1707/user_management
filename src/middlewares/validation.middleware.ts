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
};

export { celebrate, Joi, schemas };
