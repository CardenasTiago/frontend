# -------- Build stage --------
FROM node:20-slim AS builder
WORKDIR /app

# 1) Copiamos sólo package.json y package-lock para cachear deps
COPY package.json package-lock.json ./

# 2) Instalamos dependencias (incluye optionals)
RUN npm install --legacy-peer-deps

# 3) Reconstruimos sharp para la plataforma linux-x64
RUN npm rebuild sharp --force

# 4) Copiamos el resto y hacemos el build
COPY . .
RUN npm run build

# -------- Runtime stage --------
FROM node:20-slim AS runner
WORKDIR /app

# 5) Copiamos el dist estático generado
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["npx", "serve", "-s", "dist", "-l", "0.0.0.0:$PORT"]
