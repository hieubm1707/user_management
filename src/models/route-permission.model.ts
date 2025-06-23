import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table({
  tableName: 'route_permissions',
  timestamps: true,
  underscored: true,
})
export class RoutePermissionModel extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    comment: 'HTTP method + route path (e.g., GET /users)',
  })
  route!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    comment: 'Name of the permission required for this route',
  })
  permissionName!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    comment: 'Description of what this route does',
  })
  description?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    comment: 'Whether this route permission mapping is active',
  })
  isActive!: boolean;

  @CreatedAt
  createdAt!: Date;

  @UpdatedAt
  updatedAt!: Date;
}

export default RoutePermissionModel; 