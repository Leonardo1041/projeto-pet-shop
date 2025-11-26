
const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// Middleware para checar se o usuário é admin
function ensureAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.is_admin) {
        return next();
    }
    // Retorna erro 403 se não for admin
    return res.status(403).json({ error: 'Acesso negado: painel administrativo.' });
}

// Helper para contar linhas (PG ou MySQL)
const getCount = (result) => {
    if (!result) return 0;
    // Postgres retorna rows[0].total como string às vezes
    // MySQL retorna array de objetos
    const rows = result.rows || result;
    if (rows && rows.length > 0) {
        return parseInt(rows[0].total || rows[0].count || 0, 10);
    }
    return 0;
};

// Dashboard Stats (API)
router.get('/', ensureAdmin, async (req, res) => {
    try {
        const produtosRes = await db.query('SELECT COUNT(*) AS total FROM produtos');
        const clientesRes = await db.query('SELECT COUNT(*) AS total FROM clientes');
        
        const produtosTotal = getCount(produtosRes);
        const clientesTotal = getCount(clientesRes);

        res.json({ 
            produtos: produtosTotal, 
            clientes: clientesTotal,
            vendasHoje: 0 // Mock por enquanto
        });
    } catch (err) {
        console.error('Erro ao carregar dashboard admin:', err);
        res.status(500).json({ error: 'Erro ao carregar dados do dashboard' });
    }
});

// Lista de clientes
router.get('/clientes', ensureAdmin, async (req, res) => {
    try {
        const result = await db.query('SELECT id, nome, email, telefone FROM clientes ORDER BY id');
        const clientes = result.rows || result;
        res.json(clientes);
    } catch (err) {
        console.error('Erro ao listar clientes no admin:', err);
        res.status(500).json({ error: 'Erro ao listar clientes' });
    }
});

module.exports = router;