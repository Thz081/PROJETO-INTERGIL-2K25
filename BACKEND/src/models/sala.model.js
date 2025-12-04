const mongoose = require('mongoose');
const salaSchema = mongoose.Schema({
    nome: { type: String, required: true },
    turma: { type: String, required: true }, // <-- TEM QUE SER 'turma'
    logo_url: { type: String },
    pontos: { type: Number, default: 0 },
    instagram: { type: String, default: '#' }
});
module.exports = mongoose.model('Sala', salaSchema);