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