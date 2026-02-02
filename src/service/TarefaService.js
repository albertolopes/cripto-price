const axios = require("axios");
const cheerio = require("cheerio");
const TelegramClient = require("../client/TelegramClient");
const DeepSeekClient = require("../client/DeepSeekClient")
const ChatService = require("./ChatService")
const TwitterClient = require("../client/TwitterClient")
const NoticiaService = require("./NoticiaService")

require('dotenv').config({ path: '.env.local' });

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const DEEPSEEK_TOKEN = process.env.DEEPSEEK_TOKEN;
const URL_BITCOIN = "https://coinmarketcap.com/currencies/bitcoin/";
const URL_SOLANA = "https://coinmarketcap.com/currencies/solana/";
const URL_ETH = "https://coinmarketcap.com/currencies/ethereum/";
const NEWS_URL = "https://coinmarketcap.com/headlines/news/";

const telegramClient = new TelegramClient(TELEGRAM_TOKEN, TELEGRAM_CHAT_ID);
const deepSeekClient = new DeepSeekClient(DEEPSEEK_TOKEN);
const chatService = new ChatService();
const twitterClient = new TwitterClient();
const noticiaService = new NoticiaService();

class TarefaService {

    constructor() {
    }

    async getTrendingCryptos() {
        const url = "https://coinmarketcap.com/trending-cryptocurrencies/";

        try {
            const { data } = await axios.get(url, {
                headers: { "User-Agent": "Mozilla/5.0" }
            });

            const $ = cheerio.load(data);
            const rows = $("tbody tr");
            const result = [];

            rows.each((_, el) => {
                const tds = $(el).find("td");

                // Nome: primeiro <p> dentro do td[2]
                const name = tds.eq(2).find("p").first().text().trim();

                // Símbolo: <p> com a classe .coin-item-symbol dentro do td[2]
                const symbol = tds.eq(2).find("p.coin-item-symbol").text().trim();

                // Preço: pegar texto limpo no td[3]
                const price = tds.eq(3).text().replace(/\s/g, '').trim();

                result.push({ name, symbol, price });
            });

            return result;
        } catch (err) {
            console.error("Erro ao buscar criptomoedas:", err.message);
            throw err;
        }
    }

    async getBitcoinPrice(url) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const priceElement = $('span[data-test="text-cdp-price-display"]');
            return priceElement.text().trim();
        } catch (error) {
            throw new Error("Erro ao obter o preço do Bitcoin: " + error.message);

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
                new Error("Script JSON não encontrado!");
            }

            const jsonData = JSON.parse(scriptData);

            const article = jsonData.props.pageProps.article;

            if (!article)
                new Error("Dados do artigo não encontrados!");

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

        let deepseek = await deepSeekClient.chat({
            model: "deepseek-chat",
            messages: [
                {
                    role: "user",
                    content: "Crie um texto em português do brasil, no estilo newsletter para o Telegram e texto para um site de noticias sem limite de caracteres e um texto com 300 caracteres para um tweet. " +
                        "Retorne com o formato \"TELEGRAM: texto para a newsletter\n" +
                        "TWEET: texto para o tweet\n WEB: textos maiores sem imagens" +
                        "Deve ser uma rapida leitura, utilize os seguintes dados: " + JSON.stringify(noticia)
                }
            ],
            stream: false
        })

        const regex = /\*\*TELEGRAM:\*\*\s*([\s\S]*?)\n\*\*TWEET:\*\*\s*([\s\S]*?)\n\*\*WEB:\*\*\s*([\s\S]*)/;
        const match = deepseek.message.content.match(regex);

        if (match) {
            await noticiaService.salvarNoticiaDoMatch(match, links[tentativa])
            const telegramContent = match[1].trim();
            const tweetContent = match[2].trim();

            await this.enviarMensagemTelegram(telegramContent);
            await twitterClient.tweet(tweetContent);

        } else {
            throw new Error("Não foi possível extrair os textos do deepseek.");
        }
    }

    async enviarTweet(){
        try{
            throw new Error("Não foi possível extrair os textos do deepseek.");
        } catch (e) {
            await twitterClient.tweet("Teste");
        }

    }

    async enviarPreco() {

        let priceBitcoin = await this.getBitcoinPrice(URL_BITCOIN);
        let priceSolana = await this.getBitcoinPrice(URL_SOLANA);
        let priceEth = await this.getBitcoinPrice(URL_ETH);

        const message = `📢 *Atualizações do mercado cripto* 🚀\n\n` +
            `💰 *Preço Bitcoin:*  ${priceBitcoin.toLocaleString("en-US", { style: "currency", currency: "USD" })} \n\n` +
            `💰 *Preço Solana:*  ${priceSolana.toLocaleString("en-US", { style: "currency", currency: "USD" })} \n\n`+
            `💰 *Preço Ethereum:*  ${priceEth.toLocaleString("en-US", { style: "currency", currency: "USD" })} `;

        await this.enviarMensagemTelegram(message);
    }

    async buscarChats(){
        return await chatService.getAllChats();
    }

    async enviarMensagemTelegram(message) {
        let chats = await telegramClient.buscarChats();

        await chatService.saveChats(chats.result);

        let allChats = await chatService.getAllChats();

        const uniqueChatIds = new Set();
        const inativeChats = [];

        for (const chat of allChats) {
            const chatId = chat.chat_id;
            if (!uniqueChatIds.has(chatId)) {
                uniqueChatIds.add(chatId);
                const result = await telegramClient.sendTelegramMessage(chatId, message);

                if (result && result.reason === "blocked")
                    inativeChats.push({ chat_id: chatId, active: false });

            }
        }

        if (inativeChats.length > 0)
            await chatService.saveChats(inativeChats);
    }
}

module.exports = TarefaService;
