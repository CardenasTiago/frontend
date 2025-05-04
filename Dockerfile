# -------- Build stage --------
FROM node:20-slim AS builder
WORKDIR /app

# 1) Instalar dependencias del sistema para Sharp
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    libvips-dev \
    && rm -rf /var/lib/apt/lists/*

# 2) Copiar package.json y lock para cachear deps
COPY package.json package-lock.json ./

# 3) Instalar dependencias (incluye opcionales)
RUN npm ci --legacy-peer-deps --include=optional

# 4) Reconstruir sharp para linux-x64
RUN npm rebuild sharp --force

# 5) Copiar código y construir
COPY . .
RUN npm run build

# -------- Runtime stage --------
FROM node:20-slim AS runner
WORKDIR /app

# 6) Copiar salida estática
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["npx", "serve", "-s", "dist", "-l", "0.0.0.0:$PORT"]
