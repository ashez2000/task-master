import { Router } from 'express'
import * as project from '../controllers/project.js'

const router = Router()

router.post('/', project.create)
router.get('/:id', project.findById)

export default router
