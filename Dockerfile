# -------- Build stage --------
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos solo lockfile y package.json para cachear deps
COPY package.json package-lock.json ./

# Instalamos dependencias con npm install en lugar de npm ci
RUN npm install

# Copiamos el resto del código y hacemos la build de Astro
COPY . .
RUN npm run build

# -------- Production stage --------
FROM node:20-alpine AS runner

WORKDIR /app

# Servidor estático
RUN npm install -g serve

# Traemos la carpeta dist generada
COPY --from=builder /app/dist ./dist

# Exponemos el puerto que Render inyecte en $PORT
EXPOSE 3000

# Arrancamos serve en 0.0.0.0:$PORT
CMD ["serve", "-s", "dist", "-l", "0.0.0.0:$PORT"]
