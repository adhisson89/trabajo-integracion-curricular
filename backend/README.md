# Backend

Para el Backend, se creo un sistema de microservicios orquestados por docker compose

## Cómo correr el proyecto

### Requisitos

- Docker
- Docker Compose

### Pasos

1. Clonar el repositorio
2. Ingresar a la carpeta `backend`
3. Ejecutar el comando

```bash
docker compose -f [nombre-del-archivo] up
```
 
>[!IMPORTANT]
>En linux el comando es `docker compose`, para windows es `docker-compose`.

## FAQ

#### Si el sistema no funciona, ¿qué puedo hacer?

1. Verificar que los puertos 8080 y 8761 no estén ocupados\
2. Verificar que Docker esté corriendo
3. Verificar que Docker Compose esté instalado
4. Verificar que las variables de ambiente estén correctamente configuradas sea en el archivo `.env` o en el archivo `docker-compose.yml` correspondiente
5. Volver a crear los contenedores con el comando 
```bash
docker compose -f [nombre-del-archivo] up --build --force-recreate --remove-orphans
```