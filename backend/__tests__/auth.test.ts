import request from 'supertest'
import app from '../src/server'
import prisma from '../src/config/database'

describe('Auth routes', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should register a new user and return token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'test@example.com', password: 'password123' })
      .expect(201)

    expect(res.body).toHaveProperty('token')
    expect(res.body.user).toHaveProperty('email', 'test@example.com')
  })

  it('should not register duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test2', email: 'test@example.com', password: 'password123' })
      .expect(400)
  })

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' })
      .expect(200)

    expect(res.body).toHaveProperty('token')
    expect(res.body.user).toHaveProperty('email', 'test@example.com')
  })

  it('should not login with wrong password', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrong' })
      .expect(401)
  })
})