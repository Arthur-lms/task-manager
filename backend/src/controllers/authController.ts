import { Request, Response } from 'express'
import { z } from 'zod'
import prisma from '../config/database'
import { hashPassword, comparePassword } from '../utils/bcrypt'
import { generateToken } from '../utils/jwt'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = registerSchema.parse(req.body)

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'Email já cadastrado' })
    }

    const hashedPassword = await hashPassword(password)
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true, createdAt: true }
    })

    const token = generateToken(user.id)
    res.status(201).json({ user, token })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors })
    }
    res.status(500).json({ error: 'Erro ao criar usuário' })
  }
}
// allow users to update name/password
const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  password: z.string().min(6).optional()
})

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const data = updateProfileSchema.parse(req.body)

    if (data.password) {
      data.password = await hashPassword(data.password)
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data
      },
      select: { id: true, name: true, email: true, createdAt: true }
    })

    res.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors })
    }
    res.status(500).json({ error: 'Erro ao atualizar perfil' })
  }
}
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const isValidPassword = await comparePassword(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const token = generateToken(user.id)
    res.json({
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
      token
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos' })
    }
    res.status(500).json({ error: 'Erro ao fazer login' })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, createdAt: true }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar perfil' })
  }
}