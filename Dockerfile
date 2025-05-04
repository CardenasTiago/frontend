# -------- Build stage --------
FROM node:20-alpine AS builder

# 1) Instala pnpm
RUN npm install -g pnpm

# 2) Directorio de trabajo
WORKDIR /app

# 3) Copia lockfiles y package.json para cachear deps
COPY package.json package-lock.json pnpm-lock.yaml ./

# 4) Instala dependencias
RUN pnpm install --frozen-lockfile

# 5) Copia el resto del código y genera la build
COPY . .
RUN pnpm run build
    
# -------- Production stage --------
FROM node:20-alpine AS runner

# 1) Instala pnpm (necesario para preview)
RUN npm install -g pnpm

WORKDIR /app

# 2) Trae los archivos generados en dist/
COPY --from=builder /app/dist ./dist

# 3) Expone el puerto que Render inyecta en $PORT
EXPOSE 3000

# 4) Arranca el preview server de Astro en 0.0.0.0 
#    y en el puerto definido en la var. de entorno $PORT
CMD ["sh", "-c", "pnpm run preview -- --host 0.0.0.0 --port $PORT"]