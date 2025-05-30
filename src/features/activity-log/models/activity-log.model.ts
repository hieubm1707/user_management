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
    type: DataType.UUID,
    allowNull: false,
    unique: true,
    field: 'id',
    defaultValue: DataType.UUIDV4,
  })
  @Index({ name: 'activity_log_id_idx', using: 'btree', unique: true })
  id!: string;

  @Column({
    type: DataType.STRING(191),
    allowNull: true,
    field: 'log_name',
  })
  @Index({ name: 'activity_log_log_name_idx', using: 'btree' })
  logName?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    field: 'description',
  })
  description!: string;

  @Column({
    type: DataType.STRING(191),
    allowNull: true,
    field: 'subject_type',
  })
  @Index({ name: 'activity_log_subject_type_idx', using: 'btree' })
  subjectType?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'subject_id',
  })
  @Index({ name: 'activity_log_subject_id_idx', using: 'btree' })
  subjectId?: string;

  @Column({
    type: DataType.STRING(191),
    allowNull: true,
    field: 'event',
  })
  event?: string;

  @Column({
    type: DataType.STRING(191),
    allowNull: true,
    field: 'causer_type',
  })
  @Index({ name: 'activity_log_causer_type_idx', using: 'btree' })
  causerType?: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
    field: 'causer_id',
  })
  @Index({ name: 'activity_log_causer_id_idx', using: 'btree' })
  causerId?: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
    field: 'properties',
  })
  properties?: object;

  @Column({
    type: DataType.CHAR(36),
    allowNull: true,
    field: 'batch_uuid',
  })
  batchUuid?: string;

  @CreatedAt
  @Column({
    allowNull: false,
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt?: Date;

  @UpdatedAt
  @Column({
    allowNull: false,
    type: DataType.DATE,
    field: 'updated_at',
  })
  updatedAt?: Date;

  // insert new model attributes here
}
