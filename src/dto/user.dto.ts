import { UserModel } from '../models';
import { User, AuthUser } from '../types';
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

// Function to map from AuthUser (req.auth) to User with full fields
export const mapUserAuthToDTO = (user: AuthUser): User => ({
  id: user.id,
  fullName: (user as any).fullName || user.username || '',
  username: user.username,
  email: user.email || '',
  phone: user.phone || '',
  createdAt: '',
  position: '',
  salary: []
});
