import { Request, Response, NextFunction } from 'express'

interface ApiError extends Error {
  status?: number
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack)
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Internal Server Error' })
}
