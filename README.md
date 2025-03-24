# Docker set up

Prerrequisito 

- la API debe encontrarse en ejecucion. 

## Iniciar aplicacion por primera vez

Para iniciar la aplicacion, se debe ejecutar el siguiente comando en la raiz del proyecto

    sh scripts/init.sh

El front deberia verse en el puerto 4321 

> Si la API de go esta apagada, va a tirar error

## Reinstalar aplicacion

En caso de que desees reinstalar los paquetes de node, puedes hacerlo con el siguiente comando

    sh scripts/reset.sh