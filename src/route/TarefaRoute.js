const express = require("express");
const ScheduleService = require("../service/TarefaService");

const router = express.Router();
const scheduleService = new ScheduleService();

router.get("/noticias", async (req, res) => {
    // try {
        await scheduleService.enviarNoticia();
        res
            .status(200)
            .json({ message: "Tarefa de noticias executada com sucesso!" });
    // } catch (error) {
    //     console.error("Erro ao executar a tarefa de preço:", error);
    //     res.status(500).send("Erro interno do servidor");
    // }
});

router.get("/preco", async (req, res) => {
    // try {
        await scheduleService.enviarPreco();
        res
            .status(200)
            .json({ message: "Tarefa preço executada com sucesso!" });
    // } catch (error) {
    //     console.error("Erro ao executar a tarefa de preço:", error);
    //     res.status(500).send("Erro interno do servidor");
    // }
});

module.exports = router;
