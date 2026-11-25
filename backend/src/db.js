import 'dotenv/config';
// 1. เติม .js ต่อท้ายให้ครบ
import { PrismaClient } from './generated/prisma/client.ts'; 
import { PrismaNeon } from '@prisma/adapter-neon';

// 2. สร้าง Adapter
const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

// 3. ส่ง adapter เข้า constructor โดยตรง (ไม่ต้องใช้ datasources)
export const prisma = new PrismaClient({ adapter });