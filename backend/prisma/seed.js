import bcrypt from 'bcryptjs'
import { prisma } from '../src/db.js'

const SALT_ROUNDS = 12

const departments = [
  'ฝ่ายบริหาร',
  'ฝ่ายบัญชีและการเงิน',
  'ฝ่ายบุคคล',
  'ฝ่ายขาย/การตลาด',
  'ฝ่ายผลิต',
  'ฝ่ายเทคโนโลยีสารสนเทศ',
]

const categories = [
  'คอมพิวเตอร์/ฮาร์ดแวร์',
  'เครือข่าย/อินเทอร์เน็ต',
  'ซอฟต์แวร์/โปรแกรม',
  'เครื่องพิมพ์/สแกนเนอร์',
  'ระบบไฟฟ้า',
  'ระบบน้ำ/ประปา',
  'เครื่องปรับอากาศ',
  'เฟอร์นิเจอร์/อาคารสถานที่',
  'อื่นๆ',
]

async function main() {
  if (process.env.NODE_ENV === 'production' && !process.env.SEED_ADMIN_PASSWORD) {
    throw new Error('ตั้ง SEED_ADMIN_PASSWORD ก่อน seed บน production')
  }

  for (const name of departments) {
    await prisma.department.upsert({ where: { name }, update: {}, create: { name } })
  }
  for (const name of categories) {
    await prisma.category.upsert({ where: { name }, update: {}, create: { name } })
  }

  const users = [
    { name: 'Admin', email: 'admin@example.com', role: 'ADMIN', password: process.env.SEED_ADMIN_PASSWORD || 'Admin#12345' },
  ]

  // ผู้ใช้ตัวอย่างสำหรับทดสอบ สร้างเฉพาะตอน dev
  if (process.env.NODE_ENV !== 'production') {
    users.push(
      { name: 'Agent Demo', email: 'agent@example.com', role: 'AGENT', password: 'Agent#12345' },
      { name: 'User Demo', email: 'user@example.com', role: 'USER', password: 'User#12345' },
    )
  }

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, SALT_ROUNDS)
    await prisma.user.upsert({
      where: { email: u.email },
      update: {}, // ไม่ทับข้อมูลเดิมถ้ามีอยู่แล้ว
      create: { name: u.name, email: u.email, role: u.role, passwordHash },
    })
  }

  console.log('✅ Seed completed')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())