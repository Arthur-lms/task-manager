// jest.setup.js
// configure environment variables before tests run
require('dotenv').config();
process.env.NODE_ENV = 'test';
// ensure DATABASE_URL is loaded (jest doesn't automatically load .env)
if (!process.env.DATABASE_URL) {
  console.warn('WARNING: DATABASE_URL not defined in environment');
}
