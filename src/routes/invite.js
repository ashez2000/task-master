import { Router } from 'express'
import { protect } from '../middlewares/auth.js'
import * as invite from '../controllers/invite.js'

const router = Router()

router.post('/:id/accept', protect, invite.accept)

export default router
