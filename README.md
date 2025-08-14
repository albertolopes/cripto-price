# Bitcoin Telegram Bot API

API para gerenciamento de notícias sobre criptomoedas e tarefas automatizadas.

## 🚀 Funcionalidades

- **Gestão de Notícias**: Busca e listagem de notícias sobre criptomoedas
- **Busca por Palavra-chave**: Filtro de notícias por termo específico
- **Paginação**: Sistema de paginação para grandes volumes de dados
- **Tendências**: Informações sobre criptomoedas em tendência
- **Documentação Interativa**: Swagger UI para testar endpoints

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior)
- MongoDB
- npm ou yarn

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd bitcoin-telegram-bot
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o servidor:
```bash
npm start
```

## 📚 Documentação da API

A documentação interativa da API está disponível em:
```
http://localhost:3000/api-docs
```

### Endpoints Principais

#### 1. Listar e Buscar Notícias
```
GET /noticias?q=bitcoin&page=1&limit=10
```

**Parâmetros:**
- `q` (opcional): Palavra-chave para busca
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10)

**Exemplos de uso:**
```bash
# Listar todas as notícias
GET /noticias

# Buscar notícias com "bitcoin"
GET /noticias?q=bitcoin

# Buscar notícias com "ethereum" na página 2
GET /noticias?q=ethereum&page=2

# Listar notícias com limite personalizado
GET /noticias?limit=5
```

#### 2. Criptomoedas em Tendência
```
GET /trending
```

#### 3. Controle de Acessos

**Registrar Acesso:**
```
POST /acesso
```
Registra automaticamente o IP e User-Agent do visitante.

**Total de Acessos:**
```
GET /acessos/total
```
Retorna o número total de acessos registrados.

**Acessos por Período:**
```
GET /acessos/periodo?inicio=2024-01-01&fim=2024-01-31
```
Retorna acessos em um período específico.

**Parâmetros:**
- `inicio` (opcional): Data de início (YYYY-MM-DD)
- `fim` (opcional): Data de fim (YYYY-MM-DD)

## 🔧 Estrutura do Projeto

```
bitcoin-telegram-bot/
├── src/
│   ├── client/          # Clientes externos (Telegram, Twitter, etc.)
│   ├── config/          # Configurações (MongoDB, Swagger)
│   ├── db/              # Modelos do banco de dados
│   ├── dto/             # Data Transfer Objects
│   ├── route/           # Rotas da API
│   └── service/         # Lógica de negócio
├── index.js             # Arquivo principal
├── package.json
└── README.md
```

## 📊 Resposta da API

### Formato Padrão de Resposta
```json
{
  "results": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "titulo": "Bitcoin atinge nova máxima histórica",
      "resumo": "Bitcoin supera marca de $50.000",
      "textoCompleto": "Texto completo da notícia...",
      "data": "2024-01-15T10:30:00.000Z",
      "linkOrigem": "https://exemplo.com/noticia"
    }
  ],
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "totalResults": 50,
  "palavraChave": "bitcoin"
}
```

## 🧪 Testando a API

### Usando cURL

```bash
# Listar todas as notícias
curl http://localhost:3000/noticias

# Buscar por palavra-chave
curl "http://localhost:3000/noticias?q=bitcoin"

# Buscar com paginação
curl "http://localhost:3000/noticias?q=ethereum&page=2&limit=5"

# Criptomoedas em tendência
curl http://localhost:3000/trending

# Registrar acesso
curl -X POST http://localhost:3000/acesso

# Total de acessos
curl http://localhost:3000/acessos/total

# Acessos por período
curl "http://localhost:3000/acessos/periodo?inicio=2024-01-01&fim=2024-01-31"

### Usando Swagger UI

1. Acesse `http://localhost:3000/api-docs`
2. Clique em qualquer endpoint
3. Clique em "Try it out"
4. Preencha os parâmetros
5. Clique em "Execute"

## 🔍 Filtros de Busca

A busca por palavra-chave é case-insensitive e procura em:
- **Título** da notícia
- **Texto completo** da notícia

### Exemplos de Busca
- `bitcoin` - encontra "Bitcoin", "BITCOIN", "bitcoin"
- `ETH` - encontra "Ethereum", "ETH", "eth"
- `mercado` - encontra "mercado", "Mercado", "MERCADO"

## 📝 Licença

Este projeto está sob a licença ISC.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
