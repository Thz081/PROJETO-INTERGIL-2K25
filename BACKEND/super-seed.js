// super-seed.js - CORREÇÃO DE ID E LÓGICA PREGIL/DIGITAIS
require('dotenv').config();
const mongoose = require('mongoose');

// --- 1. O SCHEMA BLINDADO ---
// O segredo pro erro sumir está no { _id: false } nas opções!
const ModalidadeSchema = new mongoose.Schema({
    _id: Number, // <--- FORÇA O ID A SER NÚMERO
    nome: String,
    slug: String,
    imageUrl: String,
    linkEdital: String,
    isAvulsoSimples: Boolean,
    max_inscritos: Number,
    submodalidades: [Object]
}, { 
    collection: 'modalidades',
    _id: false // <--- O PULO DO GATO: Desliga o gerador automático de ObjectId
});

const Modalidade = mongoose.model('ModalidadeSeed', ModalidadeSchema);

// --- 2. OS DADOS DA VERDADE ---
const dadosDefinitivos = [
    // --- 1. FUTSAL (Com Pregil desligado) ---
    {
        _id: 1,
        nome: 'Futsal',
        slug: 'futsal',
        imageUrl: '/images/futsal.png',
        max_inscritos: 8,
        submodalidades: [
            { nome: "Futsal 5x5 (Feminino)", genero: 'F', max_inscritos: 8, isPrincipal: true, inscricao: true },
            { nome: "Futsal 5x5 (Masculino)", genero: 'M', max_inscritos: 8, isPrincipal: true, inscricao: true },
            
            // PREGIL (Inscrição FALSE)
            { nome: "Quadrado Feminino", genero: 'F', max_inscritos: 2, isPrincipal: false, inscricao: false },
            { nome: "Quadrado Masculino", genero: 'M', max_inscritos: 2, isPrincipal: false, inscricao: false },
            { nome: "Quadrado Misto", genero: 'X', max_inscritos: 4, isPrincipal: false, inscricao: false },
            { nome: "X1 Feminino", genero: 'F', max_inscritos: 1, isPrincipal: false, inscricao: false },
            { nome: "X1 Masculino", genero: 'M', max_inscritos: 1, isPrincipal: false, inscricao: false },
            { nome: "Futmesa (Todas)", genero: 'X', max_inscritos: 4, isPrincipal: false, inscricao: false },
            { nome: "Golzinho Street Fem", genero: 'F', max_inscritos: 4, isPrincipal: false, inscricao: false },
            { nome: "Golzinho Street Masc", genero: 'M', max_inscritos: 4, isPrincipal: false, inscricao: false },
        ]
    },
    // --- 2. VÔLEI (Com Pregil desligado) ---
    {
        _id: 2,
        nome: 'Vôlei',
        slug: 'volei',
        imageUrl: '/images/volei.png',
        max_inscritos: 10,
        submodalidades: [
            { nome: "Vôlei de Quadra (Feminino)", genero: 'F', max_inscritos: 10, isPrincipal: true, inscricao: true },
            { nome: "Vôlei de Quadra (Masculino)", genero: 'M', max_inscritos: 10, isPrincipal: true, inscricao: true },
            
            // PREGIL
            { nome: "Vôlei Quase de Praia Fem", genero: 'F', max_inscritos: 4, isPrincipal: false, inscricao: true }, // Esse vc deixou true na sua lista
            { nome: "Vôlei Quase de Praia Masc", genero: 'M', max_inscritos: 4, isPrincipal: false, inscricao: true }, // Esse vc deixou true na sua lista
            { nome: "Vôleimesa (Todas)", genero: 'X', max_inscritos: 4, isPrincipal: false, inscricao: false },
        ]
    },
    // --- 3. BASQUETE ---
    {
        _id: 3,
        nome: 'Basquete',
        slug: 'basquete',
        imageUrl: '/images/basquete.png',
        max_inscritos: 8,
        submodalidades: [
            { nome: "5x5 (Masculino)", genero: 'M', max_inscritos: 8, isPrincipal: true, inscricao: true },
            { nome: "3x3 Feminino", genero: 'F', max_inscritos: 4, isPrincipal: false, inscricao: false }, // Pregil? Botei false por segurança, mude se precisar
            { nome: "3x3 Masculino", genero: 'M', max_inscritos: 4, isPrincipal: false, inscricao: false },
        ]
    },
    // --- 4. QUEIMADO ---
    {
        _id: 4,
        nome: 'Queimado',
        slug: 'queimado',
        imageUrl: '/images/queimado.png',
        isAvulsoSimples: true, 
        max_inscritos: 12,
        submodalidades: [
            { nome: "Misto", genero: 'X', max_inscritos: 12, isPrincipal: true, inscricao: true }
        ]
    },
    // --- 5. TÊNIS DE MESA ---
    {
        _id: 5,
        nome: 'Tênis de Mesa',
        slug: 'tenis-de-mesa',
        imageUrl: '/images/pingpong.png',
        max_inscritos: 4,
        submodalidades: [
            { nome: "Individual Feminino", genero: 'F', max_inscritos: 4, isPrincipal: true, inscricao: true },
            { nome: "Individual Masculino", genero: 'M', max_inscritos: 4, isPrincipal: true, inscricao: true },
            { nome: "Dupla Mista", genero: 'X', max_inscritos: 4, isPrincipal: false, inscricao: false } // Pregil
        ]
    },
    // --- 6. BADMINTON ---
    {
        _id: 6,
        nome: 'Badminton',
        slug: 'badminton',
        imageUrl: '/images/badminton.png',
        max_inscritos: 4,
        submodalidades: [
            { nome: "Dupla Feminina", genero: 'F', max_inscritos: 4, isPrincipal: false, inscricao: true },
            { nome: "Dupla Masculina", genero: 'M', max_inscritos: 4, isPrincipal: false, inscricao: true }
        ]
    },
    // --- 7. ATLETISMO ---
    {
        _id: 7,
        nome: 'Atletismo',
        slug: 'atletismo',
        imageUrl: '/images/atletismo.png',
        max_inscritos: 4,
        submodalidades: [
            { nome: "Revezamento 800m Quarteto (Fem)", genero: 'F', max_inscritos: 4, isPrincipal: true, inscricao: true },
            { nome: "Revezamento 800m Quarteto (Masc)", genero: 'M', max_inscritos: 4, isPrincipal: true, inscricao: true },
            // Subs (Todas TRUE pois são parte do evento principal)
            { nome: "Corrida 100m Fem", genero: 'F', max_inscritos: 2, isPrincipal: false, inscricao: true },
            { nome: "Corrida 100m Masc", genero: 'M', max_inscritos: 2, isPrincipal: false, inscricao: true },
            { nome: "Corrida 200m Fem", genero: 'F', max_inscritos: 2, isPrincipal: false, inscricao: true },
            { nome: "Corrida 200m Masc", genero: 'M', max_inscritos: 2, isPrincipal: false, inscricao: true },
            { nome: "Corrida 800m Fem", genero: 'F', max_inscritos: 2, isPrincipal: false, inscricao: true },
            { nome: "Corrida 800m Masc", genero: 'M', max_inscritos: 2, isPrincipal: false, inscricao: true },
            { nome: "Corrida 1km Fem", genero: 'F', max_inscritos: 2, isPrincipal: false, inscricao: true },
            { nome: "Corrida 1km Masc", genero: 'M', max_inscritos: 2, isPrincipal: false, inscricao: true },
            { nome: "Arremesso de Peso Fem", genero: 'F', max_inscritos: 2, isPrincipal: false, inscricao: true },
            { nome: "Arremesso de Peso Masc", genero: 'M', max_inscritos: 2, isPrincipal: false, inscricao: true }
        ]
    },
    // --- 8. GINÁSTICA E LUTA ---
   {
        _id: 8,
        nome: 'Ginástica e Luta',
        slug: 'ginastica-luta',
        imageUrl: '/images/ginastica&calistenia.png',
        isAvulsoSimples: true,
        max_inscritos: 99, 
        submodalidades: [
            { nome: "Calistenia Feminina", genero: 'F', max_inscritos: 4, inscricao: true },
            { nome: "Calistenia Masculina", genero: 'M', max_inscritos: 4, inscricao: true },
            { nome: "Karatê", genero: 'X', max_inscritos: 99, inscricao: true },
            { nome: "Taekwondo", genero: 'X', max_inscritos: 99, inscricao: true },
            { nome: "Judô", genero: 'X', max_inscritos: 99, inscricao: true }
           
        ]
    },
    // --- 9. BOCHA ---
    {
        _id: 9,
        nome: 'Bocha',
        slug: 'bocha',
        imageUrl: '/images/bocha.png',
        max_inscritos: 2,
        submodalidades: [
            { nome: "Dupla Livre", genero: 'X', max_inscritos: 2, isPrincipal: false, inscricao: true }
        ]
    },
    // --- 10. JOGOS DE TABULEIRO ---
    {
        _id: 10,
        nome: 'Jogos de Tabuleiro',
        slug: 'jogos-tabuleiro',
        imageUrl: '/images/Jogos de Tabuleiro.png',
        isAvulsoSimples: true,
        max_inscritos: 99,
        submodalidades: [
            { nome: "UNO", genero: 'X', max_inscritos: 4, inscricao: true },
            { nome: "Dama", genero: 'X', max_inscritos: 99, inscricao: true },
            { nome: "Dominó", genero: 'X', max_inscritos: 4, inscricao: true },
            { nome: "Xadrez Iniciante", genero: 'X', max_inscritos: 99, inscricao: true },
            { nome: "Xadrez Intermediário", genero: 'X', max_inscritos: 99, inscricao: true }
        ]
    },
    // --- 11. JOGOS MATEMÁTICOS ---
    {
        _id: 11,
        nome: 'Jogos Matemáticos',
        slug: 'jogos-matematicos',
        imageUrl: '/images/Jogos Matemáticos.png',
        isAvulsoSimples: true,
        max_inscritos: 99,
        submodalidades: [
            { nome: "Cubo Mágico 3x3 Iniciante", genero: 'X', max_inscritos: 99, inscricao: true },
            { nome: "Cubo Mágico 3x3 Intermediário", genero: 'X', max_inscritos: 99, inscricao: true },
            { nome: "Cubo Mágico 3x3 Avançado", genero: 'X', max_inscritos: 99, inscricao: true },
            { nome: "Cubo Mágico 2x2", genero: 'X', max_inscritos: 99, inscricao: true },
            { nome: "Sudoku", genero: 'X', max_inscritos: 99, inscricao: true }
        ]
    },
    // --- 12. JOGOS DIGITAIS (Lógica de Família) ---
    {
        _id: 12,
        nome: 'Jogos Digitais',
        slug: 'jogos-digitais',
        imageUrl: '/images/Jogos Digitais.png',
        isAvulsoSimples: false, // FALSE para ativar a lógica de famílias no front
        max_inscritos: 99,
        submodalidades: [
            // FAMÍLIA FREE FIRE
            { nome: "Free Fire Mapa Aberto", genero: 'X', max_inscritos: 5, isPrincipal: true, inscricao: true }, // Mãe
            { nome: "Free Fire (X1)", genero: 'X', max_inscritos: 1, isPrincipal: false, inscricao: true },       // Filha
            { nome: "Free Fire 4x4", genero: 'X', max_inscritos: 4, isPrincipal: false, inscricao: true },        // Filha
            
            // FAMÍLIA COD
            { nome: "Call of Duty Equipe", genero: 'X', max_inscritos: 5, isPrincipal: true, inscricao: true },   // Mãe
            { nome: "Call of Duty Individual", genero: 'X', max_inscritos: 2, isPrincipal: false, inscricao: true }, // Filha
            
            // FAMÍLIA FIFA
            { nome: "FIFA X1", genero: 'X', max_inscritos: 2, isPrincipal: true, inscricao: true },               // Mãe
            { nome: "FIFA 2v2", genero: 'X', max_inscritos: 2, isPrincipal: false, inscricao: true },             // Filha
            
            // OUTROS (Avulsos)
            { nome: "Clash Royale", genero: 'X', max_inscritos: 5, isPrincipal: false, inscricao: true },
            { nome: "Just Dance", genero: 'X', max_inscritos: 5, isPrincipal: false, inscricao: true },
            { nome: "Street Fighter", genero: 'X', max_inscritos: 2, isPrincipal: false, inscricao: true },
            { nome: "League of Legends (Mobile)", genero: 'X', max_inscritos: 5, isPrincipal: false, inscricao: true },
            { nome: "Brawl Stars", genero: 'X', max_inscritos: 6, isPrincipal: false, inscricao: true },
        ]
    },
    // --- 13. JOGOS DE IMAGINAÇÃO (Exceção no Front) ---
    {
        _id: 13,
        nome: 'Jogos de Imaginação',
        slug: 'jogos-imaginacao',
        imageUrl: '/images/Jogos de Imaginação.png',
        isAvulsoSimples: true, // TRUE para cair na exceção do front
        max_inscritos: 99,
        submodalidades: [
            { nome: "RPG", genero: 'X', max_inscritos: 99, inscricao: true },
            { nome: "RPG PVP", genero: 'X', max_inscritos: 99, inscricao: true },
            { nome: "Card Game", genero: 'X', max_inscritos: 99, inscricao: true },
            { nome: "Cosplay", genero: 'X', max_inscritos: 99, inscricao: true }
        ]
    }
];

const runSeed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🔌 Conectado ao MongoDB!");

        console.log("🧹 Limpando modalidades antigas...");
        await Modalidade.deleteMany({}); 

        console.log("🚀 Inserindo dados definitivos...");
        
        // Inserção direta sem loop complexo para evitar erro de tipo
        await Modalidade.insertMany(dadosDefinitivos);

        console.log(`✅ ${dadosDefinitivos.length} modalidades recriadas com sucesso!`);
        console.log("🏁 SEED CONCLUÍDO! Lógica Pregil (False) e IDs numéricos aplicados.");
        process.exit();
    } catch (error) {
        console.error("❌ Erro no seed:", error);
        process.exit(1);
    }
};

runSeed();