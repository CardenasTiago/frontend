FROM node:20-alpine AS builder
WORKDIR /app

# 1) Copiamos package.json y lock
COPY package.json package-lock.json ./

# 2) Instalamos TODO (prod + dev)
RUN npm install --legacy-peer-deps

# 3) Copiamos el resto y construimos en SSR
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

# 4) Traemos la salida standalone
COPY --from=builder /app/.output/standalone ./

EXPOSE 3000
CMD ["node", "server.js"]
