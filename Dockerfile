# -------- Build stage --------
FROM node:20-alpine AS builder
WORKDIR /app

# 1) Copy only package manifests
COPY package.json package-lock.json ./

# 2) Install deps, telling npm to relax peer-dep checks
RUN npm install --legacy-peer-deps

# 3) Copy the rest and build
COPY . .
RUN npm run build

# -------- Runtime stage --------
FROM node:20-alpine AS runner
WORKDIR /app

# Serve your SSR output
COPY --from=builder /app/.output/standalone ./
EXPOSE 3000
CMD ["node", "server.js"]
