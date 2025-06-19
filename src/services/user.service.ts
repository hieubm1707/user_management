import { BadRequest, NotFound } from 'http-errors';
import { i18n as I18n } from 'i18next';
import { CreationAttributes } from 'sequelize';
import { Inject, Service } from 'typedi';
import { userDTO } from '../dto';
import { UserModel } from '../models';
import { CreateUserDTO, FilterUserDTO, User } from '../types';
import SalaryModel from '../models/salary.model';
import { Op, Sequelize } from 'sequelize';
import PositionModel from '../models/position.model';
import { validate as isUuid } from 'uuid';
@Service()
export default class UserService {
  @Inject('i18n')
  i18n!: I18n;

  /**
   * Returns the details of a user or throws a `NotFound` error if not found.
   */
  async getUserById(userId: string): Promise<User> {
    const user = await UserModel.findByPk(userId, {
      include: [{ model: PositionModel, as: 'position' }]
    });

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
    // Truy vấn lại user kèm position
    const userWithPosition = await UserModel.findByPk(user.id, {
      include: [{ model: PositionModel, as: 'position' }]
    });
    return userDTO(userWithPosition!);
  }

  /**
   * Returns list users by filtering them.
   */
  async getUsers(filter: FilterUserDTO): Promise<User[]> {
    const where: any = {};
    // Handle search (search by name, username, email)
    if (filter.search && filter.search.trim() !== "") {
      where[Op.or] = [
        // Change fullName to firstName, lastName if DB doesn't have fullName
        { firstName: { [Op.iLike]: `%${filter.search}%` } },
        { lastName: { [Op.iLike]: `%${filter.search}%` } },
        { username: { [Op.iLike]: `%${filter.search}%` } },
        { email: { [Op.iLike]: `%${filter.search}%` } },
        { phone: { [Op.iLike]: `%${filter.search}%` } },
        
      ];
    }
    if (filter.phone && filter.phone.trim() !== "") {
      where.phone = filter.phone;
    }
    if (filter.email && filter.email.trim() !== "") {
      where.email = filter.email;
    }
    if (filter.username && filter.username.trim() !== "") {
      where.username = filter.username;
    }
    if (filter.id && filter.id.trim() !== "") {
      where.id = filter.id;
    }
    if (filter.role && filter.role.trim() !== "") {
      where.role = filter.role;
    }
    if (filter.positionId !== undefined) {
      if (Number(filter.positionId) === 0) {
        where.positionId = null; // Filter users without a position
      } else {
        where.positionId = Number(filter.positionId); // Filter users by specific position
      }
    }

    const users = await UserModel.findAll({
      where,
      include: [
        { model: PositionModel, as: 'position' },
        { model: SalaryModel, as: 'Salaries' }
      ],
    });
    return users.map(userDTO);
  }


  /**
   * Update user by id
   */
  async updateUser(userId: string, updateData: Partial<CreateUserDTO>): Promise<User> {
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw new NotFound(this.i18n.t('errors:userNotFound'));
    }
    await user.update(updateData);
  // Query user again with position included
    const userWithPosition = await UserModel.findByPk(user.id, {
      include: [{ model: PositionModel, as: 'position' }]
    });
    return userDTO(userWithPosition!);
  }


  /**
   * Delete user by id
   */
  async deleteUser(userId: string): Promise<void> {
    const user = await UserModel.findByPk(userId);
    if (!user) {
      throw new NotFound(this.i18n.t('errors:userNotFound'));
    }
    await user.destroy();
  }

  /// //// Add the following methods here ///////
}
