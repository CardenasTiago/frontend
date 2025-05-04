# -------- Build stage --------
FROM node:20-alpine AS builder

# 1) Directorio de trabajo
WORKDIR /app

# 2) Copiamos sólo lo necesario para cachear deps
COPY package.json package-lock.json ./

# 3) Instalamos las dependencias
RUN npm ci

# 4) Copiamos el resto del código y hacemos la build de Astro
COPY . .
RUN npm run build

# -------- Production stage --------
FROM node:20-alpine AS runner

WORKDIR /app

# 1) Instalamos un servidor estático ligero
RUN npm install -g serve

# 2) Copiamos la carpeta dist ya construida
COPY --from=builder /app/dist ./dist

# 3) Puerto que usará Render (env $PORT)
EXPOSE 3000

# 4) Arrancamos el servidor estático apuntando a dist/
CMD ["serve", "-s", "dist", "-l", "0.0.0.0:$PORT"]
    