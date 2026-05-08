// server/routes/customers.js — CRUD de Clientes
import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET /api/customers — Lista todos
router.get('/', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(customers);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/customers — Cria novo
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const customer = await prisma.customer.create({ data });
    res.status(201).json(customer);
  } catch (e) {
    if (e.code === 'P2002') {
      return res.status(400).json({ error: 'CPF já cadastrado no sistema.' });
    }
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/customers/:id — Atualiza
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    delete data.id;
    delete data.createdAt;
    delete data.updatedAt;
    const customer = await prisma.customer.update({ where: { id }, data });
    res.json(customer);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/customers/:id — Exclui
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.customer.delete({ where: { id } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
