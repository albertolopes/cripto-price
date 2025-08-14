const Acesso = require('../db/Acesso');

class AcessoService {
    constructor() {}

    async registrarAcesso(ip, userAgent) {
        try {
            const acesso = new Acesso({
                data: new Date(),
                ip: ip,
                userAgent: userAgent
            });

            const acessoSalvo = await acesso.save();
            console.log('Acesso registrado:', acessoSalvo._id);
            return acessoSalvo;
        } catch (error) {
            throw new Error(`Erro ao registrar acesso: ${error.message}`);
        }
    }

    async getTotalAcessos() {
        try {
            const total = await Acesso.countDocuments();
            return {
                total: total,
                dataConsulta: new Date()
            };
        } catch (error) {
            throw new Error(`Erro ao buscar total de acessos: ${error.message}`);
        }
    }

    async getAcessosPorPeriodo(dataInicio, dataFim) {
        try {
            const query = {};
            
            if (dataInicio && dataFim) {
                // Ajusta as datas para incluir o dia completo
                const inicio = new Date(dataInicio);
                inicio.setHours(0, 0, 0, 0);
                
                const fim = new Date(dataFim);
                fim.setHours(23, 59, 59, 999);
                
                query.data = {
                    $gte: inicio,
                    $lte: fim
                };
            }

            const total = await Acesso.countDocuments(query);
            return {
                total: total,
                periodo: {
                    inicio: dataInicio,
                    fim: dataFim
                },
                dataConsulta: new Date()
            };
        } catch (error) {
            throw new Error(`Erro ao buscar acessos por período: ${error.message}`);
        }
    }
}

module.exports = AcessoService;
