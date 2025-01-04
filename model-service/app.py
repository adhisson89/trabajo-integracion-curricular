from flask import Flask, jsonify, request, Blueprint
from model import extract_face_embedding, store_embedding_for_user, retrieve_all_embeddings, compare_with_db
import os
import random
import tempfile
import uuid
# import py_eureka_client.eureka_client as eureka_client


# Generate a random ID
PORT = random.randint(6000, 7000)

# try:
#     # Register the service in Eureka
#     eureka_client.init(eureka_server="http://172.25.0.3:8761/eureka/",
#                     app_name="face-recognition-service",
#                     instance_port=PORT)
# except Exception as e:
#     print(f"Error registering in Eureka: {e}")

app = Flask(__name__)

# Define the API Blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api/face-recognition')

# Home route
@api_bp.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Server is running!"})

# Health check route
@api_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "UP"})

# Endpoint to add a new face and store its embedding
@api_bp.route("/addFace", methods=["POST"])
def add_face():
    try:
        # Obtener el archivo de la solicitud
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']
        ext = file.filename.split('.')[-1].lower()

        # Verificar la extensión del archivo
        if ext not in ['jpeg', 'jpg', 'png']:
            return jsonify({"error": "Invalid file format. Please upload a JPEG, JPG, or PNG image."}), 400

        # Obtener el photo_id desde la solicitud
        if 'photo_id' not in request.form:
            return jsonify({"error": "photo_id is required"}), 400

        photo_id = request.form['photo_id']  # Aquí se obtiene el photo_id de la solicitud

        # Guardar el archivo en un archivo temporal
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp_file:
            temp_file_path = temp_file.name
            file.save(temp_file_path)

        # Generar el embedding de la imagen
        face_embedding = extract_face_embedding(temp_file_path)

        # Almacenar el embedding en la base de datos
        success = store_embedding_for_user(photo_id, face_embedding)

        # Eliminar el archivo temporal
        os.remove(temp_file_path)

        if success:
            return jsonify({"message": f"Face added and embedding stored successfully for photo_id {photo_id}."})
        else:
            return jsonify({"error": "Failed to store the embedding."}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to compare an uploaded face image with stored embeddings
@api_bp.route("/compareFace", methods=["POST"])
def compare_face():
    try:
        # Check if 'file' is in the request
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']
        ext = file.filename.split('.')[-1].lower()

        # Validate file extension
        if ext not in ['jpeg', 'jpg', 'png']:
            return jsonify({"error": "Invalid file format. Please upload a JPEG, JPG, or PNG image."}), 400

        # Save the file to a temporary location
        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp_file:
            temp_file_path = temp_file.name
            file.save(temp_file_path)

        # Generate the embedding for the uploaded face
        face_embedding = extract_face_embedding(temp_file_path)

        # Retrieve stored embeddings from the database
        stored_vectors = retrieve_all_embeddings()

        # Compare the uploaded face embedding with stored ones
        comparison_result = compare_with_db(face_embedding)

        os.remove(temp_file_path)  # Clean up the temporary file

        return jsonify({"message": str(comparison_result)})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Register the Blueprint with the app
app.register_blueprint(api_bp)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)