const axios = require("axios");
const cheerio = require("cheerio");
const TelegramClient = require("../client/TelegramClient");

require('dotenv').config({ path: '.env.local' });

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const URL = "https://coinmarketcap.com/currencies/bitcoin/";

const telegramClient = new TelegramClient(TELEGRAM_TOKEN, TELEGRAM_CHAT_ID);

class ScheduleService {

    constructor() {
    }

    async getBitcoinPrice() {
        try {
            const { data } = await axios.get(URL);
            const $ = cheerio.load(data);
            const priceElement = $('span[data-test="text-cdp-price-display"]');
            const price = priceElement.text().trim();
            return price;
        } catch (error) {
            console.error("Erro ao obter o preço do Bitcoin:", error.message);
            return null;
        }
    }


    Copy
    async enviarNotificacao() {
        let chats = await telegramClient.buscarChats();

        const uniqueChatIds = new Set();

        for (const chat of chats.result) {
            const chatId = chat.message.chat.id;

            if (!uniqueChatIds.has(chatId)) {
                uniqueChatIds.add(chatId);

                const price = await this.getBitcoinPrice();
                if (price) {
                    const message = `📢 *Atualização do Bitcoin* 🚀\n\n` +
                        `💰 *Preço atual:*  ${price.toLocaleString("en-US", { style: "currency", currency: "USD" })}`;

                    await telegramClient.sendTelegramMessage(chatId, message);
                }
            }
        }
    }
}

module.exports = ScheduleService;
