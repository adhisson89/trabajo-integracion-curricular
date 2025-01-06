# Microservicio de Modelo de IA para Reconocimiento Facial para PNE - Policía Nacional del Ecuador

Este microservicio se encarga del procesamiento y reconocimiento facial utilizando el modelo de IA Facenet. Es parte de un sistema de identificación y gestión de personas para la Policía Nacional del Ecuador.

## Requerimientos

- **Python 3.8+**
- **MongoDB** (Base de datos)
- **Flask** (Framework web)
- **DeepFace** (Librería de reconocimiento facial)
- **Pymongo** (Conexión con MongoDB)

## Configuración

Para configurar el microservicio, se debe crear un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

```bash
MONGO_URI="mongodb+srv://<usuario>:<contraseña>@<servidor>/<base_de_datos>?retryWrites=true&w=majority"
```

## Instalación y Ejecución

Todo el proceso de instalación y ejecución se realiza a través de la terminal dentro de la carpeta del microservicio.

### Instalación de requerimientos

Para instalar los requerimientos del microservicio, se debe ejecutar el siguiente comando:

```bash
pip install -r requirements.txt
```

### Ejecución del microservicio

Para ejecutar el microservicio en modo desarrollo, se debe ejecutar el siguiente comando:

```bash
python app.py
```

## API Reference

### **Gestión de Personas**

#### Crear una Persona

```http
POST /api/face-recognition/addFace
```

En el body de la solicitud, se debe incluir un objeto JSON con los siguientes campos:

| Parámetro         | Tipo     | Descripción                                           |
|-------------------|----------|-------------------------------------------------------|
| `photo_id`        | `string` | **Requerido**. ID de la persona a la que pertenece la imagen. |
| `file`            | `file`   | **Requerido**. Foto de la persona que se desea almacenar. |

#### Comparar una Imagen

```http
POST /api/face-recognition/compareFace
```

En el body de la solicitud, se debe incluir un archivo `file` con la imagen a comparar.

#### Respuesta

La respuesta será un JSON con el resultado de la comparación.

**Ejemplo de respuesta exitosa:**

```json
{
  "status": "Match Found",
  "photo_id": "676d1e1cf4c8418693922c3d",
  "score": 0.3
}
```

**Ejemplo de respuesta sin coincidencias:**

```json
{
  "status": "No Match",
  "score": 0.8
}
```
### Notas

1. Todas las solicitudes que requieren un `token` deben incluirlo como parte del cuerpo de la solicitud, parámetro de URL, o encabezados, dependiendo de la ruta.
2. Se utiliza el modelo de reconocimiento facial **Facenet** para generar y comparar embeddings de las imágenes.