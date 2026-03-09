import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { MessageEntity } from './message.entity';

@Entity({ name: 'message_edit_histories' })
export class MessageEditHistoryEntity {
  @Column({ name: 'text', type: 'varchar', length: 2 ** 10 })
  readonly text: string;

  @Column({
    name: 'message_id',
    type: 'varchar',
    primary: true,
    length: 2 ** 4,
  })
  readonly messageId: number;

  @CreateDateColumn({ name: 'edit_date', primary: true })
  readonly editDate: Date;

  @ManyToOne(() => MessageEntity)
  @JoinColumn({ name: 'message_id' })
  readonly message: MessageEntity;
}
