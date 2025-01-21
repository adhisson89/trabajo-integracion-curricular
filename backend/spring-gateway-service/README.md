# Microservicio de Spring Gateway

Este microservicio es el encargado de enrutar las peticiones a los microservicios que se encuentran en la red. Para ello, se utiliza el servidor de descubrimiento Eureka.

## Autor

- [Adhisson Cedeño](https://github.com/adhisson89)

## Requerimientos

- Java 21
- Maven

## Configuración

El archivo de configuración de Eureka se encuentra en la carpeta `src/main/resources` y se llama [application.properties](./src/main/resources/application.properties). En este archivo se pueden configurar los parametros del gateway.
Si se desea incluir un nuevo microservicio, se debe agregar la siguiente configuración en el archivo `application.properties`:

```properties
spring.cloud.gateway.routes[numero_correspondiente].id=nombre_microservicio
spring.cloud.gateway.routes[numero_correspondiente].uri=lb://nombre_microservicio
spring.cloud.gateway.routes[numero_correspondiente].predicates[0]=Path=/nombre_microservicio/**
```


## Instalación y Ejecución

Todo el proceso de instalación y ejecución se realiza automaticamente gracias a docker. En la carpeta principal, en linux ejecutar el siguiente comando:

```bash
docker compose up
```
