import { Router } from 'express'
import { protect } from '../middlewares/auth.js'
import * as project from '../controllers/project.js'
import * as invite from '../controllers/invite.js'

const router = Router()

router.post('/', protect, project.create)
router.get('/:id', project.findById)
router.post('/:id/invite', protect, invite.create)

export default router
