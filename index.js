const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const ScheduleService = require("./src/service/ScheduleService");

const scheduleService = new ScheduleService();

const app = express();
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);

    scheduleService.enviarNotificacao().then(r => console.log("FINALIZADO"));
});
