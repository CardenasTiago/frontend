# 1) Build stage
FROM node:20-slim AS builder
WORKDIR /app

# Copia lockfiles e instala TODO (dev+prod)
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copia el resto y construye
COPY . .
ARG PUBLIC_API_BASE_URL
ENV PUBLIC_API_BASE_URL=$PUBLIC_API_BASE_URL
RUN npm run build

# 2) Runtime stage
FROM node:20-slim AS runner
WORKDIR /app

# Copia sólo prod-deps para un contenedor más ligero
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copia la carpeta ya compilada
COPY --from=builder /app/dist ./dist

EXPOSE 3000

ENV HOST=0.0.0.0

CMD sh -c "node dist/server/entry.mjs --port ${PORT:-3000} --host ${HOST}"