const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// Middleware para checar se o usuário é admin
function ensureAdmin(req, res, next) {
    if (req.session && req.session.user && req.session.user.is_admin) {
        return next();
    }
    // não autorizado — redireciona para login com mensagem simples
    return res.status(403).send('Acesso negado: painel administrativo.');
}

// Dashboard simples com contadores
router.get('/', ensureAdmin, async (req, res) => {
    try {
        const produtosRes = await db.query('SELECT COUNT(*) AS total FROM produtos');
        const clientesRes = await db.query('SELECT COUNT(*) AS total FROM clientes');
        const produtosTotal = produtosRes.rows[0] ? parseInt(produtosRes.rows[0].total, 10) : 0;
        const clientesTotal = clientesRes.rows[0] ? parseInt(clientesRes.rows[0].total, 10) : 0;

        res.render('admin/dashboard', { produtosTotal, clientesTotal, user: req.session.user });
    } catch (err) {
        console.error('Erro ao carregar dashboard admin:', err);
        res.status(500).send('Erro ao carregar dashboard');
    }
});

// Lista de clientes (sem retornar senhas)
router.get('/clientes', ensureAdmin, async (req, res) => {
    try {
        const result = await db.query('SELECT id, nome, email, telefone FROM clientes ORDER BY id');
        const clientes = result.rows;
        res.render('admin/clientes', { clientes, user: req.session.user });
    } catch (err) {
        console.error('Erro ao listar clientes no admin:', err);
        res.status(500).send('Erro ao listar clientes');
    }
});

module.exports = router;