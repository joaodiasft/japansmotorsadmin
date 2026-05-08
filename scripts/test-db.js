// Script de teste de conexão com o banco Neon
// Prisma v7 com adaptador @prisma/adapter-pg
// Execute: node scripts/test-db.js

import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/index.js';

const { Pool } = pg;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ['error'] });

async function main() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    console.log('');
    console.log('✅  banco ok');
    console.log('');
    console.log('📊 Detalhes da conexão:');
    console.log('   Provider : PostgreSQL (Neon)');
    console.log('   Host     : ep-wispy-mountain-acurilh9-pooler.sa-east-1.aws.neon.tech');
    console.log('   Database : neondb');
    console.log('   Status   : Conectado com sucesso! 🎉');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('❌ Falha na conexão com o banco!');
    console.error('Erro:', error.message);
    console.error('');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
