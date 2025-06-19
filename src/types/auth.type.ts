import { User } from '../types';

export type LoginDTO = {
  email: string;
  password: string;
};

export type LoginRes = {
  token: string;
  user: User;
};
