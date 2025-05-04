# -------- Build stage --------
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --include=optional
COPY . .
RUN npm run build

# -------- Runtime stage --------
FROM node:20-slim AS runner
WORKDIR /app

# 1) Copiamos package.json para luego instalar prod deps
COPY package.json package-lock.json ./

# 2) Instalamos solo prod deps (incluye vue, astro-icon…)
RUN npm ci --production

# 3) Copiamos la salida del build
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# 4) Arrancamos el servidor que generó Astro
CMD ["node", "dist/server/index.js"]
