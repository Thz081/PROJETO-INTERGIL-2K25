const multer = require('multer');
const path = require('path');

// Configuração de Armazenamento
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Remove espaços e acentos do nome
        const nomeLimpo = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
        cb(null, `${Date.now()}-${nomeLimpo}`);
    }
});

// Filtro para aceitar apenas imagens (AGORA COM O 'i' NO FINAL)
const imageFilter = (req, file, cb) => {
    // O 'i' no final significa "ignore case" (tanto faz maiúscula ou minúscula)
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return cb(new Error('Apenas arquivos de imagem são permitidos!'), false);
    }
    cb(null, true);
};

// Configuração do Multer
const uploadLogo = multer({ 
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Para PDFs
const uploadGeral = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
});

module.exports = { uploadLogo, uploadGeral, uploadMomento: uploadLogo };