export function validate(schema) {
  return (req, res, next) => {
    try {
      req.validatedData = schema.parse(req.body)
      next()
    } catch (error) {
      if (error.errors && Array.isArray(error.errors)) {
        return res.status(400).json({ error: error.errors[0].message })
      }

      return res
        .status(500)
        .json({ error: 'Error en la validación inesperado.' })
    }
  }
}
