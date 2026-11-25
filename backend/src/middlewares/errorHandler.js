import { env } from '../config/env.js'

export function notFound(req, res) {
  res.status(404).json({
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  })
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err)

  let status = err.status || 500
  let code = err.code
  let message = err.message

  // JSON body พัง
  if (err.type === 'entity.parse.failed') {
    status = 400
    code = 'INVALID_JSON'
    message = 'Malformed JSON body'
  }
  // Prisma: unique ซ้ำ / ไม่พบข้อมูล
  else if (err.code === 'P2002') {
    status = 409
    code = 'CONFLICT'
    message = 'Duplicate value'
  } else if (err.code === 'P2025') {
    status = 404
    code = 'NOT_FOUND'
    message = 'Record not found'
  }
  // Prisma: foreign key ไม่ถูกต้อง
  else if (err.code === 'P2003') {
    status = 400
    code = 'INVALID_REFERENCE'
    message = 'Referenced record does not exist'
  }

  if (status >= 500) {
    console.error(err)
    code = 'INTERNAL_SERVER_ERROR'
    message = 'An unexpected error occurred.'
  }

  res.status(status).json({
    error: {
      code: code || 'ERROR',
      message,
      ...(err.details && { details: err.details }),
      ...(!env.isProd && status >= 500 && { stack: err.stack }),
    },
  })
}