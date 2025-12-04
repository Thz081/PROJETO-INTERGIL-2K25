const express = require('express');
const {
    loginAluno,
    loginGestao,
    loginMonitor
} = require('../controllers/auth.controller');

const router = express.Router();

// Rota de login para alunos
router.post('/login', loginAluno);

// Rota de login para a equipe de gestão
router.post('/login-gestao', loginGestao);

// Rota de login para monitores
router.post('/login-monitor', loginMonitor);

module.exports = router;
