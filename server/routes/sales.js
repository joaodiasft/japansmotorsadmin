// server/routes/sales.js — CRUD de Vendas
import { Router } from 'express';
import { prisma } from '../db.js';

const router = Router();

// GET /api/sales — Lista todas com cliente e veículo
router.get('/', async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: { customer: true, vehicle: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(sales);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/sales/:id — Detalhe da venda
router.get('/:id', async (req, res) => {
  try {
    const sale = await prisma.sale.findUnique({
      where: { id: req.params.id },
      include: { customer: true, vehicle: true }
    });
    if (!sale) return res.status(404).json({ error: 'Venda não encontrada.' });
    res.json(sale);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/sales — Cria nova venda
router.post('/', async (req, res) => {
  try {
    const {
      customerId, vehicleId, saleDate,
      totalValue, cashValue, financedValue, financeHistory,
      despachanteFee, tacFee, observations, templateId,
      installments, installmentValue, applyInterest, interestRate,
      firstDueDate, payableAt, valueWords
    } = req.body;

    // Cria a venda
    const sale = await prisma.sale.create({
      data: {
        customerId, vehicleId, saleDate,
        totalValue, cashValue, financedValue, financeHistory,
        despachanteFee, tacFee, observations, templateId,
        installments: installments ? parseInt(installments) : null,
        installmentValue, applyInterest: applyInterest || false,
        interestRate, firstDueDate, payableAt, valueWords
      },
      include: { customer: true, vehicle: true }
    });

    // Marca veículo como vendido
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { status: 'sold' }
    });

    res.status(201).json(sale);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/sales/:id
router.delete('/:id', async (req, res) => {
  try {
    await prisma.sale.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
