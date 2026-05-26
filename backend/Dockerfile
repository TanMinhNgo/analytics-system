FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

# Use PORT env (Render sets this automatically)
EXPOSE 10000

ENV NODE_ENV=production

CMD ["npm", "start"]
