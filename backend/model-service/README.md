# Face Recognition Service

## Descripción General
Este servicio utiliza **DeepFace** para generar representaciones ("embeddings") de rostros a partir de imágenes, que luego se almacenan en una base de datos **MongoDB** para futuras comparaciones. Además, permite la comparación de nuevas imágenes con los datos almacenados utilizando **distancia coseno** para determinar similitudes entre rostros.

El servicio está construido con **Flask** para proporcionar una API REST que expone los siguientes endpoints:
- Agregar una nueva imagen y almacenar su embedding.
- Comparar una imagen cargada con los embeddings existentes.
- Consultar el estado del servicio y verificar la salud del servidor.

---

## Tecnologías Utilizadas

### Lenguajes y Frameworks
- **Python** (Flask)
- **DeepFace** (para generación de embeddings de rostros)

### Bases de Datos
- **MongoDB**

### Librerías
- **scipy**: Para calcular la distancia coseno.
- **pymongo**: Para interactuar con la base de datos MongoDB.
- **tempfile** y **os**: Para el manejo temporal de archivos.

---

## Requisitos Previos

Antes de ejecutar este servicio, asegúrese de tener los siguientes componentes configurados:

1. **MongoDB**:
   - Asegúrese de que su instancia de MongoDB esté accesible.
   - Actualice la cadena de conexión `DB_STRING` con sus credenciales y URL.

2. **Python 3.8+**:
   - Instalación de dependencias necesarias:
     ```bash
     pip install flask pymongo scipy deepface
     ```

3. **DeepFace**:
   - Asegúrese de tener correctamente configurado el modelo **Facenet** (descarga automática al primer uso).

4. **Puerto del servidor**:
   - El servidor utiliza un puerto aleatorio (entre 6000 y 7000) o el puerto predeterminado **5000**.

---

## Estructura del Proyecto

```
.
|-- app.py                 # Archivo principal para ejecutar el servidor Flask
|-- model.py               # Lógica de procesamiento de embeddings y operaciones en MongoDB
|-- requirements.txt       # Lista de dependencias necesarias para el proyecto
|-- README.md              # Descripción del proyecto (este archivo)
```

---

## Configuración del Proyecto

### Conexión a MongoDB

Actualice la variable `DB_STRING` en los archivos `app.py` y `model.py` con la cadena de conexión de su base de datos:

```python
DB_STRING = "mongodb+srv://<usuario>:<contraseña>@<cluster>.mongodb.net/<base_de_datos>?retryWrites=true&w=majority"
```

### Ejecución del Servidor

Ejecute el archivo principal con el siguiente comando:

```bash
python app.py
```

Por defecto, el servidor iniciará en el puerto **5000** y estará accesible en:

```
http://localhost:5000
```

---

## Endpoints Disponibles

### 1. **Home**
- **Ruta**: `/api/face-recognition/`
- **Método**: `GET`
- **Descripción**: Verifica si el servidor está corriendo correctamente.
- **Respuesta**:
  ```json
  {
      "message": "Server is running!"
  }
  ```

### 2. **Health Check**
- **Ruta**: `/api/face-recognition/health`
- **Método**: `GET`
- **Descripción**: Verifica el estado del servidor.
- **Respuesta**:
  ```json
  {
      "status": "UP"
  }
  ```

### 3. **Agregar un Rostro**
- **Ruta**: `/api/face-recognition/addFace`
- **Método**: `POST`
- **Descripción**: Agrega un nuevo rostro generando y almacenando su embedding.
- **Parámetros**:
  - **Archivo** (`file`): Una imagen en formato JPEG, JPG o PNG.
- **Ejemplo de Respuesta**:
  ```json
  {
      "message": "Face added and embedding stored successfully."
  }
  ```

### 4. **Comparar Rostro**
- **Ruta**: `/api/face-recognition/compareFace`
- **Método**: `POST`
- **Descripción**: Compara un rostro cargado con los almacenados en la base de datos.
- **Parámetros**:
  - **Archivo** (`file`): Una imagen en formato JPEG, JPG o PNG.
- **Ejemplo de Respuesta**:
  - Si se encuentra una coincidencia:
    ```json
    {
        "status": "Match Found",
        "photo_vector": [0.12, 0.34, ...],
        "score": 0.73
    }
    ```
  - Si no hay coincidencia:
    ```json
    {
        "status": "No Match",
        "score": 1.05
    }
    ```

---

## Implementación del Modelo

### Funciones Principales

#### 1. `extract_face_embedding(img_file_path)`
Genera el vector de embedding para una imagen cargada utilizando **DeepFace** y el modelo **Facenet**.

#### 2. `store_embedding_for_user(embedding_vector)`
Almacena un vector de embedding en la base de datos MongoDB.

#### 3. `retrieve_all_embeddings()`
Recupera todos los embeddings almacenados en la base de datos para comparaciones futuras.

#### 4. `compare_with_db(uploaded_embedding)`
Compara el embedding de una imagen cargada con los almacenados en la base de datos, devolviendo el mejor resultado.

---

## Métricas de Rendimiento

Se incluyen tiempos de ejecución para las siguientes operaciones:
1. Generación de embeddings.
2. Inserción en la base de datos.
3. Recuperación de embeddings.
4. Comparación de vectores.

Estos tiempos se imprimen en consola para facilitar el monitoreo y optimización del sistema.

---

## Ejemplo de Uso

### 1. Agregar un Rostro
Usa herramientas como **Postman** o `curl` para enviar una solicitud `POST` con un archivo:

```bash
curl -X POST -F "file=@imagen.jpg" http://localhost:5000/api/face-recognition/addFace
```

### 2. Comparar un Rostro

```bash
curl -X POST -F "file=@imagen.jpg" http://localhost:5000/api/face-recognition/compareFace
```

---

## Licencia
Este proyecto se distribuye bajo la licencia MIT.

