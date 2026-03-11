export type PrivateChatType = {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  type: 'private';
};

export type GroupChatType = {
  id: number;
  title: string;
  type: 'group' | 'supergroup' | 'channel';
};

export type ChatType = PrivateChatType | GroupChatType;
