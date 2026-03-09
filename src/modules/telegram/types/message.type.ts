import { FromType } from './from.type';
import { ChatType } from './chat.type';

export type MessageType = {
  message_id: number;
  from: FromType;
  chat: ChatType;
  date: number;
  edit_date?: number;
  reply_to_message?: MessageType;
  left_chat_participant?: FromType;
  left_chat_member?: FromType;
  new_chat_participant?: FromType;
  new_chat_member?: FromType;
  text: string;
};
