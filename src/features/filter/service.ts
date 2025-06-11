import { Op } from 'sequelize';
import UserModel from '../../models/user.model';
import SalaryModel from '../../models/salary.model';
import { FilterDto } from './dto';

export async function filterSalaries(query: Partial<FilterDto>) {
  try {
    const { search, minAmount, maxAmount, month, year, userId, sortBy, sortOrder } = query;

    // Where clause for Salary
    const salaryWhere: any = {};
    if (minAmount !== undefined && minAmount !== null && String(minAmount).trim() !== '' && !isNaN(Number(minAmount))) {
      salaryWhere.amount = { ...salaryWhere.amount, [Op.gte]: Number(minAmount) };
    }
    if (maxAmount !== undefined && maxAmount !== null && String(maxAmount).trim() !== '' && !isNaN(Number(maxAmount))) {
      salaryWhere.amount = { ...salaryWhere.amount, [Op.lte]: Number(maxAmount) };
    }
    if (month !== undefined && month !== null && String(month).trim() !== '' && !isNaN(Number(month))) {
      salaryWhere.month = Number(month);
    }
    if (year !== undefined && year !== null && String(year).trim() !== '' && !isNaN(Number(year))) {
      salaryWhere.year = Number(year);
    }
    if (userId !== undefined && userId !== null && String(userId).trim() !== '') {
      salaryWhere.userid = userId; // FIX userId to userid
    }

    // Where clause for User
    const userWhere: any = search && String(search).trim() !== ''
      ? {
          [Op.or]: [
            { firstName: { [Op.like]: `%${search}%` } },
            { lastName: { [Op.like]: `%${search}%` } },
            { username: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
          ],
        }
      : undefined;

    // Pagination
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const offset = (page - 1) * limit;

    // Query
    const { rows, count } = await UserModel.findAndCountAll({
      where: userWhere,
      attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
      include: [
        {
          model: SalaryModel,
          as: 'Salaries',
          where: Object.keys(salaryWhere).length > 0 ? salaryWhere : undefined,
          attributes: ['userid', 'amount', 'month', 'year', 'createdAt', 'updatedAt'], 
          required: true,
        },
      ],
      order: [[{ model: SalaryModel, as: 'Salaries' }, sortBy || 'createdAt', sortOrder || 'DESC']],
      limit,
      offset,
    });

    return { data: rows.map(user => user.toJSON()), total: count };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`Error while filtering salaries: ${errorMessage}`);
    throw new Error('Error while filtering salaries');
  }
}