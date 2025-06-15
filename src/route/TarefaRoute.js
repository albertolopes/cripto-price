const express = require("express");
const ScheduleService = require("../service/TarefaService");
const NoticiaService = require("../service/NoticiaService");

const router = express.Router();
const scheduleService = new ScheduleService();
const noticiaService = new NoticiaService();

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


router.get("/chats", async (req, res) => {
    try {

        res
            .status(200)
            .json(await scheduleService.buscarChats());
    } catch (error) {
        res.status(500).send({ message:  "Erro ao executar a tarefa de preço:" + error});
    }
});

router.get('/noticias', async (req, res) => {
    try {
        // Pega page e limit da query string, com valores padrão
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const data = await noticiaService.buscarNoticiasPaginadas(page, limit);

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
