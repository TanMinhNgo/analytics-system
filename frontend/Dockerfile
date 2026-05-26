# Dockerfile for Next.js frontend static export
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Serve static files with nginx
FROM nginx:alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
