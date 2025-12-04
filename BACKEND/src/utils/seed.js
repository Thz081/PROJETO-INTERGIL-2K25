// Arquivo: InterDoZero/src/utils/seed.js
// VERSÃO 1.4 - SINCRONIZADO COM OS MODELS (usando 'matricula')

const dotenv = require('dotenv');
const connectDB = require('../config/db.js');
const bcrypt = require('bcrypt');

const Modalidade = require('../models/modalidade.model.js');
const Sala = require('../models/sala.model.js');
const UserAdmin = require('../models/gestao.model.js');
const UserMonitor = require('../models/monitor.model.js');

const { modalidades } = require('../data/modalidadesData.js');
const { fakeSalas } = require('../data/salasData.js');

dotenv.config();

const importData = async () => {
  try {
    await connectDB();
    await Modalidade.deleteMany();
    await Sala.deleteMany();
    await UserAdmin.deleteMany();
    await UserMonitor.deleteMany();
    console.log('Banco de dados limpo...');

    await Modalidade.insertMany(modalidades);
    await Sala.insertMany(fakeSalas);
    console.log('Modalidades e Salas importadas...');

    // === INJETA O SUPERADMIN (CORRIGIDO) ===
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('123456', salt);

    await UserAdmin.create({
      nome: 'Super Admin',
      // 'username' removido, pois não existe no Model
      senha: hashedPassword,
      role: 'gestao'
    });
    console.log('SuperAdmin (gestao) criado! (nome: Super Admin, senha: 123456)');

    // === INJETA O MONITOR DE TESTE (CORRIGIDO) ===
    await UserMonitor.create({
      nome: 'Monitor Teste',
      matricula: '12345678', // <-- CORREÇÃO: 'n_inscricao' -> 'matricula'
      senha: hashedPassword,
      role: 'monitor'
    });
    console.log('Monitor de Teste criado! (matricula: 12345678, senha: 123456)');
    
    console.log('\nDados importados com SUCESSO!');
    process.exit();

  } catch (error) {
    console.error(`Erro ao importar dados: ${error}`);
    process.exit(1);
  }
};

// ... (o 'destroyData' continua o mesmo)
const destroyData = async () => {
    // ... (mesmo código de antes)
};
if (process.argv[2] === '--destroy') {
  destroyData();
} else {
  importData();
}