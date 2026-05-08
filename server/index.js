// server/index.js — Servidor local (desenvolvimento)
import app from './app.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`\n🚀 Japan Motors API rodando em http://localhost:${PORT}`);
  console.log(`📊 Banco: Neon PostgreSQL (conectado via Prisma)\n`);
});
