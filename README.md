# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack. Supports JWT authentication, role-based access control, advanced filtering, CSV export, and dark mode.

---

## Tech Stack

| Part | Technology |
|------|-----------|
| Frontend | React 19, TypeScript, Vite 8, TailwindCSS v4 |
| State | Zustand 5 |
| Forms | React Hook Form + Zod |
| HTTP | Axios |
| Icons | Lucide React |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB 7, Mongoose 9 |
| Auth | JWT (access + refresh tokens), bcryptjs |
| Security | Helmet, CORS, express-rate-limit |

---

## What This Project Does

- Admins can see and manage **all leads** in the system
- Sales users can only see **leads they created**
- Leads can be filtered by status, source, or searched by name/email — all filters work together
- Results are paginated (10 per page) with sorting options
- Any filtered view can be exported as a CSV file
- Dark mode is supported and remembered across sessions

---

## Pages

| Route | Description |
|-------|-------------|
| `/dashboard` | Stat cards (total, qualified, contacted, lost) + progress bar breakdown by status and source |
| `/leads` | Paginated lead table with filters, search, add/edit/delete, and CSV export |
| `/stats` | Full-width analytics view — status and source breakdown with percentages |
| `/login` | Email + password login |
| `/register` | Create account (name, email, password, role) |

---

## Project Structure

```
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/        # Environment config, DB connection
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth, validation, error handler
│   │   ├── models/        # Mongoose schemas (User, Lead)
│   │   ├── repositories/  # Database queries
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript interfaces and enums
│   │   └── utils/         # JWT helpers, ApiError, ApiResponse
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios client and API call functions
│   │   ├── components/    # Reusable UI components and layouts
│   │   ├── features/      # auth/ and leads/ feature modules
│   │   ├── hooks/         # useLeads, useDebounce
│   │   ├── stores/        # Zustand stores (auth, leads, theme)
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # cn, formatDate
│   └── vite.config.ts
│
└── README.md
```

---

## Running Locally

**Requirements:** Node.js 20+, MongoDB running on `localhost:27017`

**1. Clone the repo**
```bash
git clone https://github.com/your-username/smart-leads-dashboard.git
cd smart-leads-dashboard
```

**2. Set up the backend**
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartleads

JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

Then start:
```bash
npm run dev
```
Backend runs at `http://localhost:5000`

**3. Set up the frontend**
```bash
cd frontend
npm install
npm run dev
```
Frontend opens at `http://localhost:5173`

> The Vite dev server proxies all `/api/*` requests to `localhost:5000` — no `VITE_API_URL` needed for local development.

---

## Environment Variables

### Backend — `backend/.env`

| Variable | Default | Required |
|----------|---------|----------|
| `NODE_ENV` | `development` | No |
| `PORT` | `5000` | No |
| `MONGODB_URI` | `mongodb://localhost:27017/smartleads` | No |
| `JWT_ACCESS_SECRET` | — | **Yes** |
| `JWT_REFRESH_SECRET` | — | **Yes** |
| `JWT_ACCESS_EXPIRES_IN` | `15m` | No |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | No |
| `BCRYPT_ROUNDS` | `12` | No |

### Frontend — `frontend/.env` (optional)

```env
# Leave empty for local dev — Vite proxy handles /api/* -> localhost:5000
# Set to your deployed backend URL for production builds
VITE_API_URL=
```

---

## API Documentation

All endpoints are prefixed with `/api/v1`.

Every response follows this shape:
```json
{
  "success": true,
  "message": "Description of what happened",
  "data": { }
}
```

Errors:
```json
{
  "success": false,
  "message": "What went wrong",
  "errors": [{ "field": "email", "message": "Valid email required" }]
}
```

Rate limit: **100 requests per 15 minutes** per IP on all `/api/*` routes.

---

### Auth Endpoints

| Method | Endpoint | Auth required | Description |
|--------|----------|---------------|-------------|
| POST | `/auth/register` | No | Create a new account |
| POST | `/auth/login` | No | Log in and get tokens |
| POST | `/auth/refresh` | Cookie | Get a new access token |
| POST | `/auth/logout` | Yes | Log out and clear session |
| GET | `/auth/me` | Yes | Get current user details |

**Register**
```
POST /api/v1/auth/register
```
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "Password1",
  "role": "sales"
}
```
`role` can be `"sales"` (default) or `"admin"`.  
Password must be at least 8 characters with one uppercase letter and one number.

**Login**
```
POST /api/v1/auth/login
```
```json
{
  "email": "rahul@example.com",
  "password": "Password1"
}
```

**Successful auth response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "664f...",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "role": "sales"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiJ9..."
  }
}
```
The refresh token is set as an `httpOnly` cookie automatically.

---

### Leads Endpoints

All leads endpoints require a `Bearer` token in the `Authorization` header.

