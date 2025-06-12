import { User } from './user.type';

export type Salary = {
  id: string;
  userid: string;
  amount: number;
  month: number;
  year: number;
  user?: User;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateSalaryDTO ={
  amount: number;
  month: number;
  year: number;
};

export type ErrorResponse = {
  error: string;
}; 

export type FilterSalaryDTO = {
  search?: string;
  minAmount?: number;
  maxAmount?: number;
  month?: number;
  year?: number;
  userId?: string;
  sortBy?: 'amount' | 'month' | 'year' | 'createdAt';
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
  fromMonth?: number;
  fromYear?: number;
  toMonth?: number;
  toYear?: number;
};

export type SalarySumFilterDTO = {
  userId: string;
  fromMonth: number;
  fromYear: number;
  toMonth: number;
  toYear: number;
};

