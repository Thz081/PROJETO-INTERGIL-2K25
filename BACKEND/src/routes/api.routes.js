const express = require('express');
const router = express.Router();
const path = require('path'); 

// Controllers
const { getModalidades, getModalidadeBySlug, validarInscricao, getRankingSalas, getMomentos } = require('../controllers/modalidade.controller.js');
const { getConfig } = require('../controllers/config.controller');
const hallController = require('../controllers/hall.controller'); // <--- NOVO

// Rotas Públicas
router.get('/modalidades', getModalidades);
router.get('/modalidades/:slug', getModalidadeBySlug); 
router.post('/inscricao', validarInscricao);
router.get('/ranking/salas', getRankingSalas);
router.get('/momentos', getMomentos);
router.get('/config', getConfig);

// Rota Hall Pública
router.get('/hall', hallController.getHall); // <--- NOVO

// Edital Download
router.get('/edital-geral', (req, res) => {
  const filePath = path.join(process.cwd(), 'uploads', 'EDITAL_GERAL_2K25.pdf');
  res.download(filePath, 'Edital_Geral.pdf', (err) => {
    if(err) res.status(404).send('Edital não encontrado.');
  });
});

module.exports = router;