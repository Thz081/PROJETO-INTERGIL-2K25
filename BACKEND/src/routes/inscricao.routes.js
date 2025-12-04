const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware'); // Importante!
const { criarInscricao, getMinhaInscricao, deleteMinhaInscricao, getContagemTurma} = require('../controllers/inscricao.controller');

// Todas as rotas aqui precisam de login (protect)
router.post('/', protect, criarInscricao);
router.get('/me', protect, getMinhaInscricao);
router.delete('/me', protect, deleteMinhaInscricao);
router.get('/contagem', getContagemTurma);

module.exports = router;