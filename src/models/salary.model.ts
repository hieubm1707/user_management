import {
    Table, Column, Model, DataType, ForeignKey, BelongsTo, CreatedAt, UpdatedAt
  } from 'sequelize-typescript';
import UserModel from './user.model';

@Table({ tableName: 'salaries' })
export default class SalaryModel extends Model<SalaryModel> {
  @Column({ type: DataType.UUID, defaultValue: DataType.UUIDV4, primaryKey: true })
  id!: string;

  @Column({ type: DataType.UUID, allowNull: false })
  @ForeignKey(() => UserModel)
  userid!: string;

  @BelongsTo(() => UserModel, {
    foreignKey: 'userid',
    as: 'User'
  })
  user?: any;

  @Column({ type: DataType.FLOAT, allowNull: false })
  amount!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  month!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  year!: number;

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'createdat' })
  createdAt?: Date;

  @UpdatedAt
  @Column({ type: DataType.DATE, field: 'updatedat' })
  updatedAt?: Date;
}