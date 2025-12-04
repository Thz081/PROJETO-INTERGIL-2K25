// hall-seed.js - Histórico de Campeões
// RODE COM: node hall-seed.js

require('dotenv').config();
const mongoose = require('mongoose');

const HallSchema = new mongoose.Schema({
    ano: Number,
    turma: String,
    logo_path: String, // Caminho relativo da imagem
    instagram: String,
    tema: String
}, { collection: 'halls' }); 

const Hall = mongoose.model('HallSeed', HallSchema);

// === LISTA DE CAMPEÕES ===
// Note que o caminho começa com /uploads/hall/...
const historico = [
    { 
        ano: 2024, 
        turma: "BLUESTORM", 
        logo_path: "/uploads/hall/BLUESTORM.PNG", 
        instagram: "https://www.instagram.com/3badm_2022" 
    },
    { 
        ano: 2023, 
        turma: "INFERNAIS", 
        logo_path: "/uploads/hall/INFERNAIS.PNG", 
        instagram: "https://www.instagram.com/3ads.2021" 
    },
    { 
        ano: 2022, 
        turma: "INFINITY JEWELS", 
        logo_path: "/uploads/hall/INFINITYJEWELS.PNG", 
        instagram: "https://www.instagram.com/3a.adm__2020/" 
    },
    { 
        ano: 2021, 
        turma: "CORINGAS", 
        logo_path: "/uploads/hall/Vipers.png", 
        instagram: "https://www.instagram.com/3rao.dsa_2019/" 
    },
    { 
        ano: 2020, 
        turma: "PANDEMIA", 
        logo_path: "/uploads/hall/gameon-logo.png", // Use uma logo padrão se não tiver
        instagram: "#" 
    },
    { 
        ano: 2019, 
        turma: "GORILAS", 
        logo_path: "/uploads/hall/GORILLAZ.png", 
        instagram: "https://www.instagram.com/3bds2020mopas/" 
    },
    { 
        ano: 2018, 
        turma: "SALA VERDE", 
        logo_path: "/uploads/hall/sala verde.png", 
        instagram: "https://www.instagram.com/sistemasa/" 
    },
    { 
        ano: 2017, 
        turma: "SALA VERDE", 
        logo_path: "/uploads/hall/sala verde.png", 
        instagram: "https://www.instagram.com/sistemasa/" 
    },
    { 
        ano: 2016, 
        turma: "SALA VERDE", 
        logo_path: "/uploads/hall/sala verde.png", 
        instagram: "https://www.instagram.com/sistemasa/" 
    }
];

const runSeed = async () => {
    try {
        console.log("🔌 Conectando ao Mongo...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Conectado!");

        console.log("🧹 Limpando Hall da Fama antigo...");
        await Hall.deleteMany({});

        console.log("🚀 Inserindo histórico...");
        await Hall.insertMany(historico);

        console.log("🏁 HALL DA FAMA PRONTO! (Verifique se as imagens estão em uploads/hall)");
        process.exit();
    } catch (error) {
        console.error("❌ Erro no seed:", error);
        process.exit(1);
    }
};

runSeed();