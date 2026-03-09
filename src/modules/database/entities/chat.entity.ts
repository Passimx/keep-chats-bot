import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { MessageEntity } from './message.entity';

@Entity({ name: 'chats' })
export class ChatEntity {
  @Column({ name: 'id', type: 'varchar', primary: true, length: 2 ** 4 })
  readonly id: number;

  @Column({ name: 'title', type: 'varchar', length: 2 ** 7 })
  readonly title: string;

  @Column({ name: 'type', type: 'varchar', length: 2 ** 4 })
  readonly type: 'group' | 'private' | 'supergroup';

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt: Date;

  @ManyToMany(() => UserEntity, (user) => user.chats)
  readonly users: UserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.chat)
  readonly messages: MessageEntity[];
}
