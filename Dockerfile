# Multi-stage Dockerfile for single-service deployment:
# - Backend (Express) serves /api
# - Frontend (Next.js) runs internally and is proxied by backend

FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci
COPY backend/ .
RUN npm run build || true

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install backend runtime deps
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Install frontend runtime deps
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy backend app
COPY --from=backend-build /app/backend /app/backend

# Copy frontend runtime artifacts
COPY --from=frontend-build /app/frontend/.next /app/frontend/.next
COPY --from=frontend-build /app/frontend/public /app/frontend/public
COPY --from=frontend-build /app/frontend/package.json /app/frontend/package.json
COPY --from=frontend-build /app/frontend/next.config.ts /app/frontend/next.config.ts
COPY --from=frontend-build /app/frontend/next-env.d.ts /app/frontend/next-env.d.ts

COPY docker/start-render.sh /app/start-render.sh
RUN chmod +x /app/start-render.sh

EXPOSE 4000
CMD ["/app/start-render.sh"]
