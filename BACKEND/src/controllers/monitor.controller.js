// Arquivo: InterDoZero/src/controllers/monitor.controller.js
// VERSÃO 3.0 - 100% COMPLETO (COM 'require' E TODAS AS 5 FUNÇÕES)

const Modalidade = require('../models/modalidade.model.js');
const LogAcao = require('../models/logAcao.model.js');
const mongoose = require('mongoose'); 

// --- FUNÇÃO HELPER (A mesma do Admin, para os Logs) ---
const getAutorLog = (req) => {
  const nomeAutor = req.user.nome || 'Usuário Desconhecido';
  const roleAutor = req.user.role || 'desconhecido';
  
  let roleFormatada = '';
  if (roleAutor === 'gestao') roleFormatada = 'Gestão';
  else if (roleAutor === 'monitor') roleFormatada = 'Monitor';
  else roleFormatada = roleAutor.charAt(0).toUpperCase() + roleAutor.slice(1);
  
  return `${roleFormatada}: ${nomeAutor}`;
};

// ===================================
// === 1. CONTROLLER DE HORÁRIOS (GET) ===
// ===================================
const getHorarios = async (req, res) => {
  try {
    // Busca 'submodalidades' também (para o dropdown cascata)
    const modalidades = await Modalidade.find().select('nome horarios submodalidades');
    res.status(200).json(modalidades);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar horários.', error: error.message });
  }
};

// ===================================
// === 2. CONTROLLER DE HORÁRIOS (POST) ===
// ===================================
const addHorario = async (req, res) => {
  try {
    // 'categoria' agora é o NOME (ex: "5x5 (Masculino)")
    const { modId, categoria, data, horario, local } = req.body;
    if (!modId || !categoria || !data || !horario || !local) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }
    const modalidade = await Modalidade.findById(modId);
    if (!modalidade) {
      return res.status(404).json({ message: 'Modalidade não encontrada.' });
    }
    const novoHorario = {
      _id: new mongoose.Types.ObjectId(),
      categoria, data, horario, local
    };
    modalidade.horarios.push(novoHorario);
    await modalidade.save();
    
    await LogAcao.create({
        autor: getAutorLog(req),
        acao: `Adicionou horário [${categoria}] na modalidade [${modalidade.nome}]`
    });
    res.status(201).json(modalidade);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao adicionar horário.', error: error.message });
  }
};

// ===================================
// === 3. CONTROLLER DE HORÁRIOS (DELETE) ===
// ===================================
const deleteHorario = async (req, res) => {
  try {
    const { modId, horarioId } = req.params;
    const modalidade = await Modalidade.findById(modId);
    if (!modalidade) {
      return res.status(404).json({ message: 'Modalidade não encontrada.' });
    }
    const horario = modalidade.horarios.find(h => h._id.toString() === horarioId);
    const categoriaLog = horario ? horario.categoria : 'horário desconhecido';

    modalidade.horarios.pull({ _id: horarioId });
    await modalidade.save();

    await LogAcao.create({
        autor: getAutorLog(req),
        acao: `Apagou horário [${categoriaLog}] da modalidade [${modalidade.nome}]`
    });
    res.status(200).json({ message: 'Horário apagado com sucesso.' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao apagar horário.', error: error.message });
  }
};

// ===================================
// === 4. CONTROLLER DE LINKS (GET) ===
// (A que estava faltando)
// ===================================
const getModalidadesParaLinks = async (req, res) => {
  try {
    const modalidades = await Modalidade.find().select('nome submodalidades');
    res.status(200).json(modalidades);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar modalidades.', error: error.message });
  }
};

// ===================================
// === 5. CONTROLLER DE LINKS (POST/UPDATE) ===
// (A que estava faltando)
// ===================================
const updateLink = async (req, res) => {
  try {
    const { modId, subNome, tipoLink, url } = req.body;
    if (!modId || !subNome || !tipoLink) {
      return res.status(400).json({ message: 'Dados incompletos para atualizar link.' });
    }
    const urlFinal = url || '#';
    const modalidade = await Modalidade.findById(modId);
    if (!modalidade) {
      return res.status(404).json({ message: 'Modalidade não encontrada.' });
    }
    const sub = modalidade.submodalidades.find(s => s.nome === subNome);
    if (!sub) {
        return res.status(404).json({ message: 'Submodalidade não encontrada.' });
    }
    if (tipoLink === 'edital') {
        sub.edital = urlFinal;
    } else if (tipoLink === 'chaveamento') {
        sub.chaveamento = urlFinal;
    } else {
        return res.status(400).json({ message: 'Tipo de link inválido.' });
    }
    await modalidade.save();
    
    await LogAcao.create({
        autor: getAutorLog(req),
        acao: `Atualizou link [${tipoLink}] para [${subNome}]`
    });
    res.status(200).json(modalidade);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar link.', error: error.message });
  }
};

// Arquivo: InterDoZero/src/controllers/monitor.controller.js
// (COLE ISSO NO FINAL, ANTES DO 'module.exports')

// ===================================
// === 6. CONTROLLER DE UPLOAD (NOVO) ===
// (Esta função só roda DEPOIS que o 'multer' salvou o arquivo)
// ===================================
const uploadEdital = async (req, res) => {
  try {
    // 1. O 'multer' nos dá o arquivo em 'req.file'
    // e os dados do formulário em 'req.body'
    const { modId, subNome } = req.body;
    const arquivo = req.file;

    if (!arquivo) {
      return res.status(400).json({ message: 'Nenhum arquivo .pdf foi enviado.' });
    }
    if (!modId || !subNome) {
      return res.status(400).json({ message: 'Modalidade/Sub não selecionada.' });
    }

    // 2. Monta a URL pública do arquivo
    // (O 'server.js' fez 'uploads/' virar '/uploads')
    const urlPublica = `/uploads/${arquivo.filename}`;

    // 3. Salva essa URL no banco de dados (igual ao updateLink)
    const modalidade = await Modalidade.findById(modId);
    if (!modalidade) {
      return res.status(404).json({ message: 'Modalidade não encontrada.' });
    }
    const sub = modalidade.submodalidades.find(s => s.nome === subNome);
    if (!sub) {
        return res.status(404).json({ message: 'Submodalidade não encontrada.' });
    }

    // 4. Salva o CAMINHO no campo 'edital'
    sub.edital = urlPublica;
    await modalidade.save();
    
    // 5. Cria o Log
    await LogAcao.create({
        autor: getAutorLog(req),
        acao: `Fez upload do Edital [${arquivo.filename}] para [${subNome}]`
    });

    res.status(200).json({ message: 'Edital enviado com sucesso!', modalidade });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao processar upload.', error: error.message });
  }
};

// === EXPORTA TUDO (TODAS AS 5) ===
module.exports = {
  getHorarios,
  addHorario,
  deleteHorario,
  getModalidadesParaLinks,
  updateLink,
  uploadEdital
};