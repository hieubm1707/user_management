import bcrypt from 'bcryptjs';
import { BadRequest } from 'http-errors';
import { i18n as I18n } from 'i18next';
import { Op, Transaction } from 'sequelize';
import {
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
  Column,
  Comment,
  CreatedAt,
  DataType,
  Default,
  DefaultScope,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt,
  HasMany,
  BelongsTo,
  ForeignKey,
} from 'sequelize-typescript';
import { Container } from 'typedi';
import { UserRoleEnum } from '../types/enums';
import { generateSignedJWT } from '../utils';
import PositionModel from './position.model';

@DefaultScope(() => ({
  attributes: {
    exclude: ['password'],
  }
}))
@Table({
  charset: 'utf8',
  collate: 'utf8_general_ci',
  tableName: 'users',
})
export default class UserModel extends Model<UserModel> {
  //
  // ─── MODEL ATTRIBUTES ───────────────────────────────────────────────────────────
  //

  @PrimaryKey
  @AllowNull(false)
  @Comment('ID of the user')
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id!: string;

  @AllowNull(false)
  @Comment('First name of the user')
  @Column(DataType.STRING(64))
  firstName!: string;

  @AllowNull(false)
  @Comment('Last name of the user')
  @Column(DataType.STRING(64))
  lastName!: string;

  @AllowNull(false)
  @Unique
  @Comment('Email of the user')
  @Column(DataType.STRING(128))
  email!: string;

  @AllowNull(true)
  @Comment('phone of the user')
  @Column(DataType.STRING(64))
  phone?: string;

  @Unique
  @AllowNull(false)
  @Comment('username of the user')
  @Column(DataType.STRING(64))
  username!: string;

  @AllowNull(false)
  @Comment('Password of the user')
  @Column(DataType.STRING(64))
  password!: string;

  @AllowNull(false)
  @Comment('User role')
  @Default(UserRoleEnum.User)
  @Column(DataType.ENUM(...Object.values(UserRoleEnum)))
  role!: UserRoleEnum;

  @AllowNull(true)
  @Comment('Image of the user')
  @Column(DataType.TEXT)
  image?: string;

  @CreatedAt
  @AllowNull(true)
  @Comment("Date and time of the user's creation date")
  @Column(DataType.DATE)
  createdAt?: string;

  @UpdatedAt
  @AllowNull(true)
  @Comment("Date and time of the user's last update")
  @Column(DataType.DATE)
  updatedAt?: string;

  @AllowNull(true)
  @Comment('Position ID')
  @ForeignKey(() => PositionModel)
  @Column({ field: 'position_id', type: DataType.INTEGER })
  positionId?: number;

  @BelongsTo(() => PositionModel, { foreignKey: 'positionId', as: 'position' })
  position?: PositionModel;
  
  
  @HasMany(() => require('./salary.model').default, { 
    foreignKey: 'userid',
    as: 'Salaries'
  })
  Salaries?: any[];

  //
  // ─── VIRTUAL ATTRIBUTES ─────────────────────────────────────────────────────────
  //

  @Column(DataType.VIRTUAL)
  get fullName(): string {
    return `${this.getDataValue('firstName')} ${this.getDataValue('lastName')}`;
  }

  @Column(DataType.VIRTUAL)
  get salary(): number | null {
    if (!this.Salaries || this.Salaries.length === 0) {
      return null;
    }
    const sorted = [...this.Salaries].sort((a, b) =>
      (b.createdAt && a.createdAt ? b.createdAt.getTime() - a.createdAt.getTime() : 0)
    );
    return sorted[0]?.amount || null;
  }

  //
  // ─── MODEL HOOKS ────────────────────────────────────────────────────────────────
  //

  @BeforeCreate
  @BeforeUpdate
  static async checkUsernameUniqueness(
    user: UserModel,
    options?: { transaction?: Transaction },
  ): Promise<void> {
    const i18n = Container.get<I18n>('i18n');

    if (user.changed('username')) {
      const username = user.getDataValue('username');
      const usernameCount = await UserModel.count({
        where: {
          id: { [Op.ne]: user.id },
          username,
        },
        transaction: options?.transaction,
      });

      if (usernameCount > 0) {
        throw new BadRequest(i18n.t('errors:usernameAlreadyUsed'));
      }
    }
  }

  @BeforeCreate
  @BeforeUpdate
  static async hashPassword(user: UserModel): Promise<void> {
    if (user.changed('password')) {
      const password = user.getDataValue('password');
      const hash = await UserModel.generateHash(password);

      user.password = hash;
    }
  }

  //
  // ─── CUSTOM METHODS ─────────────────────────────────────────────────────────────
  //

  /**
   * Returns a hashed version of the given `password`.
   */
  static async generateHash(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  /**
   * Returns `true` if `password` matches the user's password, `false` otherwise.
   */
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  /**
   * Returns a new JWT for this user.
   */
  async generateJWT(transaction?: Transaction): Promise<string> {
    const user = await UserModel.findByPk(this.id, {
      attributes: {
        include: ['id', 'username', 'password', 'email', 'phone', 'role', 'fullName'],
      },
      transaction,
    });

    if (!user) {
      throw new Error(`User not found with id '${this.id}'`);
    }

    return generateSignedJWT(user.id, user.password, {
      name: user.fullName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  }
}
