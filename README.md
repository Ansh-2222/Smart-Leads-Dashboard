# Smart Leads Dashboard

A production-quality **MERN stack** Lead Management Dashboard with JWT authentication, RBAC, advanced filtering, CSV export, and dark mode.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + TypeScript + TailwindCSS v4 + Zustand |
| Backend | Node.js + Express 5 + TypeScript |
| Database | MongoDB 7 + Mongoose 9 |
| Auth | JWT (access + refresh tokens) + bcrypt |
| DevOps | Docker + Docker Compose |

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- MongoDB running on `localhost:27017`

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Server starts at **http://localhost:5000**

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

App opens at **http://localhost:5173**

---

## Docker Setup

```bash
# 1. Copy and fill in secrets
cp .env.example .env

# 2. Build and start all services (MongoDB + backend + frontend)
docker-compose up --build

# 3. Run in background
docker-compose up -d --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:5000/api/v1 |
| Health check | http://localhost:5000/health |

> MongoDB data is persisted in a named Docker volume (`mongo_data`).

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | `development` |
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection URI | `mongodb://localhost:27017/smartleads` |
| `JWT_ACCESS_SECRET` | JWT access token secret | — |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | — |
| `JWT_ACCESS_EXPIRES_IN` | Access token TTL | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token TTL | `7d` |
| `BCRYPT_ROUNDS` | bcrypt cost factor | `12` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |

---

## API Documentation

### Base URL
`http://localhost:5000/api/v1`

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Register user | Public |
| POST | `/auth/login` | Login | Public |
| POST | `/auth/refresh` | Refresh tokens | Cookie |
| POST | `/auth/logout` | Logout | Bearer |
| GET | `/auth/me` | Get current user | Bearer |

**Register Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password1",
  "role": "sales"
}
```

**Login Request Body:**
```json
{
  "email": "john@example.com",
  "password": "Password1"
}
```

### Leads

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/leads` | List leads (paginated + filtered) | Bearer |
| POST | `/leads` | Create lead | Bearer |
| GET | `/leads/:id` | Get single lead | Bearer |
| PUT | `/leads/:id` | Update lead | Bearer |
| DELETE | `/leads/:id` | Delete lead | Bearer |
| GET | `/leads/stats` | Get lead statistics | Bearer |
| GET | `/leads/export/csv` | Export leads as CSV | Bearer |

**Query Parameters for GET /leads:**

| Param | Type | Description |
|-------|------|-------------|
| `status` | `New\|Contacted\|Qualified\|Lost` | Filter by status |
| `source` | `Website\|Instagram\|Referral` | Filter by source |
| `search` | string | Search by name or email |
| `sortBy` | `createdAt\|name\|email` | Sort field |
| `sortOrder` | `asc\|desc` | Sort direction |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 10, max: 100) |

**Create/Update Lead Body:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram",
  "notes": "Met at conference"
}
```

**API Response Format:**
```json
{
  "success": true,
  "message": "Leads fetched",
  "data": {
    "data": [...],
    "pagination": {
      "total": 42,
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## Architecture

```
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/        # DB connection, env validation
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth, validation, error handler
│   │   ├── models/        # Mongoose schemas
│   │   ├── repositories/  # Data access layer
│   │   ├── routes/        # Express routers
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript interfaces & enums
│   │   └── utils/         # JWT, ApiError, ApiResponse
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios client + typed API calls
│   │   ├── components/    # Shared UI (Button, Input, Modal…) + layouts
│   │   ├── features/      # auth/ and leads/ feature modules
│   │   ├── hooks/         # useLeads, useDebounce
│   │   ├── stores/        # Zustand: auth, lead, theme
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # cn(), formatDate
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.example
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## Features

- **JWT Auth** — Access (15m) + refresh (7d) token rotation with httpOnly cookies
- **RBAC** — Admin sees all leads; Sales users see only their own
- **CRUD** — Full create/read/update/delete for leads
- **Combined Filters** — Status + Source + Search work together
- **Debounced Search** — 400ms debounce prevents excessive API calls
- **Backend Pagination** — `skip`/`limit` with full metadata
- **CSV Export** — Downloads current filter set as CSV
- **Dark Mode** — Persisted via Zustand + localStorage
- **Toast Notifications** — react-hot-toast on all actions
- **Protected Routes** — Unauthenticated users redirected to login

---

## Commit Message Convention

```
feat: add lead CSV export with active filters
fix: handle refresh token rotation on 401
refactor: extract lead repository from service layer
chore: add Docker Compose health checks
```
