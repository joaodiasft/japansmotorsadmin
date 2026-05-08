// server/app.js — Express app configurado (sem listen) para uso local e Vercel
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import customersRouter from './routes/customers.js';
import vehiclesRouter from './routes/vehicles.js';
import salesRouter from './routes/sales.js';
import templatesRouter from './routes/templates.js';

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Japan Motors API' });
});

// Rotas
app.use('/api/customers', customersRouter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/sales', salesRouter);
app.use('/api/templates', templatesRouter);

// Handler de erro global
app.use((err, req, res, next) => {
  console.error('[Server Error]', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

export default app;
