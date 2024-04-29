import db from '../utils/prisma.js'
import * as projectRepo from '../repository/project.js'
import { newProjectSchema } from '../schemas/project.js'
import { AppError } from '../utils/error.js'

/**
 * Create new project
 * @route POST /api/projects
 */
export const create = async (req, res) => {
  const userId = req.user.id
  const { name, description } = newProjectSchema.parse(req.body)

  const project = await db.project.findUnique({ where: { name } })
  if (project) {
    throw new AppError('Project name taken', 400)
  }

  const newProject = await db.project.create({
    data: {
      name,
      description,
      userId,
    },
  })

  // Add owner as a project member
  await projectRepo.addMember(newProject.id, userId)

  res.status(201).json(newProject)
}

/**
 * Find project by id
 * @route POST /api/projects/:id
 */
export const findById = async (req, res) => {
  const id = req.params.id
  const project = await findProjectById(id)
  res.status(200).json(project)
}

/**
 * Update project
 * @route PUT /api/project/:id
 */
export const update = async (req, res) => {
  const id = req.params.id
  const curUserId = req.user.id
  const project = await findProjectById(id)
  isOwner(project, curUserId)

  const body = newProjectSchema.partial().parse(req.body)
  const updatedProject = await db.project.update({
    where: { id },
    data: body,
  })

  res.status(200).json(updatedProject)
}

/**
 * Remove project
 * @route DELETE /api/project/:id
 */
export const remove = async (req, res) => {
  const id = req.params.id
  const curUserId = req.user.id
  const project = await findProjectById(id)
  isOwner(project, curUserId)

  // TODO: cascaed delete
  await db.project.delete({ where: { id } })

  res.status(200).json(project)
}

/**
 * Invite user to project. Only project owner can invite users
 * @route POST /api/projects/:id/invite
 */
export const invite = async (req, res) => {
  const curUserId = req.user.id
  const projectId = req.params.id
  const { userId: inviteId } = req.body

  const project = await findProjectById(projectId)
  // Check ownership
  isOwner(project, curUserId)

  const invite = await db.projectInvite.create({
    data: {
      projectId,
      userId: inviteId,
    },
  })

  res.status(201).json(invite)
}

// #### Helpers ####

/** Finds project by id, throws Not Found on null*/
const findProjectById = async (id) => {
  const project = await projectRepo.findById(id)
  if (!project) {
    throw new AppError('Project not found!', 404)
  }
  return project
}

/** Checks for project ownership, else throws Forbidden error */
const isOwner = (project, curUserId) => {
  if (project.userId !== curUserId) {
    console.debug('curUser is not owner of project')
    throw new AppError('Forbidden', 403)
  }
}
