import 'dotenv/config';

const required = ['DATABASE_URL', 'PORT', 'JWT_SECRET'];

for (const key of required) { 
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

export const env = {
    port: parseInt(process.env.PORT, 10),
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
}