import db from '../utils/prisma.js'

export const findById = async (id) => {
  return await db.project.findUnique({ where: { id } })
}

export const addMember = async (projectId, userId) => {
  return await db.projectMember.create({
    data: {
      projectId,
      userId,
    },
  })
}
