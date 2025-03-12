const axios = require("axios");
const TelegramChatDTO = require("../dto/TelegramChatDTO");

require('dotenv').config({ path: '.env.local' });

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const URL = "https://api.telegram.org"

class TelegramClient {
    constructor() {
    }

    async buscarChats() {
        try {
            const response = await axios.get(`${URL}/bot${TELEGRAM_TOKEN}/getUpdates`);
            console.log(response)
            if (response.status === 200) {
                console.log(response)
                console.log("AQUI")
                return new TelegramChatDTO(response.data);
            } else {
                return [];
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async sendTelegramMessage(id, message) {
        const url = `${URL}/bot${TELEGRAM_TOKEN}/sendMessage`;
        try {
            await axios.post(url, {
                chat_id: id ?? TELEGRAM_CHAT_ID,
                text: message,
            });
            console.log("Mensagem enviada com sucesso!");
        } catch (error) {
            console.error("Erro ao enviar mensagem no Telegram:", error.message);
        }
    }
}

module.exports = TelegramClient;