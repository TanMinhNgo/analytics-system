# Multi-stage Dockerfile for fullstack app (frontend + backend)
# Build context: repo root

# --- Stage 1: Build frontend (Next.js) ---
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# --- Stage 2: Build backend (Express) ---
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend/ .
RUN npm run build || true  # If no build step, ignore error

# --- Stage 3: Runtime image ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Backend deps only
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy backend build
COPY --from=backend-build /app/backend .

# Copy frontend static build to public/
COPY --from=frontend-build /app/frontend/out ./public

EXPOSE 4000
CMD ["npm", "start"]
