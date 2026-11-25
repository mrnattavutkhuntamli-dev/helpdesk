export const validate =
  (schema, source = 'body') =>
  (req, res, next) => {
    const result = schema.safeParse(req[source])

    if (!result.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input',
          details: result.error.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
        },
      })
    }

    // เก็บค่าที่ผ่านการแปลงแล้วไว้ที่ req.valid (ใช้ได้ทั้ง Express 4 และ 5)
    req.valid = { ...req.valid, [source]: result.data }
    if (source === 'body') req.body = result.data

    next()
  }