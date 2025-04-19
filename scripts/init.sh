#!/bin/bash
set -e

if [ -d "node_modules" ]; then
    echo "La carpeta node_modules ya existe. Saltando 'pnpm install'."
  else
    echo "No existe la carpeta node_modules. Instalando dependencias..."
    docker compose run --rm astro-app pnpm install
  fi

docker compose up 
