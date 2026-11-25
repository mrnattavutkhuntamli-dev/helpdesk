import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db.js';
import { env } from '../config/env.js';

const SALT_ROUNDS = 12;
// hash หลอกสำหรับเทียบเวลา (cost ต้องเท่ากับ SALT_ROUNDS)
const DUMMY_HASH = bcrypt.hashSync('dummy-password', SALT_ROUNDS);

function httpError(status, code, message) {
    const err = new Error(message);
    err.status = status;
    err.code = code;
    return err;
}

const publicUserSelect = {
    id: true,
    name: true,
    email: true,
    role: true,
    createdAt: true,
    updatedAt: true,
};

export async function registerUser({ name, email, password }) {
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    try {
        return await prisma.user.create({
            data: { name, email, passwordHash, role: 'USER' },
            select: publicUserSelect,
        });
    } catch (error) {
        if (error.code === 'P2002') {
            throw httpError(409, 'EMAIL_ALREADY_EXISTS', 'Email already exists');
        }
        throw error;
    }
}
export async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: { id },
        select: publicUserSelect,
    });

    if (!user) {
        throw httpError(404, 'USER_NOT_FOUND', 'User not found');
    }
    return user;
}
export async function login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });

    // เทียบรหัสผ่านเสมอ แม้ไม่พบผู้ใช้ เพื่อให้เวลาตอบใกล้เคียงกัน
    const isMatch = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);

    if (!user || !isMatch || !user.isActive || user.deletedAt) {
        throw httpError(401, 'INVALID_CREDENTIALS', 'Invalid credentials');
    }

    const token = jwt.sign(
        { id: user.id, role: user.role },
        env.jwtSecret,
        { expiresIn: env.jwtExpiresIn, algorithm: 'HS256' }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
}