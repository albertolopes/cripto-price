const axios = require("axios");
const cheerio = require("cheerio");
const TelegramClient = require("../client/TelegramClient");
const DeepSeekClient = require("../client/DeepSeekClient")
const ChatService = require("./ChatService")

require('dotenv').config({ path: '.env.local' });

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const DEEPSEEK_TOKEN = process.env.DEEPSEEK_TOKEN;
const URL = "https://coinmarketcap.com/currencies/bitcoin/";
const NEWS_URL = "https://coinmarketcap.com/headlines/news/";

const telegramClient = new TelegramClient(TELEGRAM_TOKEN, TELEGRAM_CHAT_ID);
const deepSeekClient = new DeepSeekClient(DEEPSEEK_TOKEN);
const chatService = new ChatService();

class TarefaService {

    constructor() {
    }

    async getBitcoinPrice() {
        try {
            const { data } = await axios.get(URL);
            const $ = cheerio.load(data);
            const priceElement = $('span[data-test="text-cdp-price-display"]');
            return priceElement.text().trim();
        } catch (error) {
            console.error("Erro ao obter o preço do Bitcoin:", error.message);
            return null;
        }
    }

    async getCryptoNewsLinks() {
        try {
            const { data } = await axios.get(NEWS_URL);
            const $ = cheerio.load(data);

            const newsLinks = [];

            $('div.sc-4c05d6ef-0.clJopV a.sc-71024e3e-0.cmc-link').each((index, element) => {
                let link = $(element).attr("href");

                if (link) {
                    if (!link.startsWith("http")) {
                        link = `https://coinmarketcap.com${link}`;
                    }
                    newsLinks.push(link);
                }
            });

            return newsLinks;
        } catch (error) {
            throw new Error(error)
        }
    }

    async getArticleData(url) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            const scriptData = $("#__NEXT_DATA__").html();
            if (!scriptData) {
                console.error("Script JSON não encontrado!");
                return null;
            }

            const jsonData = JSON.parse(scriptData);

            const article = jsonData.props.pageProps.article;

            if (!article) {
                console.error("Dados do artigo não encontrados!");
                return null;
            }

            return {
                title: article.title,
                content: article.content
            };
        } catch (error) {
            throw new Error(error)
        }
    }

    async enviarNoticia() {
        let links = await this.getCryptoNewsLinks();

        let noticia;
        let tentativa = 0;

        do {
            noticia = await this.getArticleData(links[tentativa]);
            tentativa++;

            if (noticia && noticia.content !== undefined && noticia.content !== null) {
                break;
            }

            console.log("Conteúdo inválido ou não encontrado. Tentando novamente...");

            if (tentativa >= links.length) {
                throw new Error("Limite de tentativas atingido");
            }

        } while (true);


        let newsletter = await deepSeekClient.chat({
            model: "deepseek-chat",
            messages: [
                {
                    role: "user",
                    content: "Crie um texto em português do brasil, no estilo newslatter para o Telegram. Deve ser uma rapida leitura, utilize os seguintes dados: " + JSON.stringify(noticia)
                }
            ],
            stream: false
        })

        await this.enviarMensagemTelegram(newsletter.message.content);
    }

    async enviarPreco() {

        let price = await this.getBitcoinPrice();

        const message = `📢 *Atualização do Bitcoin* 🚀\n\n` +
            `💰 *Preço atual:*  ${price.toLocaleString("en-US", { style: "currency", currency: "USD" })}`;

        await this.enviarMensagemTelegram(message);
    }

    async enviarMensagemTelegram(message) {
        let chats = await telegramClient.buscarChats();

        await chatService.saveChats(chats.result);

        let allChats = await chatService.getAllChats();

        const uniqueChatIds = new Set();

        for (const chat of allChats) {
            const chatId = chat.chat_id;
            if (!uniqueChatIds.has(chatId)) {
                uniqueChatIds.add(chatId);
                await telegramClient.sendTelegramMessage(chatId, message);
            }
        }
    }
}

module.exports = TarefaService;
