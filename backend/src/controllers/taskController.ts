import { Request, Response } from 'express'
import { z } from 'zod'
import prisma from '../config/database'

const createTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().datetime().optional()
})

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  dueDate: z.string().datetime().optional()
})

// query params for list/pagination
const getTasksQuerySchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  search: z.string().optional(),
  page: z.preprocess((v) => parseInt(z.string().parse(v ?? '1')), z.number().min(1)).optional(),
  limit: z.preprocess((v) => parseInt(z.string().parse(v ?? '20')), z.number().min(1).max(100)).optional(),
  sort: z.enum([
    'createdAt_desc',
    'createdAt_asc',
    'dueDate_desc',
    'dueDate_asc'
  ]).optional()
})

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const query = getTasksQuerySchema.parse(req.query)

    const { status, priority, search, page = 1, limit = 20 } = query

    const where: any = { userId }
    if (status) where.status = status
    if (priority) where.priority = priority
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    let orderBy: any = { createdAt: 'desc' }
    if (query.sort) {
      const [field, dir] = query.sort.split('_')
      orderBy = { [field]: dir }
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.task.count({ where })
    ])

    res.json({ data: tasks, meta: { total, page, limit, pages: Math.ceil(total / limit) } })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Query inválida', details: error.errors })
    }
    res.status(500).json({ error: 'Erro ao buscar tarefas' })
  }
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const data = createTaskSchema.parse(req.body)

    const task = await prisma.task.create({
      data: {
        ...data,
        userId,
        dueDate: data.dueDate ? new Date(data.dueDate) : null
      }
    })

    res.status(201).json(task)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors })
    }
    res.status(500).json({ error: 'Erro ao criar tarefa' })
  }
}

export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { id } = req.params
    const data = updateTaskSchema.parse(req.body)

    const existingTask = await prisma.task.findFirst({
      where: { id, userId }
    })

    if (!existingTask) {
      return res.status(404).json({ error: 'Tarefa não encontrada' })
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined
      }
    })

    res.json(task)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors })
    }
    res.status(500).json({ error: 'Erro ao atualizar tarefa' })
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const { id } = req.params

    const existingTask = await prisma.task.findFirst({
      where: { id, userId }
    })

    if (!existingTask) {
      return res.status(404).json({ error: 'Tarefa não encontrada' })
    }

    await prisma.task.delete({ where: { id } })
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar tarefa' })
  }
}

// new stats endpoint
export const getTaskStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const counts = await prisma.task.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true }
    })
    const result: Record<string, number> = {}
    counts.forEach(c => {
      result[c.status] = c._count.status
    })
    res.json({ stats: result })
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estatísticas' })
  }
}
