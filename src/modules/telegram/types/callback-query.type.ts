import { FromType } from './from.type';
import { MessageType } from './message.type';

export class CallbackQueryType {
  id: number;
  from: FromType;
  message: MessageType;
  chat_instance: number;
  data: string;
}
