# Microservicio de Descubrimiento Eureka

Este microservicio es el encargado de registrar y descubrir los microservicios que se encuentran en la red. Para ello, se utiliza el servidor de descubrimiento Eureka.

## Autor

- [Adhisson Cedeño](https://github.com/adhisson89)

## Requerimientos

- Java 21
- Maven

## Configuración

El archivo de configuración de Eureka se encuentra en la carpeta `src/main/resources` y se llama [application.properties](./src/main/resources/application.properties). En este archivo se pueden configurar los parametros de Eureka.


## Instalación y Ejecución

Todo el proceso de instalación y ejecución se realiza automaticamente gracias a docker. En la carpeta principal, en linux ejecutar el siguiente comando:

```bash
docker compose up
```

Para poder revisar el estado de los microservicios registrados, una vez levantado el servicio, se puede acceder a la siguiente URL: http://localhost:8761/

