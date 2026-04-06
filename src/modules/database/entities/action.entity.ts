import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UpdateType } from '../../telegram/types/update.type';

@Entity({ name: 'actions' })
export class ActionEntity {
  @PrimaryGeneratedColumn('rowid')
  readonly id: string;

  @Column({ name: 'info', type: 'jsonb' })
  readonly info: UpdateType;
}
