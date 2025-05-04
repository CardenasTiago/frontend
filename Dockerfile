# -------- Build stage --------
FROM node:20-alpine AS builder
WORKDIR /app

# 1) Copiamos sólo package + tsconfig + env.d.ts/shims
COPY package.json package-lock.json tsconfig.json ./
# También copia explícito del shim, por si acaso:
COPY src/env.d.ts src/env.d.ts

# 2) Instalamos deps
RUN npm install

# 3) Copiamos el resto del código
COPY . .

# 4) Build de Astro
RUN npm run build

# -------- Production stage --------
FROM node:20-alpine AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "0.0.0.0:$PORT"]
