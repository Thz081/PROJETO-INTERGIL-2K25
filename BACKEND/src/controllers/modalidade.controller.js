// Arquivo: InterDoZero/src/controllers/modalidade.controller.js
// VERSÃO 3.0 - 100% LIMPA E CORRIGIDA

const Aluno = require('../models/aluno.model.js');
const Modalidade = require('../models/modalidade.model.js');
const Inscricao = require('../models/inscricao.model.js');
const Sala = require('../models/sala.model.js');
const Momento = require('../models/momento.model');

// --- FUNÇÃO 1: BUSCAR TODAS AS MODALIDADES ---
const getModalidades = async (req, res) => {
    try {
        const modalidades = await Modalidade.find();
        res.status(200).json(modalidades);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar modalidades.', error });
    }
};

// --- FUNÇÃO 2: VALIDAR INSCRIÇÃO (Placeholder) ---
const validarInscricao = async (req, res) => {
    // (Ainda em construção, mas a rota precisa existir)
    res.status(501).json({ message: "Rota /inscricao ainda em construção." });
};

// --- FUNÇÃO 3: BUSCAR RANKING (Leaderboard) ---
const getRankingSalas = async (req, res) => {
    try {
        const salas = await Sala.find()
            .sort({ pontos: -1 })
            .limit(12);
        res.status(200).json(salas);
    } catch (error) {
        console.error("Erro ao buscar ranking:", error);
        res.status(500).json({ message: "Erro ao buscar ranking." });
    }
};

// --- FUNÇÃO 4: BUSCAR POR SLUG (Página de Detalhe) ---
const getModalidadeBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const modalidade = await Modalidade.findOne({ slug: slug });

    if (modalidade) {
      res.status(200).json(modalidade);
    } else {
      res.status(404).json({ message: "Modalidade não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar modalidade.', error: error.message });
  }
};


// --- GET /api/momentos (Público) ---
const getMomentos = async (req, res) => {
  try {
    const momentos = await Momento.find().sort({ ordem: 1 });
    res.json(momentos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar momentos.' });
  }
};

// --- EXPORTA AS QUATRO FUNÇÕES ---
module.exports = {
    getModalidades,
    validarInscricao,
    getRankingSalas,
    getModalidadeBySlug,
    getMomentos
};