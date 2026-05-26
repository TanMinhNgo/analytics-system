You are an expert Node.js backend engineer. Build a production-ready Analytics Dashboard System backend with the following specifications:

## Project Overview

An enterprise analytics platform that collects data from multiple sources, processes it through an ETL pipeline, stores it in a data warehouse, and exposes it via APIs for dashboard consumption.

## Tech Stack

- Runtime: Node.js (latest LTS)
- Framework: Express.js
- Database: PostgreSQL (primary data warehouse) + Redis (caching & real-time)
- ORM: Prisma or Drizzle ORM
- Queue: BullMQ (ETL job processing)
- Authentication: JWT + Role-Based Access Control (RBAC)
- Validation: Zod
- Testing: Vitest + Supertest
- Docs: Swagger/OpenAPI 3.0

## Core Modules to Implement

### 1. Data Sources Connector

- Support multiple source types: ERP, Legacy systems, POS, Other OLTP, External Data
- Each connector implements a standard interface: connect(), extract(), validate()
- Config-driven: store connection params in DB, encrypted with AES-256
- Support REST, JDBC-like (pg client), CSV/Excel file upload

### 2. ETL Pipeline (BullMQ)

- Jobs: SELECT → EXTRACT → TRANSFORM → INTEGRATE → LOAD
- Each step is a separate BullMQ job with retry, backoff, dead-letter queue
- Transformation rules configurable per data source (JSON schema mapping)
- Full audit log of every ETL run: status, rows processed, errors, duration
- Schedule ETL jobs via cron (node-cron or BullMQ repeatable jobs)

### 3. Data Warehouse Layer

- PostgreSQL schema with partitioned tables by date (RANGE partitioning)
- Metadata table: tracks source schema, last sync time, data lineage
- Enterprise Data Warehouse (EDW) central fact/dimension tables
- Data Mart: filtered/aggregated views (e.g., cardiac_data mart as shown in diagram)
- Migrations managed by Prisma Migrate or Drizzle Kit

### 4. API Layer

- RESTful endpoints:
  - GET /api/v1/datasources — list & manage data sources
  - POST /api/v1/etl/run — trigger ETL job manually
  - GET /api/v1/etl/jobs/:id — job status & logs
  - GET /api/v1/warehouse/query — parameterized data query with filters, pagination
  - GET /api/v1/analytics/summary — aggregated KPIs
  - GET /api/v1/analytics/timeseries — time-bucketed data (hourly/daily/weekly)
  - GET /api/v1/datamarts — list available data marts
  - GET /api/v1/datamarts/:name/data — query specific data mart
- WebSocket endpoint: real-time streaming of ETL progress & live metrics
- Rate limiting per role (middleware)

### 5. Role-Based Access Control

- Roles: ADMIN, DATA_ENGINEER, ANALYST, VIEWER
- ADMIN: full access (manage sources, trigger ETL, view all data)
- DATA_ENGINEER: manage ETL, view warehouse metadata
- ANALYST: query data marts, view dashboards
- VIEWER: read-only dashboard access, no raw data
- Middleware: checkPermission(resource, action) on every route

### 6. Middleware (Pentaho-inspired middleware layer)

- Request/response transformation
- Data masking for PII fields based on role
- Query result caching in Redis (TTL configurable per endpoint)
- Request logging with correlation IDs (Winston + Pino)

## Project Structure

src/
├── config/ # env, database, redis config
├── modules/
│ ├── datasources/ # connectors for each source type
│ ├── etl/ # pipeline jobs, scheduler
│ ├── warehouse/ # EDW models, data mart queries
│ ├── analytics/ # aggregation, timeseries logic
│ ├── auth/ # JWT, RBAC middleware
│ └── api/ # route handlers, validators
├── jobs/ # BullMQ job definitions
├── middleware/ # global middleware
├── utils/ # helpers, encryption, logger
└── tests/ # unit + integration tests

## Additional Requirements

- Docker + docker-compose setup (Node, PostgreSQL, Redis)
- Environment config via .env with Zod validation on startup
- Graceful shutdown handling
- Health check endpoint: GET /health
- Seed script for demo data and test roles
- README with setup, architecture diagram description, and API reference

Generate the complete project with all files, schemas, and working code.
