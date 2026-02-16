import { Router, Request, Response, NextFunction } from 'express'
import { 
  getTasks, 
  getTaskStats,
  createTask, 
  updateTask, 
  deleteTask 
} from '../controllers/taskController'
import { authenticate } from '../middleware/auth'

const router = Router()

router.use(authenticate)

router.get('/', getTasks)
// endpoint that returns just the counts per status
router.get('/stats', getTaskStats)
router.post('/', createTask)

// validate id parameter for updates/deletes
const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  if (!id || typeof id !== 'string' || id.length === 0) {
    return res.status(400).json({ error: 'ID inválido' })
  }
  next()
}

router.put('/:id', validateId, updateTask)
router.delete('/:id', validateId, deleteTask)

export default router