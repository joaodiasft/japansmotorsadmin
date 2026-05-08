// server/routes/vehicles.js — CRUD de Veículos
import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET /api/vehicles — Lista todos
router.get('/', async (req, res) => {
  try {
    const vehicles = await prisma.vehicle.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(vehicles);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/vehicles — Cria novo
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const vehicle = await prisma.vehicle.create({ data });
    res.status(201).json(vehicle);
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(400).json({ error: 'Placa ou chassi já cadastrado.' });
    }
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/vehicles/:id — Atualiza (status, dados, etc.)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    const vehicle = await prisma.vehicle.update({ where: { id }, data });
    res.json(vehicle);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/vehicles/:id — Exclui
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.vehicle.delete({ where: { id } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
