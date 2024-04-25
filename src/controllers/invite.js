import { AppError } from '../utils/error.js'
import db from '../utils/prisma.js'

/**
 * Accept project invite for a user
 * @route POST /api/invites/:id/accept
 */
// TODO: deal with multiple invites and accept cases
export const accept = async (req, res) => {
  const inviteId = req.params.id
  const curUserId = req.user.id

  const invite = await db.projectInvite.findUnique({
    where: { id: inviteId },
  })

  if (!invite) {
    throw new AppError('Invite not found', 404)
  }

  // If invite is not associated with current user
  // bad request
  if (invite.userId !== curUserId) {
    throw new AppError('Invalid invite', 400)
  }

  await db.projectMember.create({
    data: {
      projectId: invite.projectId,
      userId: invite.userId,
    },
  })

  // TODO: deal with multiple requests
  await db.projectInvite.delete({
    where: { id: invite.id },
  })

  res.status(200).json({
    message: 'OK',
  })
}
