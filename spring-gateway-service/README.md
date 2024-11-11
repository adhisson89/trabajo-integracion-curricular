# Microservicio de Sproing Gateway

Este microservicio es el encargado de enrutar las peticiones a los microservicios que se encuentran en la red. Para ello, se utiliza el servidor de descubrimiento Eureka.

## Requerimientos

- Java 21

## Configuración

El archivo de configuración de Eureka se encuentra en la carpeta `src/main/resources` y se llama [application.properties](./src/main/resources/application.properties). En este archivo se pueden configurar los parametros de Eureka.


## Instalación y Ejecución

Todo el proceso de instalación y ejecución se realiza automaticamente gracias a docker. En la carpeta principal, en linux ejecutar el siguiente comando:

```bash
docker compose up
```
