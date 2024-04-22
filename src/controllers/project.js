import db from '../utils/prisma.js'
import { AppError } from '../utils/error.js'

/**
 * Create new project
 * @route POST /api/projects
 */
export const create = async (req, res) => {
  const userId = req.user.id
  // TODO: Data validation
  const { name, description } = req.body

  // TODO: Handle duplicate data
  const project = await db.project.create({
    data: {
      name,
      description,
      userId,
    },
  })

  res.status(201).json(project)
}

/**
 * Find project by id
 * @route POST /api/projects/:id
 */
export const findById = async (req, res) => {
  const id = req.params.id

  const project = await db.project.findUnique({
    where: { id },
  })

  if (!project) {
    throw new AppError('Project not found!', 404)
  }

  res.status(200).json(project)
}
