const mongoose = require('mongoose');

// Schema da Submodalidade (Mantém igual)
const submodalidadeSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    isPrincipal: { type: Boolean, default: false },
    inscricao: { type: Boolean, default: true },
    genero: { type: String, default: 'X' },
    edital: { type: String, default: '#' },
    chaveamento: { type: String, default: '#' },
    max_inscritos: { type: Number, default: null } 
}, { _id: false }); 

// Schema do Horário (Mantém igual)
const horarioSchema = new mongoose.Schema({
    categoria: { type: String, required: true },
    data: { type: String, required: true },
    horario: { type: String, required: true },
    local: { type: String, required: true }
});

// === SCHEMA PRINCIPAL ATUALIZADO ===
const modalidadeSchema = new mongoose.Schema(
    {
        _id: { type: Number },
        
        nome: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        
        // --- NOVOS CAMPOS DE IMAGEM ---
        imgCarrossel: { type: String }, // Foto da Capa
        imgDetalhe: { type: String },   // Foto Interna (Banner)
        imageUrl: { type: String },     // Mantém por segurança (fallback)

        linkEdital: { type: String },
        isAvulsoSimples: { type: Boolean, default: false },
        max_inscritos: { type: Number, default: 20 }, 
        
        submodalidades: [submodalidadeSchema],
        horarios: { type: [horarioSchema], default: [] }
    },
    {
        timestamps: true,
        collection: 'modalidades',
        _id: false 
    }
);

const Modalidade = mongoose.model('Modalidade', modalidadeSchema);
module.exports = Modalidade;