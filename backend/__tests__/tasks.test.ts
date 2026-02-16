import request from 'supertest'
import app from '../src/server'
import prisma from '../src/config/database'

let token: string

beforeAll(async () => {
  // make sure a user exists and get token
  await prisma.task.deleteMany()
  await prisma.user.deleteMany()

  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Tester', email: 'tasks@test.com', password: 'secret' })
  token = res.body.token
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('Task routes', () => {
  it('should create a task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'First task' })
      .expect(201)

    expect(res.body).toHaveProperty('id')
    expect(res.body).toHaveProperty('title', 'First task')
  })

  it('should list tasks with pagination metadata', async () => {
    const res = await request(app)
      .get('/api/tasks?page=1&limit=10')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.body).toHaveProperty('data')
    expect(Array.isArray(res.body.data)).toBe(true)
    expect(res.body).toHaveProperty('meta')
    expect(res.body.meta).toHaveProperty('total')
  })

  it('should update a task', async () => {
    const list = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`)

    const taskId = list.body.data[0].id
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'DONE' })
      .expect(200)

    expect(res.body).toHaveProperty('status', 'DONE')
  })

  it('should delete a task', async () => {
    const list = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`)

    const taskId = list.body.data[0].id
    await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)
  })

  it('should return stats', async () => {
    // create two tasks
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task 1', status: 'TODO' })
    await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task 2', status: 'DONE' })

    const res = await request(app)
      .get('/api/tasks/stats')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.body.stats).toHaveProperty('TODO')
    expect(res.body.stats).toHaveProperty('DONE')
  })
})