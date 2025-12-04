// Arquivo: BACKEND/super-seed.js
// VERSÃO: CRIAÇÃO DE USUÁRIOS GESTÃO (Carlos & Renato)

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt'); // Usa o bcrypt que vc já tem

// === IMPORTANDO OS MODELS ===
// Ajuste o caminho se necessário (../src/models/...)
const UserAdmin = require('./src/models/gestao.model.js');
const UserMonitor = require('./src/models/monitor.model.js');

// Se quiser rodar modalidades também, descomente:
// const Modalidade = require('./src/models/modalidade.model.js');

dotenv.config();

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🔌 Conectado ao MongoDB!');

        // 1. LIMPEZA
        console.log('🧹 Limpando usuários antigos...');
        await UserAdmin.deleteMany({});
        await UserMonitor.deleteMany({});

        // 2. PREPARANDO A CRIPTOGRAFIA
        const salt = await bcrypt.genSalt(10);

        // ==========================================
        // CRIANDO CARLOS (Gestão)
        // ==========================================
        const senhaCarlos = await bcrypt.hash('FisicaSemEducacao_InterGil25', salt);
        
        await UserAdmin.create({
            nome: 'Carlos',
            senha: senhaCarlos,
            role: 'gestao' // Mantendo o padrão do seu seed antigo
        });
        console.log('✅ Carlos criado! (Login: Carlos/ Senha: FisicaSemEducacao_InterGil25)');

        // ==========================================
        // CRIANDO RENATO (Gestão)
        // ==========================================
        const senhaRenato = await bcrypt.hash('G4m3fr0nt.', salt);

        await UserAdmin.create({
            nome: 'Renato',
            senha: senhaRenato,
            role: 'gestao'
        });
        console.log('✅ Renato criado! (Login: Renato Gestão / Senha: G4m3fr0nt.)');

        // ==========================================
        // CRIANDO MONITOR DE TESTE (Pra não ficar vazio)
        // ==========================================
        const senhaMonitor = await bcrypt.hash('123456', salt);
        
        await UserMonitor.create({
            nome: 'Monitor Teste',
            matricula: '12345678', // Seu model de monitor pede matricula
            senha: senhaMonitor,
            role: 'monitor'
        });
        console.log('✅ Monitor Teste criado! (Matrícula: 12345678 / Senha: 123456)');

        console.log('\n🏁 SEED DE USUÁRIOS CONCLUÍDO!');
        process.exit();

    } catch (error) {
        console.error('❌ Erro no seed:', error);
        process.exit(1);
    }
};

seedUsers();