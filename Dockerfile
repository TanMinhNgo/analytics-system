# Backend Dockerfile (frontend should be deployed separately in Next.js server mode)
# Build context: repo root

# --- Stage 1: Build backend (Express) ---
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend/ .
RUN npm run build || true  # If no build step, ignore error

# --- Stage 2: Runtime image ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Backend deps only
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy backend build
COPY --from=backend-build /app/backend .

EXPOSE 4000
CMD ["npm", "start"]
