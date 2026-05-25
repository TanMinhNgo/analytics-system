# Analytics Dashboard Backend

## Setup

1. Copy `.env.example` to `.env` and adjust values.
2. Install deps: `npm install`
3. Start services: `docker-compose up -d`
4. Run SQL in `drizzle/0000_init.sql` against your database.
5. Seed demo data: `node src/seed.js`
6. Run the API: `npm run dev`

## Key Endpoints

- `GET /health`
- `POST /api/v1/auth/login`
- `GET /api/v1/datasources`
- `POST /api/v1/etl/run`
- `GET /api/v1/etl/jobs/:id`
- `GET /api/v1/analytics/summary`
- `GET /api/v1/datamarts`

WebSocket: `ws://localhost:4000/ws?jobId=<jobId>`
