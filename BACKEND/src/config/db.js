// Arquivo: InterDoZero/src/config/db.js
// VERSÃO 1.1 - LIMPA E CORRIGIDA

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log(`Conectado ao MongoDB em ${mongoose.connection.host}`);
        

    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err.message);
        process.exit(1); 
    }
};

module.exports = connectDB;