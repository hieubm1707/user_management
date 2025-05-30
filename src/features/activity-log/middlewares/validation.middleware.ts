import Joi from '@hapi/joi';
import { celebrate } from 'celebrate';

// Declare here custom validation schemas
const schemas = {
  id: Joi.number().integer().positive(),
  uuid: Joi.string().guid(),
  string: Joi.string().trim(),
  boolean: Joi.boolean(),
  date: Joi.date(),
  number: Joi.number(),
  array: Joi.array(),
  object: Joi.object(),
};

const createActivityLogSchema = Joi.object({
  log_name: schemas.string,
  description: schemas.string.required(),
  subject_type: schemas.string,
  subject_id: schemas.number,
  event: schemas.string,
  causer_type: schemas.string,
  causer_id: schemas.number,
  properties: schemas.object,
  batch_uuid: schemas.string,
  // insert fields here
}).required();

const updateActivityLogSchema = Joi.object({
  log_name: schemas.string,
  description: schemas.string.required(),
  subject_type: schemas.string,
  subject_id: schemas.number,
  event: schemas.string,
  causer_type: schemas.string,
  causer_id: schemas.number,
  properties: schemas.object,
  batch_uuid: schemas.string,
  // insert fields here
}).required();

export { celebrate, Joi, schemas, createActivityLogSchema, updateActivityLogSchema };
