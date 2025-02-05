FROM node:20-alpine

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Establecer el directorio de trabajo
WORKDIR /app

# Comando por defecto para iniciar el contenedor
CMD [ "pnpm", "run", "dev", "--host" ]