# -------- Build stage --------
FROM node:20-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y build-essential python3 \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
ENV npm_config_unsafe_perm=true
RUN npm ci --legacy-peer-deps --include=optional

COPY . .
RUN npm run build

# -------- Runtime stage --------
FROM node:20-slim AS runner
WORKDIR /app

# 1) Copiamos las deps de producción
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# 2) Copiamos el build
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# 3) Arrancamos la app SSR con el entrypoint correcto
CMD ["sh", "-c", "HOST=0.0.0.0 PORT=${PORT:-3000} node dist/server/entry.mjs"]
