import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'No token provided' } });
    }
    try{
        const decoded = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
        req.user = decoded;
        next();
    } catch (err) {
        if(err.name ==='TokenExpiredError') {
            return res.status(401).json({ error: { code: 'TOKEN_EXPIRED', message: 'Token has expired' } });
        }
        if(err.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'Invalid token' } });
        }
        return res.status(500).json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred.' } });
    } 
}

export function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: { code: 'FORBIDDEN', message: 'You do not have permission to perform this action' } });
        }
        next(); 
    }
}