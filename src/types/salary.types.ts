// src/types/salary.types.ts

export interface CreateSalaryDTO {
    amount: number;
    month: number;
    year: number;
  }
  
  export interface UpdateSalaryDTO {
    amount: number;
  }
  
  export interface SalaryData {
    id: string;
    userid: string;
    amount: number;
    month: number;
    year: number;
    createdAt?: Date;
    updatedAt?: Date;
  }