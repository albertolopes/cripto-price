const Chat = require('../db/Chat');

class ChatService {

  constructor() {
  }

  async saveChats(chats) {
    try {
      const chatData = chats
          .filter(chat => chat.message && chat.message.chat)
          .map(chat => ({
            chat_id: chat.message.chat.id,
            service: 'TELEGRAM',
            username: chat.message.chat.username || null,
            first_name: chat.message.chat.first_name || null,
            last_name: chat.message.chat.last_name || null
          }));

      if (chatData.length === 0) {
        console.log('Nenhum chat válido encontrado.');
        return;
      }

      const chatIds = chatData.map(chat => chat.chat_id);
      const existingChats = await Chat.find({ chat_id: { $in: chatIds } });
      const existingChatIds = new Set(existingChats.map(chat => chat.chat_id));

      const newChats = chatData.filter(chat => !existingChatIds.has(chat.chat_id));

      if (newChats.length === 0) {
        console.log('Nenhum novo chat para salvar.');
        return;
      }

      await Chat.insertMany(newChats);
    } catch (error) {
      throw new Error(error)
    }
  }

  async getAllChats() {
    try {
      return await Chat.find({}).exec();
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = ChatService;
