const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cron = require("node-cron");

const app = express();
const PORT = 3000;

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd";
const URL = "https://coinmarketcap.com/currencies/bitcoin/";


async function getBitcoinPrice() {
    try {
        const response = await axios.get(COINGECKO_API_URL);
        const price = response.data.bitcoin.brl;
        return price;
    } catch (error) {
        console.error("Erro ao obter o preço do Bitcoin:", error.message);
        return null;
    }
}

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

cron.schedule("*/20 * * * * *", async () => {
    const price = await getBitcoinPrice();
    if (price) {
        const message = `🚀 O preço do Bitcoin é USD ${price.toLocaleString("pt-BR", { style: "currency", currency: "USD" })}`;
        await sendTelegramMessage(message);
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});