import { Sequelize } from 'sequelize-typescript';
import { sequelizeOptions } from '../config';
import * as models from '../models';
/**
 * Sequelize instance initializer
 */
export default async function initSequelize(): Promise<Sequelize> {
  try {
    // Initialize Sequelize instance
    const sequelize = new Sequelize(sequelizeOptions);
    // Register models here
    sequelize.addModels(Object.values(models));
    // Test database connection
    await sequelize.authenticate();

    return sequelize;
  } catch (err) {
    throw new Error(`failed to connect to database. ${err}`);
  }
}
