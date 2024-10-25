FROM node:20-alpine

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Establecer el directorio de trabajo
WORKDIR /app

# Exponer el puerto de desarrollo de Astro (por defecto 3000)
EXPOSE 4321 

# Comando por defecto para iniciar el contenedor
CMD [ "pnpm", "run", "dev", "--host" ]
