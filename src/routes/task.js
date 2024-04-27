import { Router } from 'express'
import * as task from '../controllers/task.js'

const router = Router()

router.put('/:id', task.update)
router.delete('/:id', task.remove)

export default router
