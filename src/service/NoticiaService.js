const Noticia = require('../db/Noticia');

class NoticiaService {
    constructor() {}


    async salvarNoticiaDoMatch(match, linkOrigem) {
        if (!match || !match[1] || !match[2] || !match[3]) {
            throw new Error('Formato do match inválido');
        }

        const tituloMatch = match[1].match(/\*\*(.*?)\*\*/);
        if (!tituloMatch) {
            throw new Error('Título não encontrado entre asteriscos');
        }
        const titulo = tituloMatch[1];

        const resumo = match[2];
        const textoCompleto = match[3];

        const data = new Date();

        if (!linkOrigem) {
            console.warn('Link de origem não encontrado no texto. Pode ajustar a regra conforme necessário.');
        }

        const noticia = {
            titulo,
            resumo,
            textoCompleto,
            data,
            linkOrigem
        };

        const existente = await Noticia.findOne({ linkOrigem });
        if (existente) {
            console.log('Notícia já existe no banco:', titulo);
            return existente;
        }

        const novaNoticia = new Noticia(noticia);
        const salva = await novaNoticia.save();
        console.log('Notícia salva:', salva.titulo);
        return salva;
    }

    async buscarNoticiasPaginadas(page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;

            const results = await Noticia.find()
                .sort({ data: -1 })
                .skip(skip)
                .limit(limit)
                .exec();

            const totalResults = await Noticia.countDocuments();

            const totalPages = Math.ceil(totalResults / limit);

            return {
                results,
                page,
                limit,
                totalPages,
                totalResults,
            };
        } catch (error) {
            throw new Error(`Erro ao buscar notícias: ${error.message}`);
        }
    }

    async buscarNoticiasPorPalavraChave(palavraChave, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;

            // Criar regex case-insensitive para busca
            const regex = new RegExp(palavraChave, 'i');

            // Buscar notícias que contenham a palavra-chave no título OU no texto completo
            const query = {
                $or: [
                    { titulo: regex },
                    { textoCompleto: regex }
                ]
            };

            const results = await Noticia.find(query)
                .sort({ data: -1 })
                .skip(skip)
                .limit(limit)
                .exec();

            const totalResults = await Noticia.countDocuments(query);

            const totalPages = Math.ceil(totalResults / limit);

            return {
                results,
                page,
                limit,
                totalPages,
                totalResults,
                palavraChave
            };
        } catch (error) {
            throw new Error(`Erro ao buscar notícias por palavra-chave: ${error.message}`);
        }
    }
}

module.exports = NoticiaService;