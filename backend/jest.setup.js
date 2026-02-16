// jest.setup.js
// configure environment variables before tests run
process.env.NODE_ENV = 'test'
// use in-memory SQLite database for tests
process.env.TEST_DATABASE_URL = 'file:./test.db?mode=memory&cache=shared'
