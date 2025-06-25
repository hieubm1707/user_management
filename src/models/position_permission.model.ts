import { Table, Column, Model, PrimaryKey, AutoIncrement, AllowNull, DataType, ForeignKey, CreatedAt, UpdatedAt } from 'sequelize-typescript';
import PositionModel from './position.model';
import Permission from './permission.model';

@Table({
  tableName: 'position_permissions',
  timestamps: true,
})
export default class PositionPermission extends Model<PositionPermission> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id!: number;

  @ForeignKey(() => PositionModel)
  @AllowNull(false)
  @Column({ field: 'position_id', type: DataType.INTEGER })
  positionId!: number;

  @ForeignKey(() => Permission)
  @AllowNull(false)
  @Column({ field: 'permission_id', type: DataType.INTEGER })
  permissionId!: number;

  @CreatedAt
  @AllowNull(false)
  @Column({ field: 'createdAt', type: DataType.DATE })
  createdAt!: Date;

  @UpdatedAt
  @AllowNull(false)
  @Column({ field: 'updatedAt', type: DataType.DATE })
  updatedAt!: Date;
}
