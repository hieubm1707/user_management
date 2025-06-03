// src/services/salary.service.ts
import { Model } from 'sequelize-typescript';
import SalaryModel from '../models/salary.model';
import { Service } from 'typedi';

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
}   
