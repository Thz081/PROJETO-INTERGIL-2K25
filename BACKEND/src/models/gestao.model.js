const mongoose = require('mongoose');

const gestaoSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
        },
        senha: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: 'gestao',
        },
    },
    {
        timestamps: true,
        collection: 'gestao',
    }
);

const Gestao = mongoose.model('Gestao', gestaoSchema);

module.exports = Gestao;
