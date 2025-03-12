const axios = require("axios");
const cheerio = require("cheerio");
const TelegramClient = require("../client/TelegramClient");
const DeepSeekClient = require("../client/DeepSeekClient")

require('dotenv').config({ path: '.env.local' });

const URL = "https://coinmarketcap.com/currencies/bitcoin/";
const NEWS_URL = "https://coinmarketcap.com/headlines/news/";

const telegramClient = new TelegramClient();
const deepSeekClient = new DeepSeekClient();

class TarefaService {

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
            console.error("Erro ao obter os links das notícias:", error.message);
            return [];
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
            console.error("Erro ao obter os dados do artigo:", error.message);
            return null;
        }
    }

    async enviarNoticia() {
        let links = await this.getCryptoNewsLinks();

        let noticia = await this.getArticleData(links[0]);

        do{
            noticia = await this.getArticleData(links[0]);
        }
        while (noticia.content === undefined);


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

    async enviarMensagemTelegram(message){
        let chats = await telegramClient.buscarChats();

        const uniqueChatIds = new Set();

        for (const chat of chats.result) {

            if(chat.message != null){
                const chatId = chat.message.chat.id;
                if (!uniqueChatIds.has(chatId)) {
                    uniqueChatIds.add(chatId);
                    await telegramClient.sendTelegramMessage(chatId, message);
                }
            }
        }
    }
}

module.exports = TarefaService;
