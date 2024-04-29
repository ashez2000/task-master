import * as repo from '../repository/mod.js'
import { AppError } from '../utils/error.js'
import db from '../utils/prisma.js'

/**
 * Accept project invite for a user
 * @route PUT /api/invites/:id/accept
 */
// TODO: deal with multiple invites and accept cases
export const accept = async (req, res) => {
  const inviteId = req.params.id
  const curUserId = req.user.id

  const invite = await repo.invite.findById(inviteId)
  if (!invite) {
    throw new AppError(`Invite(${id}): Not found`, 404)
  }

  // If invite is not associated with current user
  // bad request
  if (invite.userId !== curUserId) {
    throw new AppError('Invalid invite', 400)
  }

  const member = await repo.member.create(invite.projectId, invite.userId)

  res.status(200).json(member)
}

/**
 * Create an invite for a user to a project
 * @route POST /api/projects/:id/invite
 */
export const create = async (req, res) => {
  const curUserId = req.user.id
  const projectId = req.params.id
  const inviteUserId = req.body.inviteUserId

  const project = await repo.project.findById(projectId)
  if (!project) {
    throw new AppError(`Project(${projectId}): Not found`, 404)
  }

  const user = await repo.user.findById(inviteUserId)
  if (!user) {
    throw new AppError(`User(${inviteUserId}): Not found`, 404)
  }

  if (project.userId !== curUserId) {
    throw new AppError(`Forbidden: Only project owner can send invites`)
  }

  const isMember = await repo.member.isMember(projectId, inviteUserId)
  if (isMember) {
    throw new AppError(`User(${inviteUserId}): Already a member of project`)
  }

  const invite = await db.projectInvite.create({
    data: {
      projectId,
      userId: inviteUserId,
    },
  })

  res.status(201).json(invite)
}
