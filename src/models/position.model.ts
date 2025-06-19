import { AllowNull, Column, Comment, CreatedAt, DataType, Default, HasMany, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';
import UserModel from './user.model';

@Table({
  charset: 'utf8',
  collate: 'utf8_general_ci',
  tableName: 'positions',
})
export default class PositionModel extends Model<PositionModel> {
  @PrimaryKey
  @AllowNull(false)
  @Comment('ID of the position')
  @Default(DataType.INTEGER)
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Comment('Name of the position')
  @Column(DataType.ENUM('DIRECTOR', 'MANAGER', 'STAFF', 'INTERN'))
  name!: string;

  @AllowNull(true)
  @Comment('Description of the position')
  @Column(DataType.STRING)
  description?: string;

  @CreatedAt
  @AllowNull(true)
  @Comment("Date and time of the position's creation date")
  @Column({ field: 'createdAt', type: DataType.DATE })
  createdAt?: string;

  @UpdatedAt
  @AllowNull(true)
  @Comment("Date and time of the position's last update")
  @Column({ field: 'updatedAt', type: DataType.DATE })
  updatedAt?: string;

  @HasMany(() => UserModel, {
    foreignKey: 'position_id',
    as: 'users',
  })
  users?: UserModel[];
}
