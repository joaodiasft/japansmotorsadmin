// server/routes/templates.js — CRUD de Modelos de Contrato
import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET /api/templates
router.get('/', async (req, res) => {
  try {
    const templates = await prisma.contractTemplate.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(templates);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/templates
router.post('/', async (req, res) => {
  try {
    const template = await prisma.contractTemplate.create({ data: req.body });
    res.status(201).json(template);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PUT /api/templates/:id
router.put('/:id', async (req, res) => {
  try {
    const data = req.body;
    delete data.id; delete data.createdAt; delete data.updatedAt;
    const template = await prisma.contractTemplate.update({
      where: { id: req.params.id }, data
    });
    res.json(template);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/templates/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.contractTemplate.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
