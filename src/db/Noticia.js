const mongoose = require('mongoose');

const noticiaSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true
    },
    resumo: {
        type: String,
        required: true
    },
    textoCompleto: {
        type: String,
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    linkOrigem: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Noticia = mongoose.model(
    'Noticia',
    noticiaSchema
);

module.exports = Noticia;
