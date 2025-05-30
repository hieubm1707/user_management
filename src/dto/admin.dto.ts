import { CurrentAdmin } from 'adminjs';
import { UserModel } from '../models';

export const adminDTO = (user: UserModel): CurrentAdmin => {
  const adminDto: CurrentAdmin = {
    id: user.id,
    email: user.email || user.username,
    title: user.fullName,
    avatarUrl: user.image,
  };

  return adminDto;
};
