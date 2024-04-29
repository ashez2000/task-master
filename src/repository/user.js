import db from '../utils/prisma.js'

export const findById = async (id) => {
  return await db.user.findUnique({ where: { id } })
}
