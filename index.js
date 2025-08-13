const express = require("express");
const cors = require("cors"); // ✅ Importa o CORS
const connectDB = require('./src/config/MongoConfig');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./src/config/SwaggerConfig');

const PORT = 3000;
const app = express();
const taskRoutes = require("./src/route/TarefaRoute");

connectDB();

app.use(cors());
app.use(express.json());

// Configuração do Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Bitcoin Telegram Bot API Documentation'
}));

app.use("/", taskRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação da API disponível em: http://localhost:${PORT}/api-docs`);
});
