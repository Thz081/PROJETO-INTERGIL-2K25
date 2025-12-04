
// === GERENCIAMENTO DE MODALIDADES ===
const Modalidade = require('../models/modalidade.model');
const Hall = require('../models/hall.model');
const Sala = require('../models/sala.model');
const fs = require('fs');
const path = require('path');

// === GERENCIAMENTO DE MODALIDADES ===

exports.createModalidade = async (req, res) => {
    try {
        const { nome, tipo, max_inscritos, subcategorias } = req.body;
        
        const slug = nome.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        // --- LÓGICA DE UPLOAD DUPLO ---
        // O Multer joga os arquivos em req.files['nomeDoCampo']
        const files = req.files || {};
        
        // Pega os caminhos ou define um padrão
        const imgCarrossel = files['imgCarrossel'] ? `/arquivos/${files['imgCarrossel'][0].filename}` : '/images/gameon-logo.png';
        const imgDetalhe = files['imgDetalhe'] ? `/arquivos/${files['imgDetalhe'][0].filename}` : '/images/gameon-logo.png';

        // Tratamento de Subcategorias (Mantém sua lógica)
        let submodalidadesFormatadas = [];
        if (subcategorias) {
            let listaBruta = [];
            try {
                if (typeof subcategorias === 'string') {
                    if (subcategorias.trim().startsWith('[')) {
                        listaBruta = JSON.parse(subcategorias);
                    } else {
                        listaBruta = subcategorias.split(',');
                    }
                } else if (Array.isArray(subcategorias)) {
                    listaBruta = subcategorias;
                }
            } catch (e) {
                console.log("Erro ao parsear subcategorias.");
            }

            submodalidadesFormatadas = listaBruta.map(item => {
                const nomeSub = typeof item === 'string' ? item.trim() : item.nome;
                if (!nomeSub) return null;
                return {
                    nome: nomeSub,
                    isPrincipal: true,
                    inscricao: true,
                    genero: 'X'
                };
            }).filter(Boolean);
        }

        // Tenta achar o maior ID numérico atual para gerar o próximo (auto-increment manual)
        const lastMod = await Modalidade.findOne().sort({ _id: -1 });
        const newId = lastMod && typeof lastMod._id === 'number' ? lastMod._id + 1 : 1;

        const novaModalidade = await Modalidade.create({
            _id: newId, // Garante ID numérico
            nome,
            slug,
            imgCarrossel, // Novo
            imgDetalhe,   // Novo
            imageUrl: imgCarrossel, // Retrocompatibilidade
            isAvulsoSimples: tipo === 'individual',
            max_inscritos: Number(max_inscritos) || 20, 
            submodalidades: submodalidadesFormatadas,
        });

        res.status(201).json(novaModalidade);

    } catch (error) {
        console.error("Erro createModalidade:", error);
        res.status(500).json({ message: "Erro ao criar modalidade", error: error.message });
    }
};

// === NOVA FUNÇÃO: ATUALIZAR MODALIDADE (COM FOTOS) ===
exports.updateModalidade = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, max_inscritos } = req.body;
        
        const modalidade = await Modalidade.findById(id);
        if (!modalidade) return res.status(404).json({ message: "Modalidade não encontrada" });

        const files = req.files || {};
        
        // Se enviou nova foto, atualiza. Se não, mantém a antiga.
        if (files['imgCarrossel']) {
            modalidade.imgCarrossel = `/arquivos/${files['imgCarrossel'][0].filename}`;
            modalidade.imageUrl = modalidade.imgCarrossel; // Mantém sync
        }
        
        if (files['imgDetalhe']) {
            modalidade.imgDetalhe = `/arquivos/${files['imgDetalhe'][0].filename}`;
        }

        if (nome) {
            modalidade.nome = nome;
            // Atualiza slug se mudar o nome? Melhor evitar para não quebrar links, mas ok.
        }
        
        if (max_inscritos) modalidade.max_inscritos = Number(max_inscritos);

        await modalidade.save();
        res.json({ message: "Atualizado com sucesso!", data: modalidade });

    } catch (error) {
        console.error("Erro updateModalidade:", error);
        res.status(500).json({ message: "Erro ao atualizar" });
    }
};

exports.deleteModalidade = async (req, res) => {
    try {
        await Modalidade.findByIdAndDelete(req.params.id);
        res.json({ message: "Modalidade removida com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar modalidade" });
    }
};