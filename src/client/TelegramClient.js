const axios = require("axios");
const TelegramChatDTO = require("../dto/TelegramChatDTO");

class TelegramClient {
    constructor(token, chatId, apiUrl = "https://api.telegram.org") {
        this.token = token;
        this.chatId = chatId;
        this.apiUrl = apiUrl;
    }

    async buscarChats() {
        try {
            const response = await axios.get(`${this.apiUrl}/bot${this.token}/getUpdates`);
            console.log(response)
            if (response.status === 200) {
                console.log(response)
                console.log("AQUI")
                return new TelegramChatDTO(response.data);
            } else {
                return [];
            }
        } catch (error) {
            console.error('Erro ao fazer a requisição para buscar chats:', error.message)
            throw error + `${this.apiUrl}/bot${this.token}/getUpdates`
            return new TelegramChatDTO();
        }
    }

    async sendTelegramMessage(id, message) {
        const url = `${this.apiUrl}/bot${this.token}/sendMessage`;
        try {
            await axios.post(url, {
                chat_id: id ?? this.chatId,
                text: message,
            });
            console.log("Mensagem enviada com sucesso!");
        } catch (error) {
            console.error("Erro ao enviar mensagem no Telegram:", error.message);
        }
    }
}

module.exports = TelegramClient;