import { AppError } from '../utils/error.js'

export const errorHandler = (err, req, res, next) => {
  console.error(err)

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message })
  }

  res.status(500).json({ message: 'Internal Server Error' })
}
