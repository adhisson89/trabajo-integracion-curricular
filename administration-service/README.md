# Microservicio de Administración

Este microservicio se encarga de la administración de la aplicación. Registra administradores, permite el inicio de sesión, un CRUD de las personas a las que va a identificar el sistema.

## Requerimientos

- Node.js >= 20
- npm
- pnpm

## Configuración

Para configurar el microservicio, se debe crear un archivo `.env` en la raíz del proyecto con las variables de entorno del archivo [.env.example](./.env.example)


## Instalación y Ejecución

Todo el proceso de instalación y ejecución se realiza a través de la terminal dentro de la carpeta del microservicio.

Para instalar los requerimientos del microservicio, se debe ejecutar el siguiente comando:
    
```bash

pnpm install

```
Para ejecutar el microservicio en modo desarrollo, se debe ejecutar el siguiente comando:

```bash

npm run dev

```

Aquí tienes la documentación en **Markdown** traducida al español:

---

## API Reference

### **Gestión de Personas**

#### Crear una Persona

```http
POST /api/administration/management/person
```

En el body de la solicitud, se debe incluir un objeto JSON con los siguientes campos:

| Parámetro         | Tipo     | Descripción                                           |
|-------------------|----------|-------------------------------------------------------|
| `identification`  | `string` | **Requerido**. Identificación única de la persona.    |
| `name`            | `string` | **Requerido**. Nombre de la persona.                 |
| `surename`        | `string` | **Requerido**. Apellido de la persona.               |
| `role`            | `string` | **Requerido**. Rol (ESTUDIANTE, PROFESOR, etc.).     |
| `photo_id`        | `string` | Opcional. ID de la foto en la colección de imágenes. |
| `other_data`      | `array`  | Opcional. Pares clave-valor con datos adicionales.   |
| `token`           | `string` | **Requerido**. Token de autorización.                |

#### Obtener Todas las Personas

```http
GET /api/administration/management/people/:token
```

| Parámetro | Tipo     | Descripción                        |
|-----------|----------|------------------------------------|
| `token`   | `string` | **Requerido**. Token de autorización.|

#### Obtener una Persona por Identificación

```http
GET /api/administration/management/person/:token/:identification
```

| Parámetro         | Tipo     | Descripción                                           |
|-------------------|----------|-------------------------------------------------------|
| `token`           | `string` | **Requerido**. Token de autorización.                 |
| `identification`  | `string` | **Requerido**. Identificación de la persona.          |

#### Actualizar una Persona

```http
PATCH /api/administration/management/person/:identification
```
En el body de la solicitud, se debe incluir un objeto JSON con los campos a modificar:

| Parámetro         | Tipo     | Descripción                                           |
|-------------------|----------|-------------------------------------------------------|
| `identification`  | `string` | **Requerido**. Identificación única de la persona.    |
| `name`            | `string` | Opcional. Nuevo nombre de la persona.                |
| `surename`        | `string` | Opcional. Nuevo apellido de la persona.              |
| `role`            | `string` | Opcional. Nuevo rol.                                 |
| `photo_id`        | `string` | Opcional. Nuevo ID de la foto.                       |
| `other_data`      | `array`  | Opcional. Nuevos pares clave-valor para los datos.   |
| `token`           | `string` | **Requerido**. Token de autorización.                |

>[!WARNING]
>Al actualizar el contenido de `another_data`, **es necesario proporcionar el arreglo completo de datos**, ya que este campo se sobrescribirá completamente en lugar de ser actualizado parcialmente. Incluir todos los elementos existentes junto con los nuevos para evitar la pérdida de información.

#### Eliminar una Persona

```http
DELETE /api/administration/management/person
```

En el body de la solicitud, se debe incluir un objeto JSON con los siguientes campos:

| Parámetro         | Tipo     | Descripción                                           |
|-------------------|----------|-------------------------------------------------------|
| `identification`  | `string` | **Requerido**. Identificación única de la persona.    |
| `token`           | `string` | **Requerido**. Token de autorización.                |

---

### **Gestión de Imágenes**

#### Subir una Imagen

```http
POST /api/administration/management/image
```

Se debe realizar una solicitud `multipart/form-data` con los siguientes campos:

| Parámetro | Tipo     | Descripción                                   |
|-----------|----------|-----------------------------------------------|
| `photo`   | `file`   | **Requerido**. Archivo de la imagen a subir. |
| `token`   | `string` | **Requerido**. Token de autorización.        |

#### Obtener una Imagen

```http
GET /api/administration/management/image/:token/:id
```

| Parámetro | Tipo     | Descripción                                     |
|-----------|----------|-------------------------------------------------|
| `token`   | `string` | **Requerido**. Token de autorización.           |
| `id`      | `string` | **Requerido**. ID de la imagen a obtener.       |

#### Actualizar una Imagen

```http
PATCH /api/administration/management/image
```

Se debe realizar una solicitud `multipart/form-data` con los siguientes campos:


| Parámetro | Tipo     | Descripción                                     |
|-----------|----------|-------------------------------------------------|
| `id`      | `string` | **Requerido**. ID de la imagen a actualizar.    |
| `photo`   | `file`   | **Requerido**. Nuevo archivo de imagen.         |
| `token`   | `string` | **Requerido**. Token de autorización.           |

---

### Notas

1. Todas las solicitudes que requieren un `token` deben incluirlo como parte del cuerpo de la solicitud, parámetro de URL, o encabezados, dependiendo de la ruta.
