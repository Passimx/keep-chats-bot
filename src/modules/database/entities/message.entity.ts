import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { ChatEntity } from './chat.entity';
import { MessageEditHistoryEntity } from './message-edit-history.entity';

@Entity({ name: 'messages' })
export class MessageEntity {
  @Column({ name: 'id', type: 'varchar', primary: true, length: 2 ** 4 })
  readonly id: number;

  @Column({ name: 'text', type: 'varchar', length: 2 ** 10 })
  readonly text: string;

  @Column({ name: 'user_id', type: 'bigint' })
  readonly userId: number;

  @Column({ name: 'chat_id', type: 'varchar', length: 2 ** 4 })
  readonly chatId: number;

  @Column({
    name: 'reply_to_message_id',
    type: 'varchar',
    length: 2 ** 4,
    nullable: true,
  })
  readonly replyToMessageId: number;

  @Column({ name: 'created_at', type: 'timestamptz' })
  readonly createdAt: Date;

  @Column({ name: 'edit_date', type: 'timestamptz', nullable: true })
  readonly editDate: Date;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  readonly user: UserEntity;

  @ManyToOne(() => ChatEntity, (chat) => chat.messages)
  @JoinColumn({ name: 'chat_id' })
  readonly chat: ChatEntity;

  @ManyToOne(() => MessageEntity)
  @JoinColumn({ name: 'reply_to_message_id' })
  readonly replyToMessage: MessageEntity;

  @OneToMany(
    () => MessageEditHistoryEntity,
    (messageEditHistory) => messageEditHistory.message,
  )
  readonly messageEditHistories: MessageEditHistoryEntity[];
}
