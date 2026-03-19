import { ChatType } from './chat.type';
import { FromType } from './from.type';
import { MemberType } from './member.type';

export class MyChatMember {
  chat: ChatType;
  from: FromType;
  date: number;
  old_chat_member: MemberType;
  new_chat_member: MemberType;
}
