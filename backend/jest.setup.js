// jest.setup.js
// configure environment variables before tests run
require('dotenv').config();
process.env.NODE_ENV = 'test';

// ensure DATABASE_URL is loaded (jest doesn't automatically load .env)
if (!process.env.DATABASE_URL) {
  console.warn('WARNING: DATABASE_URL not defined in environment');
}

// apply pending migrations so tables exist in test DB (or push schema if
// migrations folder is empty)
const { execSync } = require('child_process');
try {
  // try deploy first; if there are no migrations this will just report none
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
} catch (e) {
  // if migrate deploy fails (e.g. because there are no migrations at all),
  // fall back to db push which will create tables directly from schema
  try {
    execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
  } catch (pushErr) {
    console.warn('prisma db push failed:', pushErr.message);
  }
}
