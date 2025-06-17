// src/services/salary.service.ts
import { Model } from 'sequelize-typescript';
import SalaryModel from '../models/salary.model';
import { Service } from 'typedi';
import { FilterSalaryDTO } from './../types/salary.type';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import UserModel from '../models/user.model';

@Service()
export class SalaryService {
  async getSalaryByUser(userId: string) {
    return SalaryModel.findAll({
      where: { userid: userId },
      order: [['year', 'DESC'], ['month', 'DESC']]
    });
  }

  async getSalaryByMonth(userId: string, year: number, month: number) {
    return SalaryModel.findOne({
      where: { 
        userid: userId,
        year: year,
        month: month
      }
    });
  }

  async createSalary(userId: string, data: { amount: number; month: number; year: number }) {
    // Check if salary already exists for this user, month, and year
    const existed = await SalaryModel.findOne({
      where: { userid: userId, month: data.month, year: data.year }
    });
    if (existed) {
      throw new Error('Salary for this user in this month and year already exists!');
    }
    // If not exists, create new salary
    return SalaryModel.create({
      userid: userId,
      amount: data.amount,
      month: data.month,
      year: data.year
    } as any); // use type assertion to bypass TypeScript check
  }

  async deleteSalary(userId: string, year: number, month: number) {
    const salary = await this.getSalaryByMonth(userId, year, month);
    if (!salary) throw new Error('Salary not found');
    await salary.destroy();
    return true;
  }

  async updateSalary(userId: string, year: number, month: number, data: { amount: number }) {
    const salary = await this.getSalaryByMonth(userId, year, month);
    if (!salary) {
      throw new Error('Salary not found');
    }
    return salary.update({ amount: data.amount });
  }

  async getAllSalaries() {
    return SalaryModel.findAll({
      order: [['year', 'DESC'], ['month', 'DESC']]
    });
  }

  // Filter salary
  async getSalaries(filter: FilterSalaryDTO) {
    const where: any = {};

    if (filter.userId && filter.userId.trim() !== "") {
      where.userid = filter.userId;
    }
    if (filter.minAmount !== undefined && filter.minAmount !== null) {
      where.amount = { ...where.amount, [Op.gte]: filter.minAmount };
    }
    if (filter.maxAmount !== undefined && filter.maxAmount !== null) {
      where.amount = { ...where.amount, [Op.lte]: filter.maxAmount };
    }
    if (filter.month !== undefined && filter.month !== null) {
      if (!filter.year) throw new Error('If month is provided, year must also be provided!');
      where.month = filter.month;
      where.year = filter.year;
    } else if (filter.year !== undefined && filter.year !== null) {
      // If only year is provided, get the whole year
      where.year = filter.year;
    }
    // Handle filter by range
    if (filter.fromMonth && !filter.fromYear) throw new Error('Must provide fromYear if fromMonth is provided!');
    if (filter.toMonth && !filter.toYear) throw new Error('Must provide toYear if toMonth is provided!');

    // If both from and to are provided
    if (
      filter.fromMonth !== undefined && filter.fromYear !== undefined &&
      filter.toMonth !== undefined && filter.toYear !== undefined
    ) {
      where[Op.and] = [
        {
          [Op.or]: [
            { year: { [Op.gt]: filter.fromYear } },
            { year: filter.fromYear, month: { [Op.gte]: filter.fromMonth } }
          ]
        },
        {
          [Op.or]: [
            { year: { [Op.lt]: filter.toYear } },
            { year: filter.toYear, month: { [Op.lte]: filter.toMonth } }
          ]
        }
      ];
    } else if (filter.fromMonth !== undefined && filter.fromYear !== undefined) {
      // If only from is provided => get from that point to the end
      where[Op.or] = [
        { year: { [Op.gt]: filter.fromYear } },
        { year: filter.fromYear, month: { [Op.gte]: filter.fromMonth } }
      ];
    } else if (filter.toMonth !== undefined && filter.toYear !== undefined) {
      // If only to is provided => get from the beginning to that point
      where[Op.or] = [
        { year: { [Op.lt]: filter.toYear } },
        { year: filter.toYear, month: { [Op.lte]: filter.toMonth } }
      ];
    } else if (filter.fromYear !== undefined) {
      // If only fromYear is provided => get from the start of that year to the end
      where.year = { [Op.gte]: filter.fromYear };
    } else if (filter.toYear !== undefined) {
      // If only toYear is provided => get from the beginning to the end of that year
      where.year = { [Op.lte]: filter.toYear };
    }

    // Sorting
    let order: [string, 'ASC' | 'DESC'][] = [];
    if (filter.sortBy) {
      order.push([filter.sortBy, filter.sortOrder || 'DESC']);
    } else {
      order = [['year', 'ASC'], ['month', 'ASC']];
    }

    // Pagination (if needed)
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const offset = (page - 1) * limit;

    const salaries = await SalaryModel.findAll({
      where,
      order,
      limit,
      offset,
    });

    return salaries;
  }

  // Calculate the total salary of a user within a date range
  async getSalarySumByDateRange(params: {
    userId: string;
    fromMonth: number;
    fromYear: number;
    toMonth: number;
    toYear: number;
  }) {
    const { userId, fromMonth, fromYear, toMonth, toYear } = params;
    // Check if user exists
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw new Error('User not found');
    }
    // Where condition for date range
    const where: any = {
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
    };
    // Get salary list in the date range
    const salaries = await SalaryModel.findAll({
      where,
      order: [['year', 'ASC'], ['month', 'ASC']]
    });
    // Calculate total
    const total = salaries.reduce((sum, salary) => sum + salary.amount, 0);
    return {
      userId,
      fromMonth,
      fromYear,
      toMonth,
      toYear,
      total,
      count: salaries.length,
      details: salaries
    };
  }

  // Calculate the total salary of all users within a date range
  async getTotalSalaryByDateRange(fromMonth: number, fromYear: number, toMonth: number, toYear: number) {
    const where: any = {
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
    };
    const salaries = await SalaryModel.findAll({
      where,
      order: [['year', 'ASC'], ['month', 'ASC']]
    });
    const total = salaries.reduce((sum, salary) => sum + salary.amount, 0);
    return total;
  }

  async getUserSalaries(userId: string) {
    try {
      const salaries = await SalaryModel.findAll({
        where: {
          userid: userId
        },
        order: [
          ['year', 'DESC'],
          ['month', 'DESC']
        ]
      });
      return salaries;
    } catch (error) {
      throw error;
    }
  }
}







