import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().trim().min(1, { message: 'Name is required' }).max(100, { message: 'Name must be less than 100 characters' }),
    email:z.string().trim().toLowerCase().email({ message: 'Invalid email address' }).max(100, { message: 'Email must be less than 100 characters' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }).max(100, { message: 'Password must be less than 100 characters' }),
});


export const loginSchema = z.object({
    email: z.string().trim().toLowerCase().email({ message: 'Invalid email address' }).max(100, { message: 'Email must be less than 100 characters' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters long' }).max(100, { message: 'Password must be less than 100 characters' }),
});

