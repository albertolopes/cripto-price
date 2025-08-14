const express = require("express");
const ScheduleService = require("../service/TarefaService");
const NoticiaService = require("../service/NoticiaService");
const AcessoService = require("../service/AcessoService");

const router = express.Router();
const scheduleService = new ScheduleService();
const noticiaService = new NoticiaService();
const acessoService = new AcessoService();

/**
 * @swagger
 * /tweet:
 *   get:
 *     summary: Executa a tarefa de envio de tweet
 *     description: Dispara manualmente a tarefa agendada de envio de tweet.
 *     tags: [Tarefas]
 *     responses:
 *       200:
 *         description: Tarefa de tweet executada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro ao executar a tarefa de tweet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/tweet", async (req, res) => {
    try {
        await scheduleService.enviarTweet();
        res
            .status(200)
            .json({ message: "Tarefa de noticias executada com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao executar a tarefa de noticias:" + error} );
    }
});

/**
 * @swagger
 * /noticia:
 *   get:
 *     summary: Executa a tarefa de envio de notícias
 *     description: Dispara manualmente a tarefa agendada de envio de notícias.
 *     tags: [Tarefas]
 *     responses:
 *       200:
 *         description: Tarefa de notícias executada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro ao executar a tarefa de notícias
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/noticia", async (req, res) => {
    try {
        await scheduleService.enviarNoticia();
        res
            .status(200)
            .json({ message: "Tarefa de noticias executada com sucesso!" });
    } catch (error) {
        res.status(500).send({ message: "Erro ao executar a tarefa de noticias:" + error} );
    }
});

/**
 * @swagger
 * /preco:
 *   get:
 *     summary: Executa a tarefa de envio de preço
 *     description: Dispara manualmente a tarefa agendada de envio de preço.
 *     tags: [Tarefas]
 *     responses:
 *       200:
 *         description: Tarefa de preço executada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Erro ao executar a tarefa de preço
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/preco", async (req, res) => {
    try {
        await scheduleService.enviarPreco();
        res
            .status(200)
            .json({ message: "Tarefa preço executada com sucesso!" });
    } catch (error) {
        res.status(500).send({ message:  "Erro ao executar a tarefa de preço:" + error});
    }
});

/**
 * @swagger
 * /chats:
 *   get:
 *     summary: Busca os chats cadastrados
 *     description: Retorna a lista de chats cadastrados no sistema.
 *     tags: [Tarefas]
 *     responses:
 *       200:
 *         description: Lista de chats retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erro ao buscar os chats
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/chats", async (req, res) => {
    try {
        res
            .status(200)
            .json(await scheduleService.buscarChats());
    } catch (error) {
        res.status(500).send({ message:  "Erro ao executar a tarefa de preço:" + error});
    }
});

/**
 * @swagger
 * /noticias:
 *   get:
 *     summary: Lista e busca notícias
 *     description: Retorna uma lista paginada de notícias ordenadas por data (mais recentes primeiro). Se uma palavra-chave for fornecida, filtra as notícias que contenham o termo no título ou texto completo.
 *     tags: [Notícias]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Palavra-chave para busca (opcional)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número da página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de itens por página
 *     responses:
 *       200:
 *         description: Notícias encontradas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/noticias', async (req, res) => {
    try {
        const palavraChave = req.query.q;
        
        // Pega page e limit da query string, com valores padrão
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        let data;
        
        if (palavraChave) {
            // Se palavra-chave fornecida, busca filtrada
            data = await noticiaService.buscarNoticiasPorPalavraChave(palavraChave, page, limit);
        } else {
            // Se não fornecida, busca todas as notícias
            data = await noticiaService.buscarNoticiasPaginadas(page, limit);
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /trending:
 *   get:
 *     summary: Obtém criptomoedas em tendência
 *     description: Retorna informações sobre criptomoedas que estão em tendência no momento
 *     tags: [Criptomoedas]
 *     responses:
 *       200:
 *         description: Dados de criptomoedas em tendência retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/trending", async (req, res) => {
    try {
        const data = await scheduleService  .getTrendingCryptos();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar criptos em tendência." });
    }
});

/**
 * @swagger
 * /acesso:
 *   post:
 *     summary: Registra um novo acesso ao site
 *     description: Salva um registro de acesso com data/hora, IP e User-Agent do visitante
 *     tags: [Acessos]
 *     responses:
 *       200:
 *         description: Acesso registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 acesso:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     data:
 *                       type: string
 *                       format: date-time
 *                     ip:
 *                       type: string
 *                     userAgent:
 *                       type: string
 *       500:
 *         description: Erro ao registrar acesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post("/acesso", async (req, res) => {
    try {

        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;

        if (ip && typeof ip === 'string' && ip.includes(',')) {
            ip = ip.split(',')[0].trim();
        }

        const userAgent = req.headers['user-agent'];

        const acesso = await acessoService.registrarAcesso(ip, userAgent);

        res.status(200).json({
            message: "Acesso registrado com sucesso",
            acesso: {
                _id: acesso._id,
                data: acesso.data,
                ip: acesso.ip,
                userAgent: acesso.userAgent
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /acessos/total:
 *   get:
 *     summary: Busca o total de acessos ao site
 *     description: Retorna a contagem total de acessos registrados no sistema
 *     tags: [Acessos]
 *     responses:
 *       200:
 *         description: Total de acessos retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Número total de acessos
 *                 dataConsulta:
 *                   type: string
 *                   format: date-time
 *                   description: Data e hora da consulta
 *       500:
 *         description: Erro ao buscar total de acessos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/acessos/total", async (req, res) => {
    try {
        const resultado = await acessoService.getTotalAcessos();
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * @swagger
 * /acessos/periodo:
 *   get:
 *     summary: Busca acessos por período
 *     description: Retorna a contagem de acessos em um período específico
 *     tags: [Acessos]
 *     parameters:
 *       - in: query
 *         name: inicio
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de início (YYYY-MM-DD)
 *       - in: query
 *         name: fim
 *         schema:
 *           type: string
 *           format: date
 *         description: Data de fim (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Acessos do período retornados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   description: Número de acessos no período
 *                 periodo:
 *                   type: object
 *                   properties:
 *                     inicio:
 *                       type: string
 *                     fim:
 *                       type: string
 *                 dataConsulta:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Erro ao buscar acessos por período
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get("/acessos/periodo", async (req, res) => {
    try {
        const { inicio, fim } = req.query;
        const resultado = await acessoService.getAcessosPorPeriodo(inicio, fim);
        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
