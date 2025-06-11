import { UserModel } from '../models';
import { User } from '../types';
import { hidePhone } from '../utils';

export const userDTO = (user: UserModel): User => {
  const userDto: any = {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    email: user.email,
    phone: hidePhone(user.phone),
    createdAt: user.createdAt,
    salary: user.salary,
    position: user.position ? user.position.name : null,
    
  };

  return userDto;
};
