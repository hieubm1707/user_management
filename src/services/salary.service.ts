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

    // Nếu có trường search (dù là rỗng), trả về tất cả lương (không filter gì)
    if ('search' in filter) {
      // Không thêm điều kiện gì vào where
    } else {
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
        where.month = filter.month;
      }
      if (filter.year !== undefined && filter.year !== null) {
        where.year = filter.year;
      }
    }

    // Sắp xếp
    let order: [string, 'ASC' | 'DESC'][] = [];
    if (filter.sortBy) {
      order.push([filter.sortBy, filter.sortOrder || 'DESC']);
    } else {
      order = [['year', 'ASC'], ['month', 'ASC']]; // Mặc định sắp xếp theo năm tăng dần, tháng tăng dần
    }

    // Phân trang (nếu cần)
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
}







