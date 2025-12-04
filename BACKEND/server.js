const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); 
const fs = require('fs');

dotenv.config();
const connectDB = require('./src/config/db.js');

// Rotas
const authRoutes = require('./src/routes/auth.routes.js');
const apiRoutes = require('./src/routes/api.routes.js');
const adminRoutes = require('./src/routes/admin.routes.js');
const monitorRoutes = require('./src/routes/monitor.routes.js');
const inscricaoRoutes = require('./src/routes/inscricao.routes.js');

connectDB();
const app = express();

// 1. LIBERA GERAL (CORS)
app.use(cors({ origin: '*' }));
app.use(express.json());

// 2. CONFIGURAÇÃO CORRETA DO CAMINHO DE UPLOADS
// O server.js está na raiz do BACKEND, e a pasta uploads também.
// Então é só juntar __dirname (pasta atual) com 'uploads'.
const uploadsPath = path.join(__dirname, 'uploads');

// Debug: Mostra no terminal onde ele está procurando
if (fs.existsSync(uploadsPath)) {
    console.log(`✅ Pasta de uploads encontrada em: ${uploadsPath}`);
} else {
    console.error(`❌ ERRO CRÍTICO: Pasta uploads NÃO achada em: ${uploadsPath}`);
    console.log("👉 Verifique se a pasta 'uploads' está ao lado do 'server.js'");
    // Tenta criar se não existir pra não quebrar
    try {
        fs.mkdirSync(uploadsPath, { recursive: true });
        console.log("🔧 Pasta uploads criada automaticamente.");
    } catch (e) {
        console.error("Não foi possível criar a pasta.");
    }
}

// Serve a pasta
app.use('/arquivos', express.static(uploadsPath));
// Garante compatibilidade se alguém chamar /api/uploads
app.use('/api/uploads', express.static(uploadsPath));

app.use('/api/arquivos', express.static(uploadsPath));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/monitor', monitorRoutes);
app.use('/api/inscricoes', inscricaoRoutes);
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => { 
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
});