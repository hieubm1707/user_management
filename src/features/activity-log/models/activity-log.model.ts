import { Column, CreatedAt, DataType, Index, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table({
  charset: 'utf8',
  collate: 'utf8_general_ci',
  tableName: 'activity_log',
})
export default class ActivityLogModel extends Model<ActivityLogModel> {
  // ─── MODEL ATTRIBUTES ───────────────────────────────────────────────────────────

  @Column({
    primaryKey: true,
    type: DataType.BIGINT,
    allowNull: false,
    unique: true,
    autoIncrement: true,
  })
  @Index({ name: 'activity_log_id_idx', using: 'btree', unique: true })
  id!: number;

  @Column({
    type: DataType.STRING(191),
    allowNull: true,
  })
  @Index({ name: 'activity_log_log_name_idx', using: 'btree', unique: true })
  logName?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.STRING(191),
    allowNull: true,
  })
  @Index({ name: 'activity_log_subject_type_idx', using: 'btree', unique: true })
  subjectType?: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    autoIncrement: false,
  })
  @Index({ name: 'activity_log_subject_id_idx', using: 'btree', unique: true })
  subjectId?: number;

  @Column({
    type: DataType.STRING(191),
    allowNull: true,
  })
  event?: string;

  @Column({
    type: DataType.STRING(191),
    allowNull: true,
  })
  @Index({ name: 'activity_log_causer_type_idx', using: 'btree', unique: true })
  causerType?: string;

  @Column({
    type: DataType.BIGINT,
    allowNull: true,
    autoIncrement: false,
  })
  @Index({ name: 'activity_log_causer_id_idx', using: 'btree', unique: true })
  causerId?: number;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  properties?: object;

  @Column({
    type: DataType.CHAR(36),
    allowNull: true,
  })
  batchUuid?: string;

  @CreatedAt
  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  createdAt?: Date;

  @UpdatedAt
  @Column({
    allowNull: true,
    type: DataType.DATE,
  })
  updatedAt?: Date;

  // insert new model attributes here
}
