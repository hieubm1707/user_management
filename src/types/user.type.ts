import { UserRoleEnum } from './enums';

export type User = {
  id: string;
  fullName: string;
  username: string;
  email?: string;
  phone?: string;
  createdAt?: string;
  position?: string | null;
  salary?: any[];
};

export type CreateUserDTO = {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role?: UserRoleEnum;
  email?: string;
  phone?: string;
};

export type FilterUserDTO = {
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  email?: string;
  role?: UserRoleEnum;
  createdAt?: string;
  search?: string;
  positionId?: string | undefined;
};

// Response DTOs
export type UserResponseDTO = {
  success: boolean;
  data: User;
  message?: string;
};

export type UsersResponseDTO = {
  success: boolean;
  data: User[];
  message?: string;
  total?: number;
};

export type UpdateUserResponseDTO = {
  success: boolean;
  data: User;
  message: string;
};

export type DeleteUserResponseDTO = {
  success: boolean;
  message: string;
};

export interface SumSalaryDTO {
  userId: string;
  fromMonth?: number;
  fromYear?: number;
  toMonth?: number;
  toYear?: number;
}