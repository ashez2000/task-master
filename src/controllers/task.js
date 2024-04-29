import db from '../utils/prisma.js'
import { AppError } from '../utils/error.js'
import * as repo from '../repository/mod.js'

/**
 * Create new task for project
 * @route POST /api/projects/:id/task
 */
export const create = async (req, res) => {
  const curUserId = req.user.id
  const projectId = req.params.id

  // TODO: data validatation
  const { title, description } = req.body

  const project = await repo.project.findById(projectId)
  if (!project) {
    throw new AppError(`Project(${projectId}): Not found`)
  }

  const isMember = await repo.member.isMember(projectId, curUserId)
  if (!isMember) {
    throw new AppError(`Not project member`)
  }

  const task = await db.task.create({
    data: {
      title,
      description,
      projectId,
      userId: curUserId,
    },
  })

  res.status(201).json(task)
}

/**
 * Get tasks for project
 * @route GET /api/projects/:id/task
 */
export const find = async (req, res) => {
  const curUserId = req.user.id
  const projectId = req.params.id

  const isMember = await repo.member.isMember(projectId, curUserId)
  if (!isMember) {
    throw new AppError(`Not project member`)
  }

  const tasks = await db.task.findMany({
    where: {
      projectId,
    },
  })

  res.status(200).json(tasks)
}

/**
 * Update task
 * @route PUT /api/tasks/:id
 */
export const update = async (req, res) => {
  const taskId = req.params.id
  const { title, description } = req.body

  const task = await repo.task.findById(taskId)
  if (!task) {
    throw new AppError('Task not found')
  }

  const isMember = await repo.member.isMember(task.projectId, curUserId)
  if (!isMember) {
    throw new AppError(`Not project member`)
  }

  const uTask = await db.task.update({
    where: { id: taskId },
    data: { title, description },
  })

  res.status(200).json(uTask)
}

/**
 * Remove task
 * @route DELETE /api/tasks/:id
 */
export const remove = async (req, res) => {
  const taskId = req.params.id

  const task = await repo.task.findById(taskId)
  if (!task) {
    throw new AppError('Task not found')
  }

  const isMember = await repo.member.isMember(task.projectId, curUserId)
  if (!isMember) {
    throw new AppError(`Not project member`)
  }

  const dTask = await db.task.delete({
    where: { id: taskId },
  })

  res.status(200).json(dTask)
}
