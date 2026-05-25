You are an expert Next.js frontend engineer. Build a production-ready Analytics Dashboard frontend for an enterprise Analytics Dashboard System.

## Tech Stack
- Framework: Next.js 16 (App Router, React Server Components)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS v4 + shadcn/ui components
- State: Zustand (client state) + TanStack Query v5 (server state, caching)
- Charts: Recharts or Apache ECharts (for time-series, bar, pie, funnel)
- Real-time: native WebSocket hook (or socket.io-client)
- Forms: React Hook Form + Zod validation
- Tables: TanStack Table v8 (virtualized for large datasets)
- Auth: NextAuth.js v5 (JWT strategy, matching backend RBAC roles)
- Testing: Vitest + React Testing Library + Playwright (E2E)

## Pages & Features

### 1. Authentication
- /login — email + password form, JWT stored in httpOnly cookie via NextAuth
- Redirect by role after login:
  - ADMIN → /admin/dashboard
  - ANALYST/VIEWER → /dashboard

### 2. Main Dashboard (/dashboard)
- Top KPI cards: Total Records Ingested, ETL Success Rate, Active Data Sources, Last Sync Time
- Time-series chart: data ingestion volume over time (hourly/daily toggle)
- Pie chart: records by data source type (ERP, POS, Legacy, External)
- Recent ETL Jobs table: job name, status (badge: running/success/failed), duration, rows processed
- Auto-refresh every 30s OR real-time via WebSocket feed

### 3. Data Sources Management (/datasources) — ADMIN, DATA_ENGINEER only
- Table listing all configured data sources with status indicators
- Add/Edit data source modal: type selector, connection config form (dynamic fields per type)
- Test connection button with live feedback
- Enable/disable toggle per source

### 4. ETL Pipeline Monitor (/etl)
- Live job queue view: pending, active, completed, failed tabs
- Job detail drawer: full log output (streaming via WebSocket), step-by-step progress bar (SELECT → EXTRACT → TRANSFORM → INTEGRATE → LOAD)
- Trigger ETL run manually: select source, confirm dialog
- Schedule manager: view/edit cron schedules per source
- ETL run history: filterable table with date range picker

### 5. Data Warehouse Explorer (/warehouse) — ADMIN, DATA_ENGINEER
- Schema browser: tree view of EDW tables, columns, data types
- Metadata panel: row count, last updated, partition info
- Data Mart list: cards showing each mart (name, description, row count)
- Quick query builder: select mart, add filters, preview results in paginated table (TanStack Table)

### 6. Analytics & Reports (/analytics)
- Role-filtered: ANALYST sees only permitted data marts
- Report builder:
  - Select data mart
  - Choose dimensions (group by) and metrics (aggregation)
  - Date range picker
  - Visualization toggle: table / bar chart / line chart / area chart
- Export: CSV download of current query result
- Saved reports: list of saved queries the user can re-run

### 7. Admin Panel (/admin) — ADMIN only
- User management: list users, assign roles, deactivate accounts
- System health: uptime, DB connection status, Redis status, queue depth
- Audit log: paginated table of all ETL runs, user actions, data access events

## Layout & UI Architecture
- Root layout: sidebar nav (collapsible) + topbar (breadcrumb, user menu, notifications bell)
- Sidebar items shown/hidden based on user role (client-side guard + server component check)
- Responsive: sidebar collapses to icon-only on tablet, bottom nav on mobile
- Dark mode support via next-themes
- Loading states: skeleton loaders for all async data
- Error boundaries per section with retry button
- Toast notifications for ETL job completions and errors (sonner)

## API Integration
- All API calls go through a centralized apiClient (fetch wrapper with auth headers, error handling)
- TanStack Query keys follow pattern: ['resource', 'action', params]
- Optimistic updates for toggle/enable actions
- Infinite scroll or cursor-based pagination for large tables
- WebSocket hook: useETLJobStream(jobId) — subscribes and appends log lines to local state

## Project Structure
src/
├── app/
│   ├── (auth)/login/
│   ├── (app)/dashboard/
│   ├── (app)/datasources/
│   ├── (app)/etl/
│   ├── (app)/warehouse/
│   ├── (app)/analytics/
│   └── (app)/admin/
├── components/
│   ├── ui/           # shadcn/ui base components
│   ├── charts/       # reusable chart wrappers
│   ├── tables/       # TanStack table configs
│   ├── layout/       # Sidebar, Topbar, Breadcrumb
│   └── shared/       # KPI cards, status badges, loaders
├── lib/
│   ├── api/          # apiClient, query hooks per module
│   ├── auth/         # NextAuth config, role guards
│   ├── store/        # Zustand stores
│   └── utils/        # formatters, date helpers
├── types/            # shared TypeScript interfaces
└── tests/            # unit + E2E tests

## Additional Requirements
- next.config.ts: API proxy rewrites to backend URL (env-based)
- .env.local: NEXT_PUBLIC_API_URL, NEXTAUTH_SECRET, etc.
- Middleware.ts: protect all /dashboard, /etl, /warehouse, /admin routes, redirect unauthorized by role
- Storybook setup for UI component library (optional but preferred)
- Docker support: Dockerfile for Next.js production build
- README with setup, environment variables, role permission matrix

Generate the complete project with all pages, components, hooks, and configurations.