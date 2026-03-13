import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { ChatEntity } from './chat.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @Column({
    name: 'id',
    type: 'bigint',
    primary: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number(value),
    },
  })
  readonly id: number;

  @Column({
    name: 'user_name',
    type: 'varchar',
    nullable: true,
  })
  readonly userName?: string;

  @Column({
    name: 'language_code',
    type: 'varchar',
    length: 2 ** 4,
    default: 'ru',
    nullable: true,
  })
  readonly languageCode?: string;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt: Date;

  @ManyToMany(() => ChatEntity, (chat) => chat.users)
  @JoinTable({
    name: 'users_chats',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'chat_id', referencedColumnName: 'id' },
  })
  readonly chats: ChatEntity[];
}
