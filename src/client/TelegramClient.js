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
            if (response.status === 200 && response.data.ok) {
                console.log('Dados recebidos:', response.data.result);

                return new TelegramChatDTO(response.data);
            } else {
                console.log('Resposta inválida:', response.data);
                return [];
            }
        } catch (error) {
            console.error('Erro ao fazer a requisição para buscar chats:', error.message);
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