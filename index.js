const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = 3000;

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const URL = "https://coinmarketcap.com/currencies/bitcoin/";

async function sendTelegramMessage(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
    try {
        await axios.post(url, {
            chat_id: TELEGRAM_CHAT_ID,
            text: message,
        });
        console.log("Mensagem enviada com sucesso!");
    } catch (error) {
        console.error("Erro ao enviar mensagem no Telegram:", error.message);
    }
}

async function getBitcoinPrice() {
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

(async () => {
    const price = await getBitcoinPrice();
    if (price) {
        const message = `📢 *Atualização do Bitcoin* 🚀\n\n` +
            `💰 *Preço atual:*  ${price.toLocaleString("en-US", { style: "currency", currency: "USD" })}\n\n` +
            `📊 Atualizado a cada 30 minutos.`;
        await sendTelegramMessage(message);
    }
})();

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
