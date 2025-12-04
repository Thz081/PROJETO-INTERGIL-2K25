const mongoose = require('mongoose');

const monitorSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
        },
        matricula: {
            type: String,
            required: true,
            unique: true,
        },
        senha: {
            type: String,
            required: true,
        },
        modalidadeId: {
            type: String,
        },
        role: {
            type: String,
            default: 'monitor',
        },
    },
    {
        timestamps: true,
        collection: 'monitores',
    }
);

const Monitor = mongoose.model('Monitor', monitorSchema);

module.exports = Monitor;
