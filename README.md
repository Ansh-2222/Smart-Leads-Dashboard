# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack. Supports JWT authentication, role-based access control, advanced filtering, CSV export, and dark mode.

**Live Demo:** [https://smart-leads-dashboard.vercel.app](https://smart-leads-dashboard.vercel.app)  
**Backend API:** [https://smart-leads-dashboard-2z9r.onrender.com/api/v1](https://smart-leads-dashboard-2z9r.onrender.com/api/v1)  
**GitHub:** [https://github.com/your-username/smart-leads-dashboard](https://github.com/your-username/smart-leads-dashboard)

> **Test Accounts**
> | Role | Email | Password |
> |------|-------|----------|
> | Admin | admin@demo.com | Admin@123 |
> | Sales | sales@demo.com | Sales@123 |

---

## What This Project Does

- Admins can see and manage **all leads** in the system
- Sales users can only see **leads they created**
- Leads can be filtered by status, source, or searched by name/email — all filters work together
- Results are paginated (10 per page) with sorting options
- Any filtered view can be exported as a CSV file
- Dark mode is supported and remembered across sessions

---

## Tech Stack

| Part | Technology |
|------|-----------|
| Frontend | React 19, TypeScript, TailwindCSS v4, Zustand |
| Backend | Node.js, Express 5, TypeScript |
| Database | MongoDB 7, Mongoose 9 |
| Auth | JWT (access + refresh tokens), bcrypt |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas |
| DevOps | Docker, Docker Compose |

---

## Project Structure

```
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/        # Environment config, DB connection
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Auth check, validation, error handler
│   │   ├── models/        # Mongoose schemas (User, Lead)
│   │   ├── repositories/  # Database queries
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript interfaces and enums
│   │   └── utils/         # JWT helpers, error/response classes
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/           # Axios client and API call functions
│   │   ├── components/    # Reusable UI components and page layouts
│   │   ├── features/      # Auth pages and Leads pages
│   │   ├── hooks/         # useLeads, useDebounce
│   │   ├── stores/        # Zustand state (auth, leads, theme)
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions (cn, formatDate)
│   ├── Dockerfile
│   ├── nginx.conf
│   └── .env.example
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Running Locally

### Option 1 — Without Docker

**Requirements:** Node.js 20+, MongoDB running on localhost

**1. Clone the repo**
```bash
git clone https://github.com/your-username/smart-leads-dashboard.git
cd smart-leads-dashboard
```

**2. Set up the backend**
```bash
cd backend
cp .env.example .env
# Open .env and fill in JWT_ACCESS_SECRET and JWT_REFRESH_SECRET
npm install
npm run dev
```
Backend runs at `http://localhost:5000`

**3. Set up the frontend**
```bash
cd frontend
cp .env.example .env
# VITE_API_URL can stay empty for local dev (proxy handles it)
npm install
npm run dev
```
Frontend opens at `http://localhost:5173`

---

### Option 2 — With Docker (Recommended)

**Requirements:** Docker and Docker Compose installed

```bash
# 1. Clone and enter the project
git clone https://github.com/your-username/smart-leads-dashboard.git
cd smart-leads-dashboard

# 2. Set up environment variables
cp .env.example .env
# Open .env and set JWT_ACCESS_SECRET and JWT_REFRESH_SECRET

# 3. Start everything
docker-compose up --build
```

That's it. All three services start automatically.

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:5000/api/v1 |
| Health check | http://localhost:5000/health |

MongoDB data is saved in a Docker volume so it survives restarts.

To stop: `docker-compose down`  
To stop and delete data: `docker-compose down -v`

---

## Environment Variables

### Backend — `backend/.env`

Copy `backend/.env.example` and fill in the required values.

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartleads

# Required — use any long random strings
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
CORS_ORIGIN=http://localhost:5173
```

### Frontend — `frontend/.env`

```env
# Leave empty for local dev — Vite proxy routes to localhost:5000
# Set to your backend URL for production, e.g. https://your-app.onrender.com
VITE_API_URL=
```

### Docker — `.env` (root)

Only the JWT secrets are required:

```env
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
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

Errors look like:
```json
{
  "success": false,
  "message": "What went wrong",
  "errors": [{ "field": "email", "message": "Valid email required" }]
}
```

---

### Auth Endpoints

| Method | Endpoint | Who can use | Description |
|--------|----------|-------------|-------------|
| POST | `/auth/register` | Anyone | Create a new account |
| POST | `/auth/login` | Anyone | Log in and get tokens |
| POST | `/auth/refresh` | Cookie | Get a new access token |
| POST | `/auth/logout` | Logged in | Log out and clear session |
| GET | `/auth/me` | Logged in | Get current user details |

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
| `sortBy` | string | `createdAt` | Field to sort by (`createdAt`, `name`, `email`) |
| `sortOrder` | string | `desc` | `asc` or `desc` |
| `page` | number | `2` | Page number (default: 1) |
| `limit` | number | `10` | Results per page (default: 10, max: 100) |

Example — get page 2 of qualified Instagram leads sorted by name:
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
`notes` is optional.

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

Downloads a CSV file of all leads matching the current filters. Accepts the same query parameters as `GET /leads` (except `page` and `limit`).

```
GET /api/v1/leads/export/csv?status=Qualified&source=Instagram
```

Response is a `text/csv` file download.

---

### HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad request (invalid data) |
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

- **JWT Authentication** — Access tokens (15 min) + refresh tokens (7 days) with rotation. Refresh token is stored in an httpOnly cookie, access token in memory.
- **Role-Based Access Control** — Admin and Sales roles with different data visibility enforced at the database query level.
- **Lead CRUD** — Create, read, update, delete leads with full validation on both frontend and backend.
- **Advanced Filtering** — Status, source, and search filters all work together in a single query.
- **Debounced Search** — 400ms debounce on the search input so the API is not called on every keystroke.
- **Backend Pagination** — Uses MongoDB `skip` and `limit` with full metadata (`totalPages`, `hasNextPage`, etc.).
- **CSV Export** — Exports the current filtered view as a downloadable CSV.
- **Dark Mode** — Toggle in the sidebar, persisted in localStorage.
- **Reactive Stats** — Dashboard stats update automatically after creating, editing, or deleting a lead.

---

## Deployment

The app is deployed on two free-tier platforms:

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | https://smart-leads-dashboard.vercel.app |
| Backend | Render | https://smart-leads-dashboard-2z9r.onrender.com |
| Database | MongoDB Atlas | Shared cluster (M0 free tier) |

**Notes:**
- The Render backend may take 30–60 seconds to respond on the first request if it has been idle (free tier spins down after inactivity).
- The frontend uses `VITE_API_URL` to point to the backend. The `/api/v1` prefix is always appended in code, so the env variable only holds the host.

---

## Local Development Tips

- Run `npm run typecheck` in the frontend folder to check TypeScript without building.
- The Vite dev server proxies `/api/*` to `localhost:5000` automatically — you do not need to set `VITE_API_URL` for local development.
- The backend `/health` endpoint returns `{ "status": "ok" }` and can be used to verify the server is running.
