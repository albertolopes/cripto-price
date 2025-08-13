const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Bitcoin Telegram Bot API',
            version: '1.0.0',
            description: 'API para gerenciamento de notícias sobre criptomoedas e tarefas automatizadas',
            contact: {
                name: 'API Support',
                email: 'support@example.com'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desenvolvimento'
            }
        ],
        components: {
            schemas: {
                Noticia: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'ID único da notícia'
                        },
                        titulo: {
                            type: 'string',
                            description: 'Título da notícia'
                        },
                        resumo: {
                            type: 'string',
                            description: 'Resumo da notícia'
                        },
                        textoCompleto: {
                            type: 'string',
                            description: 'Texto completo da notícia'
                        },
                        data: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Data de criação da notícia'
                        },
                        linkOrigem: {
                            type: 'string',
                            description: 'Link de origem da notícia'
                        }
                    }
                },
                PaginatedResponse: {
                    type: 'object',
                    properties: {
                        results: {
                            type: 'array',
                            items: {
                                $ref: '#/components/schemas/Noticia'
                            }
                        },
                        page: {
                            type: 'integer',
                            description: 'Página atual'
                        },
                        limit: {
                            type: 'integer',
                            description: 'Itens por página'
                        },
                        totalPages: {
                            type: 'integer',
                            description: 'Total de páginas'
                        },
                        totalResults: {
                            type: 'integer',
                            description: 'Total de resultados'
                        },
                        palavraChave: {
                            type: 'string',
                            description: 'Palavra-chave usada na busca (apenas para busca filtrada)'
                        }
                    }
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: {
                            type: 'string',
                            description: 'Mensagem de erro'
                        }
                    }
                }
            }
        }
    },
    apis: ['./src/route/*.js'], // Caminho para os arquivos de rota
};

const specs = swaggerJsdoc(options);

module.exports = specs; 