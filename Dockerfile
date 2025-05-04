# -------- Build stage --------
FROM node:20-slim AS builder
WORKDIR /app

# 1) Sistema: build-essential + Python para módulos nativos
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# 2) Copiar lockfiles
COPY package.json package-lock.json ./

# 3) Instalación de deps (incluyendo opcionales) con permisos para scripts nativos
ENV npm_config_unsafe_perm=true
RUN npm ci --legacy-peer-deps --include=optional

# 4) Copiar resto y construir
COPY . .
RUN npm run build

# -------- Runtime stage --------
FROM node:20-slim AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist

EXPOSE 3000
# CMD para producción SSR
CMD sh -c "node dist/server/entry.mjs --port $PORT"


