import { User } from '../types';

export type LoginDTO = {
  username: string;
  password: string;
};

export type LoginRes = {
  token: string;
  user: User;
};
