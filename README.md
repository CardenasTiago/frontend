# Docker set up

Prerrequisito, la aplicacion de go debe encontrarse corriendo. 

Si todavia no creaste la red externa, ejecutar el siguiente comando

    docker network create suffgo-network

Luego arrancar el contenedor que tiene instalado node 20 y pnpm

    docker compose run astro-app sh
    
Instalar dependencias

    pnpm install

Ahora salis del contenedor escribiendo `exit`e ingresar el siguiente comando

    docker compose up

El front deberia verse en 
    
    localhost:4321

> Si la API de go esta apagada, va a tirar error

Si hay que actualizar la lista de dependencias

    docker exec -it astro-app sh

    pnpm update
