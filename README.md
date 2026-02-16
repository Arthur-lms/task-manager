# Task Manager

A full-stack task management application with a Node/Express + Prisma backend and a React + Vite frontend.

## Features

- User registration and JWT authentication
- CRUD operations on tasks with filtering, pagination, sorting & statistics
- Swagger/OpenAPI documentation (available at `/api-docs`)
- Input validation using Zod
- Centralized error handling
- Basic security with Helmet, CORS, and rate limiting
- Backend and frontend linting, formatting, and testing setups
- Real-time toast notifications and improved UX
- Docker Compose ready for local development

## Getting Started

### Backend

1. Copy `backend/.env.example` to `backend/.env` and fill in your database credentials and JWT secret.
2. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Generate Prisma client and run migrations:
   ```bash
   npm run prisma:format
   npm run db:generate
   npm run db:migrate
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Run tests:
   ```bash
   npm run test
   ```

### Frontend

1. Copy `frontend/.env.example` to `frontend/.env.local`.
2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
3. Start development server:
   ```bash
   npm run dev
   ```
4. Run lint/format
   ```bash
   npm run lint
   npm run format
   ```
5. Run frontend tests:
   ```bash
   npm run test
   ```

## Docker

A `docker-compose.yml` is included to run both services together with PostgreSQL. Make sure you populate `backend/.env` with `DATABASE_URL` pointing to the containerized database (see docker-compose labels).

## API Documentation

Once the backend is running, visit `http://localhost:5000/api-docs` to view interactive Swagger UI.

## Future Improvements

- Add refresh tokens
- Better error tracking (Sentry/etc.)
- End-to-end tests with Playwright/Cypress
- Deploy to production (Heroku/DigitalOcean/Vercel)
- CI pipelines (GitHub Actions already included)

---

This project has been upgraded with improved validation, pagination, documentation, and a testing setup. Feel free to extend it further!  
