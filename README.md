# set up

    docker compose run astro-app sh
    
    pnpm install

Ahora salis del contenedor escribiendo `exit`e ingresar el siguiente comando

    docker compose up

El front deberia verse en 
    
    localhost:4321

Si hay que actualizar la lista de dependencias

    docker exec -it astro-app sh

    pnpm update
