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
      console.log(`${newChats.length} novos chats registrados com sucesso.`);
    } catch (error) {
      console.error('Erro ao salvar os chats:', error);
    }
  }

  async getAllChats() {
    try {
      const chats = await Chat.find({});
      return chats;
    } catch (error) {
      console.error('Erro ao buscar os chats:', error);
      return [];
    }
  }
}

module.exports = ChatService;