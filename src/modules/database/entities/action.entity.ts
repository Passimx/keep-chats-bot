import { Column, Entity } from 'typeorm';
import { UpdateType } from '../../telegram/types/update.type';

@Entity({ name: 'actions' })
export class ActionEntity {
  @Column({ name: 'info', type: 'jsonb', primary: true })
  readonly info: UpdateType;
}
