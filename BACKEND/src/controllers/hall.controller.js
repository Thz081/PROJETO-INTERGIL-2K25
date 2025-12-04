const Hall = require('../models/hall.model');
const fs = require('fs');
const path = require('path');

exports.getHall = async (req, res) => {
    try {
        const hall = await Hall.find().sort({ ano: -1 });
        res.json(hall);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar Hall." });
    }
};

exports.createEntry = async (req, res) => {
    try {
        const { ano, turma, pontos, instagram } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "A imagem é obrigatória!" });
        }

        // === AQUI MUDOU ===
        // Salva no banco como '/arquivos/...' para o frontend ler
        const logo_path = `/arquivos/${req.file.filename}`;

        const novo = await Hall.create({
            ano,
            turma,
            pontos,
            instagram,
            logo_path
        });

        res.status(201).json(novo);
    } catch (error) {
        console.error("Erro Hall:", error);
        res.status(500).json({ message: "Erro ao salvar." });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const item = await Hall.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Não encontrado." });

        // Para deletar, precisamos saber o nome real do arquivo
        // O path no banco é "/arquivos/123-FOTO.png", pegamos só o final
        const nomeArquivo = item.logo_path.split('/').pop();
        
        // O arquivo físico continua na pasta 'uploads'
        const caminhoFisico = path.join(__dirname, '../../uploads', nomeArquivo);
        
        if (fs.existsSync(caminhoFisico)) {
            fs.unlinkSync(caminhoFisico);
        }

        await Hall.findByIdAndDelete(req.params.id);
        res.json({ message: "Deletado com sucesso." });
    } catch (error) {
        res.status(500).json({ message: "Erro ao deletar." });
    }
};