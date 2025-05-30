import { BadRequest, NotFound } from 'http-errors';
import { i18n as I18n } from 'i18next';
import { CreationAttributes } from 'sequelize';
import { Inject, Service } from 'typedi';
import { userDTO } from '../dto';
import { UserModel } from '../models';
import { CreateUserDTO, FilterUserDTO, User } from '../types';
import SalaryModel from '../models/salary.model';

@Service()
export default class UserService {
  @Inject('i18n')
  i18n!: I18n;

  /**
   * Returns the details of a user or throws a `NotFound` error if not found.
   */
  async getUserById(userId: string): Promise<User> {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      throw new NotFound(this.i18n.t('errors:userNotFound'));
    }

    return userDTO(user);
  }

  /**
   * Creates a new user or throws a `BadRequest` error if a user with the same email address already exists.
   */
  async createUser(userDetails: CreateUserDTO): Promise<User> {
    const existingUser = await UserModel.findOne({ where: { username: userDetails.username } });

    if (existingUser) {
      throw new BadRequest(this.i18n.t('errors:emailAlreadyUsed'));
    }
    const user = await UserModel.create(userDetails as CreationAttributes<UserModel>);

    return userDTO(user);
  }

  /**
   * Returns list users by filtering them.
   */

  async getUsers(filter: FilterUserDTO): Promise<User[]> {
    const users = await UserModel.findAll({
      where: filter,
      include: [{
        model: SalaryModel,
        as: 'Salaries',
      }],
    });
    return users.map(userDTO);
  }

  /// //// Add the following methods here ///////
}
