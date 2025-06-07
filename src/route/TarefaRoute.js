const express = require("express");
const ScheduleService = require("../service/TarefaService");

const router = express.Router();
const scheduleService = new ScheduleService();

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

module.exports = router;
