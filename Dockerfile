# -------- Build stage --------
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# -------- Runtime stage --------
FROM node:20-slim AS runner
WORKDIR /app

# 1) Copiar los package*.json para poder instalar prod deps
COPY package.json package-lock.json ./

# 2) Instalar SOLO production deps (incluye server-destroy, vue, @iconify/vue, etc)
RUN npm ci --omit=dev

# 3) Copiar la carpeta ya compilada
COPY --from=builder /app/dist ./dist

EXPOSE 3000
# Lanzar el entrypoint de Astro
CMD ["node", "dist/server/entry.mjs", "--port", "${PORT:-3000}"]
