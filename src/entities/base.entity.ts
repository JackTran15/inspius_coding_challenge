import { BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';

export class _BaseEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created: Date;
  @Column({ type: 'varchar', length: 255, default: 'Admin' })
  createdBy: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated: Date;
  @Column({ type: 'varchar', length: 255, default: 'Admin' })
  updatedBy: string;
}
