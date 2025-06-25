import { AutoIncrement, AllowNull, Column, DataType, Model, PrimaryKey, Table, CreatedAt, UpdatedAt, Unique } from 'sequelize-typescript';


@Table({
  tableName: 'permission',
  timestamps: true, 
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export default class Permission extends Model<Permission> {
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column(DataType.INTEGER)
  id!: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  name!: string;

  @AllowNull(true)
  @Column(DataType.STRING)
  description?: string;

  @CreatedAt
  @Column({ field: 'created_at', type: DataType.DATE })
  createdAt?: Date;

  @UpdatedAt
  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt?: Date;
}