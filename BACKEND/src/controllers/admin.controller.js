// Arquivo: InterDoZero/src/controllers/admin.controller.js
// VERSÃO 3.3 - CORREÇÃO PATH MOMENTOS

const Sala = require('../models/sala.model');
const LogAcao = require('../models/logAcao.model');
const Inscricao = require('../models/inscricao.model');
const Aluno = require('../models/aluno.model');
const Momento = require('../models/momento.model');

const getAutorLog = (req) => {
  const nomeAutor = req.user.nome || 'Usuário Desconhecido';
  const roleAutor = req.user.role || 'desconhecido';
  let roleFormatada = (roleAutor === 'gestao') ? 'Gestão' : 'Monitor';
  return `${roleFormatada}: ${nomeAutor}`;
};

// --- GET SALAS (OK) ---
const getSalasAdmin = async (req, res) => {
  try {
    const salas = await Sala.find().sort({ turma: 1 });
    res.status(200).json(salas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar salas.', error: error.message });
  }
};

// --- CREATE SALA (OK) ---
const createSala = async (req, res) => {
  try {
    const { nome, logo_url, turma, instagram } = req.body;
    if (!nome || !turma) {
      return res.status(400).json({ message: 'Nome e Turma são obrigatórios.' });
    }
    const novaSala = new Sala({
      nome,
      logo_url: logo_url || '/images/sala_padrao.png',
      turma: turma,
      instagram: instagram || '#',
      pontos: 0
    });
    const salaSalva = await novaSala.save();
    await LogAcao.create({
        autor: getAutorLog(req),
        acao: `Criou a sala: ${salaSalva.nome} (Turma: ${salaSalva.turma})`
    });
    res.status(201).json(salaSalva);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar sala.', error: error.message });
  }
};

// --- UPDATE SALA (OK) ---
const updateSala = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, logo_url, turma, instagram } = req.body;
    const sala = await Sala.findById(id);
    if (!sala) return res.status(404).json({ message: 'Sala não encontrada.' });
    
    sala.nome = nome || sala.nome;
    sala.logo_url = logo_url || sala.logo_url;
    sala.turma = turma || sala.turma;
    sala.instagram = instagram || sala.instagram;
    const salaAtualizada = await sala.save();
    
    await LogAcao.create({
        autor: getAutorLog(req),
        acao: `Editou os dados da sala: ${salaAtualizada.nome}`
    });
    res.status(200).json(salaAtualizada);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar sala.', error: error.message });
  }
};

// --- DELETE SALA (OK) ---
const deleteSala = async (req, res) => {
  try {
    const { id } = req.params;
    const sala = await Sala.findById(id);
    if (!sala) return res.status(404).json({ message: 'Sala não encontrada.' });
    const nomeSalaApagada = sala.nome;
    await sala.deleteOne();
    await LogAcao.create({
        autor: getAutorLog(req),
        acao: `Apagou a sala: ${nomeSalaApagada}`
    });
    res.status(200).json({ message: 'Sala apagada com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao apagar sala.', error: error.message });
  }
};

// --- UPDATE PONTOS (OK) ---
const updatePontos = async (req, res) => {
  try {
    const { salaId, pontos } = req.body;
    const sala = await Sala.findById(salaId);
    if (!sala) return res.status(404).json({ message: 'Sala não encontrada.' });
    
    sala.pontos = (sala.pontos || 0) + pontos;
    const salaAtualizada = await sala.save();
    
    const acaoLog = `${pontos > 0 ? 'Adicionou' : 'Removeu'} ${Math.abs(pontos)} pontos da sala ${sala.nome}.`;
    await LogAcao.create({
      autor: getAutorLog(req),
      acao: acaoLog
    });
    res.status(200).json(salaAtualizada);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar pontos.', error: error.message });
  }
};

// --- GET LOGS (OK) ---
const getLogs = async (req, res) => {
    try {
      const logs = await LogAcao.find().sort({ timestamp: -1 }).limit(100);
      res.status(200).json(logs);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar logs.', error: error.message });
    }
  };

// --- GET ALL INSCRICOES (OK) ---
const getAllInscricoes = async (req, res) => {
  try {
    const inscricoes = await Inscricao.find({})
      .populate('aluno', 'nome turma n_inscricao')
      .sort({ 'aluno.nome': 1 }); 
    if (!inscricoes) return res.status(404).json({ message: "Nenhuma inscrição encontrada." });
    res.json(inscricoes);
  } catch (error) {
    console.error("Erro ao buscar todas as inscrições:", error);
    res.status(500).json({ message: "Erro no servidor ao buscar inscrições." });
  }
};

// === UPLOAD EDITAL GERAL ===
const uploadEditalGeral = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nenhum arquivo .pdf foi enviado.' });
    }
  
    // O arquivo já foi salvo como "EDITAL_GERAL_2K25.pdf" pelo middleware
    const filePath = req.file.path;
  
    await LogAcao.create({
      autor: getAutorLog(req),
      acao: `Fez upload do novo Edital Geral (arquivo: ${req.file.filename})`
    });
  
    res.status(200).json({
      message: 'Edital Geral enviado com sucesso!',
      filePath: `/${filePath}` 
    });
    
  } catch (error) {
    console.error("Erro ao salvar Edital Geral:", error);
    res.status(500).json({ message: "Erro no servidor ao salvar Edital Geral." });
  }
};


// --- GET MOMENTOS ---
const getAllMomentosAdmin = async (req, res) => {
  try {
    const momentos = await Momento.find().sort({ ordem: 1 });
    res.json(momentos);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar momentos.' });
  }
};

/// --- POST MOMENTOS (CORRIGIDO) ---
const createMomento = async (req, res) => {
  try {
    const { titulo, tipo, ordem } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'É obrigatório enviar um arquivo (Foto ou Vídeo).' });
    }

    if (!titulo) {
      return res.status(400).json({ message: 'Título é obrigatório.' });
    }
    
    // === CORREÇÃO AQUI ===
    // Salva como /arquivos/nome-do-arquivo para o front ler certo
    const urlArquivo = `/arquivos/${req.file.filename}`; 

    const novoMomento = await Momento.create({ 
      titulo, 
      url: urlArquivo, 
      tipo, 
      ordem 
    });
    
    await LogAcao.create({
      autor: getAutorLog(req),
      acao: `Criou um novo Momento (Upload): ${novoMomento.titulo}`
    });
    
    res.status(201).json(novoMomento);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar momento.', error: error.message });
  }
};

// --- DELETE MOMENTO ---
const deleteMomento = async (req, res) => {
  try {
    const { id } = req.params;
    const momento = await Momento.findById(id);
    if (!momento) {
      return res.status(404).json({ message: 'Momento não encontrado.' });
    }
    
    await momento.deleteOne();
    
    await LogAcao.create({
      autor: getAutorLog(req),
      acao: `Deletou o Momento: ${momento.titulo}`
    });
    
    res.status(200).json({ message: 'Momento deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar momento.' });
  }
};


module.exports = {
  getSalasAdmin,
  createSala,
  updateSala,
  deleteSala,
  updatePontos,
  getAllInscricoes,
  getLogs,
  uploadEditalGeral,
  getAllMomentosAdmin,
  createMomento,
  deleteMomento
};