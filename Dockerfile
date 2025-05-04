# -------- Build stage --------
FROM node:20-alpine AS builder
WORKDIR /app

# 1) Copiamos package.json y lock
COPY package.json package-lock.json ./

# 2) Instalamos deps
RUN npm install

# 3) Copiamos el resto y generamos build SSR
COPY . .
RUN npm run build

# -------- Runtime stage --------
FROM node:20-alpine AS runner
WORKDIR /app

# Copiamos la salida standalone de Astro
COPY --from=builder /app/.output/standalone ./

# Exponemos el puerto que Render define
EXPOSE 3000

# Arrancamos el servidor Node
CMD ["node", "server.js"]
