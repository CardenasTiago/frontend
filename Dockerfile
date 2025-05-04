# -------- Build stage --------
FROM node:20-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# -------- Runtime stage --------
FROM node:20-slim AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npx", "serve", "-s", "dist", "-l", "0.0.0.0:$PORT"]
