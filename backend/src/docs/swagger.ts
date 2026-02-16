// using any type here to avoid missing type dependency issues
const swaggerSpec: any = {
  openapi: '3.0.1',
  info: {
    title: 'Task Manager API',
    version: '1.0.0',
    description: 'API documentation for the Task Manager backend'
  },
  servers: [
    {
      url: process.env.API_URL || 'http://localhost:5000/api',
      description: 'Local server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          status: { type: 'string', enum: ['TODO', 'IN_PROGRESS', 'DONE'] },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
          dueDate: { type: 'string', format: 'date-time' },
          userId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Create a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['name', 'email', 'password']
              }
            }
          }
        },
        responses: {
          '201': { description: 'User created' },
          '400': { description: 'Invalid data or email already in use' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login and receive a JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          '200': { description: 'Authenticated' },
          '401': { description: 'Invalid credentials' }
        }
      }
    },
    '/auth/profile': {
      get: {
        tags: ['Auth'],
        security: [{ bearerAuth: [] }],
        responses: {
          '200': { description: 'User profile' },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/tasks': {
      get: {
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'priority', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 100 } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['createdAt_desc','createdAt_asc','dueDate_desc','dueDate_asc'] } }
        ],
        responses: {
          '200': { description: 'List of tasks' }
        }
      },
      post: {
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Task' }
            }
          }
        },
        responses: {
          '201': { description: 'Task created' }
        }
      }
    },
    '/tasks/{id}': {
      put: {
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Task' }
            }
          }
        },
        responses: {
          '200': { description: 'Task updated' },
          '404': { description: 'Not found' }
        }
      },
      delete: {
        tags: ['Tasks'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          '204': { description: 'Deleted' },
          '404': { description: 'Not found' }
        }
      }
    }
  }
}

export default swaggerSpec
