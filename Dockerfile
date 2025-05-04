FROM node:20-alpine AS builder
WORKDIR /app

# 1) Instala dependencias nativas para sharp/libvips
RUN apk add --no-cache \
      vips-dev fftw-dev build-base pkgconfig python3

COPY package.json package-lock.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

# -------- Runtime stage --------
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache vips fftw
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npx", "serve", "-s", "dist", "-l", "0.0.0.0:$PORT"]
