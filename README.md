# Docker set up

Prerrequisito 

- la API debe encontrarse en ejecucion. 

## Iniciar aplicacion por primera vez

Completar variable de entorno del path base de la API

    cp .env.sample .env

> PUBLIC_API_BASE_URL

Para iniciar la aplicacion, se debe ejecutar el siguiente comando en la raiz del proyecto

    sh scripts/init.sh

El front deberia verse en el puerto 4321 

> Si la API de go esta apagada, va a tirar error

## Reinstalar aplicacion

En caso de que desees reinstalar los paquetes de node, puedes hacerlo con el siguiente comando

    sh scripts/reset.sh