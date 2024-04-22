import jwt from 'jsonwebtoken'
import { AppError } from '../utils/error.js'

/**
 * Authentication middleware:
 * Verifies JWT token and assigns payload to request
 */
export const protect = (req, res, next) => {
  // Extract token from cookie
  const token = req.cookies.token
  if (!token) {
    console.debug('protect: Token undefined')
    throw new AppError('Forbidden', 403)
  }

  // Verifty token
  try {
    const secret = process.env.JWT_SECRET || 'secert'
    const payload = jwt.verify(token, secret)

    req.user = payload
    next()
  } catch (err) {
    console.debug('protect:', err.message)
    throw new AppError('Forbidden', 403)
  }
}
