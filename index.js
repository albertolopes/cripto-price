const express = require("express");

const PORT = 3000;
const app = express();
const taskRoutes = require("./src/route/TarefaRoute");

app.use("/", taskRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
