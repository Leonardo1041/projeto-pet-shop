
const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// Helper para normalizar o retorno do banco (Postgres vs MySQL)
const getRows = (result) => {
    if (!result) return [];
    if (result.rows) return result.rows;
    if (Array.isArray(result)) return result;
    return [];
};

// Rota: GET /api/produtos ou /api/produtos/
router.get(['/', ''], async (req, res) => {
  try {
    console.log('[API] Buscando produtos...');
    const result = await db.query('SELECT * FROM produtos ORDER BY id');
    const items = getRows(result);
    console.log(`[API] Produtos encontrados: ${items.length}`);
    res.status(200).json(items);
  } catch (err) {
    console.error('[API] Erro ao buscar produtos:', err);
    res.status(500).json({ erro: 'Erro ao buscar produtos: ' + err.message });
  }
});

module.exports = router;