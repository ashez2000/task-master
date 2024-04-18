import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import db from '../utils/prisma.js'
import { loginSchema, registerSchema } from '../schemas/user.js'
import { AppError } from '../utils/error.js'

/**
 * Register new user
 * @route POST /api/auth/register
 */
export const register = async (req, res) => {
  const { name, email, password } = registerSchema.parse(req.body)
  const hash = bcrypt.hashSync(password)

  // Check if email alreadt exist
  const found = await db.user.findUnique({
    where: { email },
  })

  if (found) {
    throw new AppError('Email already exist', 400)
  }

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hash,
    },
  })

  const token = signJwtToken(user.id)

  res.cookie('token', token, {
    httpOnly: true,
  })

  res.status(201).json({ token })
}

/**
 * Login user
 * @route POST /api/auth/login
 */
export const login = async (req, res) => {
  const { email, password } = loginSchema.parse(req.body)

  const user = await db.user.findUnique({
    where: { email },
  })

  if (!user) {
    throw new AppError('Invalid credentials', 401)
  }

  // Verify password
  const isMatch = bcrypt.compareSync(password, user.password)
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401)
  }

  const token = signJwtToken(user.id)

  res.cookie('token', token, {
    httpOnly: true,
  })

  res.status(200).json({ token })
}

const signJwtToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'secret'

  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: '7d',
  })

  return token
}
