import AdminJSSequelize from '@adminjs/sequelize';
import AdminJS, { CurrentAdmin } from 'adminjs';
import { Sequelize } from 'sequelize';
import { Container } from 'typedi';
import { Config } from '../config';
import { adminDTO } from '../dto';
import { UserModel } from '../models';
import { UserRoleEnum } from '../types/enums';
import { componentLoader } from './components';
import * as translations from './locale';
import * as resources from './resources';

// Register Sequelize adapter
AdminJS.registerAdapter(AdminJSSequelize);

export const menu = {
  users: {
    name: 'Users',
    icon: 'UserMultiple',
  },
  // insert menu here
};

export async function authenticateAdmin(
  username: string,
  password: string,
): Promise<CurrentAdmin | null> {
  const user = await UserModel.findOne({
    attributes: {
      include: ['username', 'email', 'phone', 'fullName', 'password', 'role'],
    },
    where: {
      username,
      role: UserRoleEnum.Admin,
    },
  });

  if (!user) return null;

  const passwordMatch = await user.comparePassword(password);

  if (!passwordMatch) return null;

  return adminDTO(user);
}

export default function setupAdminJs(sequelize: Sequelize) {
  const config = Container.get<Config>('config');

  const adminJs = new AdminJS({
    assets: {
      styles: ['/public/styles/admin.css'],
    },
    branding: {
      companyName: 'voucher rest api | Admin',
      favicon: '/public/favicon.ico',
    },
    componentLoader,
    locale: translations.en,
    resources: Object.values(resources).map(resource => resource(sequelize)),
    rootPath: '/admin',
    settings: {
      defaultPerPage: 20,
    },
    version: {
      admin: true,
      app: config.version,
    },
  });

  return adminJs;
}
