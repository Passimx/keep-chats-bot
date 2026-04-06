import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ChatEntity } from '../database/entities/chat.entity';
import { UserEntity } from '../database/entities/user.entity';
import { MessageEntity } from '../database/entities/message.entity';
import { MessageType } from './types/message.type';
import { UpdateType } from './types/update.type';
import { CallbackQueryType } from './types/callback-query.type';
import { FromType } from './types/from.type';
import { ChatType } from './types/chat.type';
import { MyChatMember } from './types/my-chat-member.type';
import { ChatTypeEnum } from './types/chat-type.enum';
import { ActionEntity } from '../database/entities/action.entity';

@Injectable()
export class ActionsService {
  constructor(private readonly em: EntityManager) {}

  public saveAction = async (bot: UserEntity, body: UpdateType) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await this.em.insert(ActionEntity, body);

    if (body.edited_message) await this.onEditMessage(body.edited_message, bot);
    if (body.callback_query)
      await this.onCallbackQuery(body.callback_query, bot);
    if (body.message) await this.onMessage(body.message, bot);
    if (body.my_chat_member) await this.onJoinChat(body.my_chat_member, bot);
  };

  public async exportChat(bot: UserEntity, findOptions: Partial<ChatEntity>) {
    return this.em.findOne(ChatEntity, {
      where: {
        id: findOptions?.id,
        type: findOptions?.type,
        users: [{ id: bot.id }],
      },
      relations: ['messages', 'messages.user'],
      order: { messages: { createdAt: 'ASC', messageId: 'ASC' } },
    });
  }

  private onCallbackQuery = async (
    callback_query: CallbackQueryType,
    bot: UserEntity,
  ) => {
    const { message_id, chat, from, date } = callback_query.message;

    await this.upsertUserChats(chat, from, bot);

    const messageDb = await this.em.findOneOrFail(MessageEntity, {
      where: {
        messageId: message_id,
        chatId: chat.id,
        userId: from.id,
        createdAt: new Date(date * 1000),
      },
    });
    messageDb.info.push({ data: callback_query.data, from });
    await this.em.save(messageDb);
  };

  private onEditMessage = async (message: MessageType, bot: UserEntity) => {
    const { message_id, chat, from, date, ...info } = message;

    await this.upsertUserChats(chat, from, bot);

    const messageDb = await this.em.findOneOrFail(MessageEntity, {
      where: {
        messageId: message_id,
        chatId: chat.id,
        userId: from.id,
        createdAt: new Date(date * 1000),
      },
    });
    messageDb.info.push(info);
    await this.em.save(messageDb);
  };

  private onMessage = async (message: MessageType, bot: UserEntity) => {
    const { message_id, chat, from, date, ...info } = message;

    if (info.reply_to_message) {
      await this.onMessage(info.reply_to_message, bot);
    }

    await this.upsertUserChats(chat, from, bot);

    await this.em.upsert(
      MessageEntity,
      {
        messageId: message_id,
        userId: from.id,
        chatId: message.chat.id,
        createdAt: new Date(date * 1000),
        info: [info],
      },
      { conflictPaths: ['chatId', 'messageId'] },
    );
  };

  private onJoinChat = async (message: MyChatMember, bot: UserEntity) => {
    const { chat, from } = message;
    await this.upsertUserChats(chat, from, bot);
  };

  private async upsertUserChats(
    chat: ChatType,
    from: FromType,
    bot: UserEntity,
  ) {
    await this.em.upsert(
      ChatEntity,
      {
        id: chat.id,
        title: chat.type === ChatTypeEnum.PRIVATE ? chat.username : chat.title,
        type: chat.type,
      },
      { conflictPaths: ['id'] },
    );

    await this.em.upsert(
      UserEntity,
      {
        id: from.id,
        firstName: from.first_name,
        userName: from.username,
        languageCode: from.language_code,
      },
      { conflictPaths: ['id'] },
    );

    await this.em.upsert(
      UserEntity,
      {
        id: bot.id,
        firstName: bot.firstName,
        userName: bot.userName,
        languageCode: bot.languageCode,
      },
      { conflictPaths: ['id'] },
    );

    const chatDb = await this.em.findOneOrFail(ChatEntity, {
      where: { id: chat.id },
      relations: ['users'],
    });

    if (!chatDb.users.find((user) => user.id === bot.id)) {
      const userDb = await this.em.findOneOrFail(UserEntity, {
        where: { id: bot.id },
      });
      chatDb.users.push(userDb);
      await this.em.save(chatDb);
    }

    if (!chatDb.users.find((user) => user.id === from.id)) {
      const userDb = await this.em.findOneOrFail(UserEntity, {
        where: { id: from.id },
      });
      chatDb.users.push(userDb);
      await this.em.save(chatDb);
    }
  }
}
