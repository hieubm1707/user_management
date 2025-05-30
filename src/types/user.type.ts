import { UserRoleEnum } from './enums';

export type User = {
  id: string;
  fullName: string;
  username: string;
  email?: string;
  phone?: string;
  createdAt?: string;
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
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: UserRoleEnum;
  createdAt?: string;
};
