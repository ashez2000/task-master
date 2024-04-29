import db from '../utils/prisma.js'

export const findById = async (id) => {
  return await db.projectInvite.findUnique({ where: { id } })
}
