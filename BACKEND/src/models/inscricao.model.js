const mongoose = require('mongoose');

const inscricaoSchema = new mongoose.Schema({
    aluno: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Aluno',
        required: true,
        unique: true 
    },
    modalidades: [String], 
    pontuacaoTotal: {
        type: Number,
        default: 0
    },
    data_inscricao: {
        type: Date,
        default: Date.now
    }
}, { collection: 'inscricoes' });

module.exports = mongoose.model('Inscricao', inscricaoSchema);