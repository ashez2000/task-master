import { Router } from 'express'
import { protect } from '../middlewares/auth.js'
import * as project from '../controllers/project.js'
import * as invite from '../controllers/invite.js'
import * as task from '../controllers/task.js'

const router = Router()

router.post('/', protect, project.create)
router.get('/:id', project.findById)
router.post('/:id/invites', protect, invite.create)
router.get('/:id/tasks', protect, task.find)
router.post('/:id/tasks', protect, task.create)

export default router
