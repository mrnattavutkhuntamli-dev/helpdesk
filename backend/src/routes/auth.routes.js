import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import * as authController from '../controllers/auth.controller.js'
import { validate } from '../middlewares/validate.js'
import { authenticateToken } from '../middlewares/auth.js'
import { registerSchema, loginSchema } from '../validators/auth.validator.js'

const router = Router()

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/register', validate(registerSchema), authController.register)
router.post('/login', loginLimiter, validate(loginSchema), authController.login)
router.get('/me', authenticateToken, authController.me)

export default router