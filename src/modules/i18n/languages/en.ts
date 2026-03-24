export default {
  start:
    'Welcome! Get started with <b>Keep Chats Bot</b>\nI will help you save chat history from chats where I am added.\n' +
    'I can:\n • export chat',

  description:
    'Save your chat history with Keep Chats Bot.\n\n' +
    'Keep Chats Bot helps protect you from unwanted message or chat deletion.\n\n' +
    'How to connect the bot?\n\n' +
    'Add the bot to a group as a participant, and it will start saving all messages and their edits.',

  short_description:
    'A reliable way to save chat history\n' + '👨‍💻 support - @passimx',

  menu: 'Menu',
  back: 'Back',
  select_action: 'Select an action',
  export_chat: 'Export chat',

  verify_success:
    '<b>✅ Bot successfully connected</b>\n' +
    'Your bot has been successfully linked to the service.\n\n' +
    '<b>🔑 Your API key:</b>\n' +
    '<code>{{token}}</code>\n\n' +
    '──────────────\n\n' +
    '<b>🔐 Security notice</b>\n' +
    'We <b>DO NOT store</b> your Telegram bot token.\n' +
    'For better security, it is recommended to rotate your token via BotFather:\n' +
    '👉 /revoke (in @BotFather)',
};
