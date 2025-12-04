const mongoose = require('mongoose');

const momentoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'O título é obrigatório.'],
    trim: true
  },
  url: {
    type: String,
    required: [true, 'A URL (do YouTube, Imagem, etc.) é obrigatória.'],
    trim: true
  },
  // Tipo: 'video' ou 'foto' (ajuda no frontend a decidir se bota um <iframe> ou <img>)
  tipo: {
    type: String,
    enum: ['video', 'foto'],
    default: 'video'
  },
  // Ordem: 1 (Abertura), 2 (Melhores Momentos), 3 (Resultados)
  ordem: {
    type: Number,
    default: 99
  }
}, { timestamps: true });

module.exports = mongoose.model('Momento', momentoSchema);