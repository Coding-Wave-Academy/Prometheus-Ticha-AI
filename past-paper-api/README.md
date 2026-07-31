# Ticha AI — Past Paper REST API

High-performance, versioned RESTful backend service for querying educational levels, subjects, past examination papers, metadata, full-text search, and issuing expiring signed PDF download URLs.

---

## 🛠️ Stack & Architecture

- **Runtime**: Node.js (ESM) + Express
- **Database & Storage**: Supabase (Postgres + PostgREST + Storage signed URLs)
- **Validation**: Zod
- **Rate Limiting**: `express-rate-limit` (per-IP default + `x-api-key` tiering)
- **Security**: Helmet, CORS
- **Documentation**: OpenAPI 3.0 via Swagger UI (`/docs`)
- **Testing**: Jest + Supertest

---

## 📁 Project Layout

```
past-paper-api/
├── src/
│   ├── config/          # Environment variables & Supabase initialization
│   ├── middleware/      # Rate limiting, Zod validation, error handler
│   ├── services/        # PostgREST queries, full-text search, signed URLs, API keys
│   ├── controllers/     # Route handlers (health, levels, subjects, papers)
│   ├── validators/      # Zod schemas for query params & UUID validation
│   ├── routes/          # Express versioned routes (/api/v1) & Swagger UI docs (/docs)
│   ├── utils/           # Response formatters, crypto helpers
│   ├── app.js           # Express app middleware configuration
│   └── server.js        # HTTP server entrypoint
├── tests/               # Automated integration tests
├── schema.sql           # Postgres DDL, indexes, FTS trigger, RLS & seed data
├── openapi.yaml         # OpenAPI 3.0 API Specification
├── .env.example         # Environment template
├── package.json
└── README.md
```

---

## 🚀 Quick Start

### 1. Environment Setup
Copy `.env.example` to `.env` and supply your Supabase credentials:

```bash
cp .env.example .env
```

```env
PORT=4000
NODE_ENV=development
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_STORAGE_BUCKET=past-papers
SIGNED_URL_EXPIRES_IN=60
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=60
```

### 2. Database Migration & Seed
Run `schema.sql` inside your Supabase SQL Editor or Postgres database. This will create:
- `educational_levels`, `subjects`, `papers`, `api_clients`, `download_events`
- Postgres full-text search `fts` generated column + GIN index on `papers`
- RLS policies and `past-papers` private storage bucket

### 3. Run Locally

```bash
# Install dependencies
npm install

# Start in development mode
npm run dev

# Run automated tests
npm test
```

---

## 📌 API Endpoints Reference (`/api/v1`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/health` | Liveness check |
| **GET** | `/api/v1/levels` | List educational levels (`O/L`, `A/L`, `UNIVERSITY`) |
| **GET** | `/api/v1/subjects?level=O/L` | List active subjects per level |
| **GET** | `/api/v1/papers?level=&subject=&year=&q=&page=&limit=` | Searchable, paginated past papers |
| **GET** | `/api/v1/papers/:id` | Get paper metadata & file info |
| **GET** | `/api/v1/papers/:id/download` | Increments count, logs download event & redirects (302) to signed PDF URL |
| **GET** | `/docs` | Interactive Swagger UI API documentation |

---

## 🔑 Rate Limiting & Growth API Keys

The API enforces IP-based rate limits (60 req/min default). 

Partner applications can pass an optional `x-api-key` header to unlock higher tier limits:
- **Free**: 100 req/min
- **Pro**: 1,000 req/min
- **Enterprise**: 5,000 req/min

---

## 🚢 Deployment

- **Render / Railway**: Run `npm start` directly.
- **Vercel / Serverless**: Pluggable Redis store (e.g. Upstash) can be passed to `express-rate-limit` for serverless state persistence.
