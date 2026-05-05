import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const raw = process.env.DATABASE_URL;
console.log('DATABASE_URL:', raw);

// Test 1: Raw connection string directly
console.log('\n--- Test 1: Raw connection string ---');
try {
  const pool1 = new Pool({ connectionString: raw });
  const res1 = await pool1.query('SELECT 1 as test');
  console.log('Pool direct query SUCCESS:', res1.rows);
  await pool1.end();
} catch (e) {
  console.error('Pool direct query FAILED:', e.message);
}

// Test 2: Pool with explicit host params
console.log('\n--- Test 2: Explicit params ---');
try {
  const url = new URL(raw);
  const pool2 = new Pool({
    host: url.hostname,
    port: 5432,
    database: url.pathname.slice(1),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    ssl: true,
  });
  const res2 = await pool2.query('SELECT 1 as test');
  console.log('Explicit params query SUCCESS:', res2.rows);
  await pool2.end();
} catch (e) {
  console.error('Explicit params query FAILED:', e.message);
}

// Test 3: Prisma with adapter using explicit params
console.log('\n--- Test 3: Prisma with explicit params ---');
try {
  const url = new URL(raw);
  const pool3 = new Pool({
    host: url.hostname,
    port: 5432,
    database: url.pathname.slice(1),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    ssl: true,
  });
  const adapter = new PrismaNeon(pool3);
  const prisma = new PrismaClient({ adapter });
  const count = await prisma.user.count();
  console.log('Prisma query SUCCESS! User count:', count);
  await prisma.$disconnect();
} catch (e) {
  console.error('Prisma query FAILED:', e.message);
}

process.exit(0);
