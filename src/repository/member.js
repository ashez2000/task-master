import db from '../utils/prisma.js'

export const findById = async (id) => {
  return await db.projectInvite.findUnique({ where: { id } })
}

export const create = async (projectId, userId) => {
  return await db.projectMember.create({
    data: {
      projectId,
      userId,
    },
  })
}

export const isMember = async (projectId, userId) => {
  return await db.projectMember.findUnique({
    where: {
      projectId,
      userId,
    },
  })
}
