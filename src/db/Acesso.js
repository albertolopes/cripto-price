const mongoose = require('mongoose');

const acessoSchema = new mongoose.Schema({
    data: {
        type: Date,
        default: Date.now,
        required: true
    },
    ip: {
        type: String,
        required: false
    },
    userAgent: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

// Índice para otimizar consultas por data
acessoSchema.index({ data: -1 });

module.exports = mongoose.model('Acesso', acessoSchema);
