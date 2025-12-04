const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Aluno = require('../models/aluno.model');
const Gestao = require('../models/gestao.model');
const Monitor = require('../models/monitor.model');

const JWT_SECRET = process.env.JWT_SECRET || "segredo-super-secreto";

// === LOGIN ALUNO ===
const loginAluno = async (req, res) => {
    try {
        const { n_inscricao, data_nascimento } = req.body;

        if (!n_inscricao || !data_nascimento) {
            return res.status(400).json({ message: "Preencha todos os campos." });
        }

        const aluno = await Aluno.findOne({ n_inscricao });

        if (!aluno) {
            return res.status(401).json({ message: "Aluno não encontrado." });
        }

        if (aluno.data_nascimento !== data_nascimento) {
            return res.status(401).json({ message: "Data de nascimento incorreta." });
        }
        
        const payload = {
            id: aluno._id, // <--- CORRIGIDO: USAR 'id' IGUAL AOS OUTROS
            nome: aluno.nome,
            n_inscricao: aluno.n_inscricao,
            turma: aluno.turma,
            sexo: aluno.sexo,
            preGil: aluno.preGil,
            role: 'aluno'
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' });
        
        res.status(200).json({ token, user: payload });

    } catch (error) {
        console.error("Erro Login Aluno:", error);
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

// === LOGIN GESTÃO ===
const loginGestao = async (req, res) => {
    try {
        const { nome, senha } = req.body;
        if (!nome || !senha) return res.status(400).json({ message: "Campos obrigatórios." });
        
        const admin = await Gestao.findOne({ nome });
        if (!admin) return res.status(401).json({ message: "Credenciais inválidas." });
        
        const isMatch = await bcrypt.compare(senha, admin.senha);
        if (!isMatch) return res.status(401).json({ message: "Credenciais inválidas." });
        
        const payload = { id: admin._id, nome: admin.nome, role: admin.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
        
        res.status(200).json({ token, user: payload });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

// === LOGIN MONITOR ===
const loginMonitor = async (req, res) => {
    try {
        const { matricula, senha } = req.body;
        if (!matricula || !senha) return res.status(400).json({ message: "Campos obrigatórios." });
        
        const monitor = await Monitor.findOne({ matricula });
        if (!monitor) return res.status(401).json({ message: "Credenciais inválidas." });
        
        const isMatch = await bcrypt.compare(senha, monitor.senha);
        if (!isMatch) return res.status(401).json({ message: "Credenciais inválidas." });
        
        const payload = { id: monitor._id, nome: monitor.nome, role: monitor.role };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
        
        res.status(200).json({ token, user: payload });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};

module.exports = {
    loginAluno,
    loginGestao,
    loginMonitor
};