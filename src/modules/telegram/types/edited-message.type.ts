import { MessageType } from './message.type';

export type EditedMessageType = {
  update_id: number;
  edited_message: MessageType;
};
