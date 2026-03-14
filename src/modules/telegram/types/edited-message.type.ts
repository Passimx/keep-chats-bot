import { MessageType } from './message.type';
import { CallbackQueryType } from './callback-query.type';

export type EditedMessageType = {
  update_id: number;
  edited_message?: MessageType;
  callback_query?: CallbackQueryType;
};
