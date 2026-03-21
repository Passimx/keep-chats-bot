import { ChatTypeEnum } from './chat-type.enum';

export type PrivateChatType = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  type: ChatTypeEnum.PRIVATE;
};

export type GroupChatType = {
  id: number;
  title: string;
  type: ChatTypeEnum.GROUP | ChatTypeEnum.SUPERGROUP | ChatTypeEnum.CHANNEL;
};

export type ChatType = PrivateChatType | GroupChatType;
