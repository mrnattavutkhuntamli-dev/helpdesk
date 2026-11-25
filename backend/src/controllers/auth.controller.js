import * as authService from '../services/auth.service.js'

export async function register(req, res, next) {
  try {
    const user = await authService.registerUser(req.body)
    res.status(201).json({ data: user })
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body)
    res.json({ data: result })
  } catch (err) {
    next(err)
  }
}

export async function me(req, res, next) {
  try {
    const user = await authService.getUserById(req.user.id)
    res.json({ data: user })
  } catch (err) {
    next(err)
  }
}