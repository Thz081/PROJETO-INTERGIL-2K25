const Inscricao = require('../models/inscricao.model');
const Aluno = require('../models/aluno.model');
const Modalidade = require('../models/modalidade.model');

// ==================================================
// 1. CRIAR INSCRIÇÃO (Lógica de Limites e IDs Numéricos)
// ==================================================
const criarInscricao = async (req, res) => {
  try {
    const alunoId = req.user.id || req.user._id;
    const { modalidades, pontuacaoTotal } = req.body; 

    if (!modalidades || modalidades.length === 0) {
      return res.status(400).json({ message: "Nenhuma modalidade selecionada." });
    }

    // 1. Busca o Aluno
    const aluno = await Aluno.findById(alunoId);
    if (!aluno) return res.status(404).json({ message: "Aluno não encontrado." });

    // 2. Verifica duplicidade
    const inscricaoExistente = await Inscricao.findOne({ aluno: alunoId });
    if (inscricaoExistente) {
      return res.status(400).json({ message: "Você já realizou sua inscrição!" });
    }

    // === VALIDAÇÃO DE LIMITES POR SALA ===
    const idsColegasDeTurma = await Aluno.find({ turma: aluno.turma }).distinct('_id');

    for (const escolha of modalidades) {
        // O formato esperado é "12-0" (ID Numérico - Index) ou "4" (ID Numérico Simples)
        
        let modalidadeId, subIndex;
        
        if (escolha.includes('-')) {
            const parts = escolha.split('-');
            modalidadeId = parseInt(parts[0]); // Converte para Inteiro
            subIndex = parseInt(parts[1]);
        } else {
            modalidadeId = parseInt(escolha);
            subIndex = -1;
        }
        
        // Busca Modalidade pelo ID Numérico
        const modDoc = await Modalidade.findById(modalidadeId);
        
        if (modDoc) {
            let limite = modDoc.max_inscritos || 99; 
            let nomeValidacao = modDoc.nome;
            
            // Verifica limite da sub específica
            if (subIndex >= 0 && modDoc.submodalidades[subIndex]) {
                const sub = modDoc.submodalidades[subIndex];
                nomeValidacao = `${modDoc.nome} (${sub.nome})`;
                if (sub.max_inscritos) {
                    limite = sub.max_inscritos;
                }
            }

            // Conta quantos da turma já têm essa string exata no array
            const contagem = await Inscricao.countDocuments({
                aluno: { $in: idsColegasDeTurma },
                modalidades: escolha 
            });

            if (contagem >= limite) {
                return res.status(400).json({ 
                    message: `Limite da turma atingido! ${aluno.turma} já tem ${limite} inscritos em ${nomeValidacao}.` 
                });
            }
        }
    }

    // 3. Cria a inscrição
    const novaInscricao = await Inscricao.create({
      aluno: alunoId,
      modalidades: modalidades, 
      pontuacaoTotal: pontuacaoTotal
    });

    await Aluno.findByIdAndUpdate(alunoId, {
      $push: { inscricoes: novaInscricao._id }
    });

    res.status(201).json({ 
      message: "Inscrição realizada com sucesso!", 
      inscricao: novaInscricao 
    });

  } catch (error) {
    console.error("Erro fatal na inscrição:", error);
    res.status(500).json({ message: "Erro interno: " + error.message });
  }
};

// ==================================================
// 2. VER MINHA INSCRIÇÃO
// ==================================================
const getMinhaInscricao = async (req, res) => {
    try {
        const inscricao = await Inscricao.findOne({ aluno: req.user.id });
        
        if (!inscricao) {
            return res.status(404).json({ message: "Você ainda não realizou sua inscrição." });
        }

        res.json(inscricao);

    } catch (error) {
        console.error("Erro ao buscar inscrição:", error);
        res.status(500).json({ message: "Erro ao buscar sua inscrição." });
    }
};

// ==================================================
// 3. CANCELAR INSCRIÇÃO
// ==================================================
const deleteMinhaInscricao = async (req, res) => {
  try {
    const alunoId = req.user.id;

    // 1. Acha e deleta a inscrição
    const inscricao = await Inscricao.findOneAndDelete({ aluno: alunoId });

    if (!inscricao) {
      return res.status(404).json({ message: "Nenhuma inscrição encontrada para cancelar." });
    }

    // 2. Limpa a referência no Aluno (Zera o array inscricoes)
    await Aluno.findByIdAndUpdate(alunoId, {
      $set: { inscricoes: [] } 
    });

    res.json({ message: "Inscrição cancelada com sucesso!" });

  } catch (error) {
    console.error("Erro ao cancelar inscrição:", error);
    res.status(500).json({ message: "Erro ao cancelar inscrição." });
  }
};


const getContagemTurma = async (req, res) => {
    try {
        const { turma } = req.user; // Pega do token/middleware

        // 1. Acha todos os alunos dessa turma
        const colegas = await Aluno.find({ turma }).select('_id');
        const idsColegas = colegas.map(c => c._id);

        // 2. Acha todas as inscrições desses alunos
        const inscricoes = await Inscricao.find({ aluno: { $in: idsColegas } }).select('modalidades');

        // 3. Conta quantas vezes cada modalidade aparece
        const contagem = {};
        
        inscricoes.forEach(insc => {
            insc.modalidades.forEach(item => {
                // item é algo como "12-0" ou "1"
                contagem[item] = (contagem[item] || 0) + 1;
            });
        });

        res.json(contagem); // Retorna { "1": 5, "12-0": 8, ... }

    } catch (error) {
        console.error("Erro contagem:", error);
        res.status(500).json({ message: "Erro ao contar vagas." });
    }
};

// EXPORTAÇÃO LIMPA (Isso resolve o erro do Router)
module.exports = {
    criarInscricao,
    getMinhaInscricao,
    deleteMinhaInscricao,
    getContagemTurma
};