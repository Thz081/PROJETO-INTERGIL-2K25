const mongoose = require('mongoose');

const logAcaoSchema = new mongoose.Schema(
    {
        timestamp: {
            type: Date,
            default: Date.now,
        },
        autor: {
            type: String,
        },
        acao: {
            type: String,
        },
    },
    {
        timestamps: true,
        collection: 'logs',
    }
);

const LogAcao = mongoose.model('LogAcao', logAcaoSchema);

module.exports = LogAcao;
