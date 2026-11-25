
import express from 'express';
import { buscarLocalPorId } from '../repository/locaisRepository.js';

const router = express.Router();

router.get('/locais/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || Number(id) <= 0) {
      return res.status(400).json({
        erro: 'ID do estabelecimento inválido.'
      });
    }

    const local = await buscarLocalPorId(Number(id));

    if (!local) {
      return res.status(404).json({
        erro: 'Estabelecimento não encontrado.'
      });
    }

    return res.status(200).json(local);

  } catch (err) {
    console.error('Erro ao buscar detalhes do local:', err.message);

    return res.status(500).json({
      erro: 'Não foi possível buscar os detalhes do estabelecimento.'
    });
  }
});

export default router;
