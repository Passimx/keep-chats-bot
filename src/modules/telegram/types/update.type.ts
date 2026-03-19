import { MessageType } from './message.type';
import { CallbackQueryType } from './callback-query.type';
import { IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { MyChatMember } from './my-chat-member.type';

export class UpdateType {
  @IsOptional()
  readonly update_id: number;

  @IsOptional()
  @Type(() => MessageType)
  readonly message?: MessageType;

  @IsOptional()
  @Type(() => MessageType)
  readonly edited_message?: MessageType;

  @IsOptional()
  @Type(() => CallbackQueryType)
  readonly callback_query?: CallbackQueryType;

  @IsOptional()
  @Type(() => MyChatMember)
  readonly my_chat_member?: MyChatMember;
}