```
Authorization: Bearer <accessToken>
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leads` | Get leads list (with filters and pagination) |
| POST | `/leads` | Create a new lead |
| GET | `/leads/:id` | Get a single lead by ID |
| PUT | `/leads/:id` | Update a lead |
| DELETE | `/leads/:id` | Delete a lead |
| GET | `/leads/stats` | Get counts by status and source |
| GET | `/leads/export/csv` | Download leads as a CSV file |

---

**GET /leads — Query Parameters**

All parameters are optional and can be combined.

| Parameter | Type | Example | Description |
|-----------|------|---------|-------------|
| `status` | string | `Qualified` | Filter by lead status |
| `source` | string | `Instagram` | Filter by lead source |
| `search` | string | `rahul` | Search by name or email |
| `sortBy` | string | `createdAt` | `createdAt`, `name`, or `email` |
| `sortOrder` | string | `desc` | `asc` or `desc` |
| `page` | number | `2` | Page number (default: 1) |
| `limit` | number | `10` | Results per page (default: 10, max: 100) |

Example:
```
GET /api/v1/leads?status=Qualified&source=Instagram&sortBy=name&sortOrder=asc&page=2
```

**Paginated response:**
```json
{
  "success": true,
  "message": "Leads fetched",
  "data": {
    "data": [
      {
        "_id": "664f...",
        "name": "Rahul Sharma",
        "email": "rahul@example.com",
        "status": "Qualified",
        "source": "Instagram",
        "notes": "Met at conference",
        "createdBy": { "_id": "...", "name": "Admin", "email": "admin@example.com" },
        "createdAt": "2025-05-21T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 42,
      "page": 2,
      "limit": 10,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": true
    }
  }
}
```

---

**POST /leads — Create Lead**
```json
{
  "name": "Priya Mehta",
  "email": "priya@example.com",
  "status": "New",
  "source": "Referral",
  "notes": "Referred by Rahul"
}
```
`status` values: `New`, `Contacted`, `Qualified`, `Lost`  
`source` values: `Website`, `Instagram`, `Referral`  
`notes` is optional (max 1000 characters).

---

**GET /leads/stats**

Returns counts broken down by status and source. Admin gets counts for all leads; sales users get counts for their own leads only.

```json
{
  "success": true,
  "message": "Stats fetched",
  "data": {
    "total": 24,
    "byStatus": [
      { "_id": "New", "count": 10 },
      { "_id": "Contacted", "count": 8 },
      { "_id": "Qualified", "count": 4 },
      { "_id": "Lost", "count": 2 }
    ],
    "bySource": [
      { "_id": "Website", "count": 12 },
      { "_id": "Instagram", "count": 7 },
      { "_id": "Referral", "count": 5 }
    ]
  }
}
```

---

**GET /leads/export/csv**

Downloads a CSV of all leads matching the current filters. Accepts the same query parameters as `GET /leads` (except `page` and `limit`).

```
GET /api/v1/leads/export/csv?status=Qualified&source=Instagram
```

Response is a `text/csv` file download.

---

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request |
| 401 | Not authenticated |
| 403 | Authenticated but not allowed |
| 404 | Resource not found |
| 409 | Conflict (e.g. email already exists) |
| 422 | Validation failed |
| 500 | Server error |

---

## Role-Based Access

| Action | Admin | Sales User |
|--------|-------|------------|
| View all leads | Yes | No (own leads only) |
| View own leads | Yes | Yes |
| Create lead | Yes | Yes |
| Edit any lead | Yes | No (own only) |
| Delete any lead | Yes | No (own only) |
| View stats for all leads | Yes | No (own only) |
| Export all leads | Yes | No (own only) |

---

## Features Summary

- **JWT Authentication** — Access tokens (15 min) + refresh tokens (7 days) with rotation. Refresh token stored in an httpOnly cookie.
- **Role-Based Access Control** — Admin and Sales roles with data visibility enforced at the database query level.
- **Lead CRUD** — Create, read, update, delete leads with full validation on both frontend and backend.
- **Advanced Filtering** — Status, source, and search filters combine in a single query.
- **Debounced Search** — 400 ms debounce on the search input to avoid calling the API on every keystroke.
- **Backend Pagination** — MongoDB `skip`/`limit` with full metadata (`totalPages`, `hasNextPage`, etc.).
- **CSV Export** — Exports the current filtered view as a downloadable CSV.
- **Dark Mode** — Toggle in the sidebar, persisted in `localStorage`.
- **Reactive Stats** — Dashboard and Stats pages update automatically after creating, editing, or deleting a lead.
- **Rate Limiting** — 100 requests per 15 minutes per IP on all API routes.
- **Security Headers** — Helmet sets secure HTTP headers on every response.

---

## Local Development Tips

- Run `npm run typecheck` in the frontend folder to check TypeScript without building.
- Run `npm run build` in the backend to compile TypeScript to `dist/`.
- The backend `/health` endpoint returns `{ "status": "ok" }` — useful for verifying the server is up.
- The Vite dev server proxies `/api/*` to `localhost:5000` — set `VITE_API_URL` only for production builds.
