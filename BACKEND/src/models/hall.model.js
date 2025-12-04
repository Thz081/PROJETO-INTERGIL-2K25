const mongoose = require('mongoose');

const HallSchema = new mongoose.Schema({
    ano: { type: Number, required: true, unique: true }, // 2024
    turma: { type: String, required: true }, // "3º B INFO"
    logo_path: { type: String, required: true }, // "/uploads/arquivo.png"
    pontos: { type: String, default: '' }, // Opcional
    instagram: { type: String, default: '' } // Opcional
}, {
    timestamps: true,
    collection: 'hall_da_fama'
});

module.exports = mongoose.model('Hall', HallSchema);