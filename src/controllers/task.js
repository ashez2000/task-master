import db from '../utils/prisma.js'

/**
 * Update task
 * @route PUT /api/tasks/:id
 */
export const update = async (req, res) => {
  const taskId = req.params.id
  const { title, description } = req.body

  // TODO: user ownership

  const task = await db.task.update({
    where: { id: taskId },
    data: { title, description },
  })

  res.status(200).json(task)
}

/**
 * Remove task
 * @route DELETE /api/tasks/:id
 */
export const remove = async (req, res) => {
  const taskId = req.params.id

  // TODO: user ownership

  const task = await db.task.delete({
    where: { id: taskId },
  })

  res.status(200).json(task)
}
