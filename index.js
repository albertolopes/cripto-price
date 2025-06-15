const express = require("express");
const cors = require("cors"); // ✅ Importa o CORS
const connectDB = require('./src/config/MongoConfig');

const PORT = 3000;
const app = express();
const taskRoutes = require("./src/route/TarefaRoute");

connectDB();

app.use(cors());
app.use(express.json());
app.use("/", taskRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
