const express = require('express');
const router = express.Router();
const db = require('../database/connection');

// Rota para retornar todos os produtos cadastrados
router.get('/produtos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM produtos ORDER BY id');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ erro: 'Erro ao buscar produtos' });
  }
});

module.exports = router;
