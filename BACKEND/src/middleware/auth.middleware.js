// Arquivo: InterDoZero/src/middleware/auth.middleware.js

const jwt = require('jsonwebtoken');
const UserAdmin = require('../models/gestao.model'); // Modelo de Gestão
const UserMonitor = require('../models/monitor.model'); // Modelo de Monitor

// Middleware 1: Apenas checa se o token é válido
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 1. Pega o token do header (ex: "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // 2. Verifica o token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Adiciona o 'user' ao 'req' para as próximas rotas usarem
      // NOTA: O payload do seu amigo já tem a role, então isso é mais simples
      req.user = decoded; 
      
      next();
    } catch (error) {
      console.error('Erro no token:', error);
      res.status(401).json({ message: 'Não autorizado, token falhou' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Não autorizado, sem token' });
  }
};

// Middleware 2: Checa se é Admin (Gestão)
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'gestao') {
    next(); // É admin, pode passar
  } else {
    res.status(403).json({ message: 'Acesso negado. Requer privilégios de Gestão.' });
  }
};

// Middleware 3: Checa se é Monitor
const isMonitor = (req, res, next) => {
    if (req.user && req.user.role === 'monitor') {
      next(); // É monitor, pode passar
    } else {
      res.status(403).json({ message: 'Acesso negado. Requer privilégios de Monitor.' });
    }
  };

module.exports = { protect, isAdmin, isMonitor };