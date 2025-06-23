import  SalaryModel  from '../models/salary.model'
import { Salary } from '../types';

export const salaryDTO = (salary: SalaryModel): Salary =>  {
    const salaryDto: any = {
      id: salary.id,
      userid: salary.userid,
      amount: salary.amount,
      month: salary.month,
      year: salary.year,
      // insert other required fields here
    };
    return salaryDto;
  };
