# SaaS Cost Optimizer

A production-ready, multi-tenant SaaS web application for automated SaaS cost optimization used by IT and Finance teams in mid-to-large enterprises.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Node.js + Express (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT-based authentication
- **Charts**: Recharts
- **State Management**: Zustand + React Query

## Project Structure

```
├── backend/                  # Backend API
│   ├── prisma/
│   │   ├── schema.prisma    # Database schema
│   │   └── seed.ts          # Seed data
│   ├── src/
│   │   ├── middleware/      # Auth middleware
│   │   ├── routes/          # API routes
│   │   └── index.ts         # Express server
│   ├── package.json
│   └── tsconfig.json
├── src/                      # Frontend React app
│   ├── components/          # UI components
│   ├── pages/               # Page components
│   ├── stores/              # Zustand stores
│   ├── lib/                 # Utilities
│   └── types/               # TypeScript types
├── docker-compose.yml       # Docker orchestration
└── README.md
```

## Quick Start with Docker

The easiest way to run the full stack locally:

```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up -d

# View logs
docker-compose logs -f

# Run database migrations and seed data
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npm run db:seed

# Stop services
docker-compose down
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Health check: http://localhost:3001/api/health

## Manual Setup (Without Docker)

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb saas_optimizer

# Or via psql
psql -U postgres -c "CREATE DATABASE saas_optimizer;"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database URL
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saas_optimizer?schema=public"

# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed the database
npm run db:seed

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
# From project root
npm install
npm run dev
```

## Default Login Credentials

After seeding, use these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin (IT) | sarah.chen@acme.com | password123 |
| Finance | michael.ross@acme.com | password123 |
| App Owner | emily.johnson@acme.com | password123 |

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Users
- `GET /api/users` - List organization users
- `POST /api/users` - Create user (admin)
- `PATCH /api/users/:id` - Update user (admin)
- `DELETE /api/users/:id` - Delete user (admin)

### SaaS Applications
- `GET /api/apps` - List all apps
- `GET /api/apps/:id` - Get app details
- `POST /api/apps` - Create app (admin)
- `PATCH /api/apps/:id` - Update app
- `DELETE /api/apps/:id` - Delete app (admin)

### Licenses
- `GET /api/licenses/app/:appId` - Get licenses for app
- `GET /api/licenses/unused` - Get unused licenses
- `POST /api/licenses` - Assign license
- `DELETE /api/licenses/:id` - Revoke license

### Recommendations
- `GET /api/recommendations` - List recommendations
- `GET /api/recommendations/:id` - Get recommendation
- `POST /api/recommendations/:id/approve` - Approve
- `POST /api/recommendations/:id/reject` - Reject
- `POST /api/recommendations/:id/implement` - Implement

### Dashboard
- `GET /api/dashboard/metrics` - Dashboard metrics
- `GET /api/dashboard/spend-by-category` - Spend breakdown
- `GET /api/dashboard/spend-trend` - Monthly trends
- `GET /api/dashboard/renewals` - Upcoming renewals

### Audit Logs
- `GET /api/audit` - List audit logs (admin)
- `GET /api/audit/entity/:type/:id` - Logs for entity

## Environment Variables

### Backend (.env)
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/saas_optimizer?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:3001/api
```

## Features

- **Multi-tenant**: Organization-based data isolation
- **RBAC**: Admin, Finance, and App Owner roles
- **SaaS Inventory**: Track all SaaS applications
- **Usage Analytics**: Monitor license utilization
- **Cost Optimization**: AI-powered recommendations
- **Governance**: Approval workflows with audit trails
- **Dashboards**: Role-based analytics views

## Development

```bash
# Run backend in watch mode
cd backend && npm run dev

# Run frontend
npm run dev

# Open Prisma Studio (database GUI)
cd backend && npm run db:studio

# Format code
npm run format

# Lint
npm run lint
```

## License

MIT
