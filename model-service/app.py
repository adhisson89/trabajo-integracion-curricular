from flask import Flask, jsonify, request, Blueprint
from model import get_embedding, compare_embedding
import tempfile
import os
import py_eureka_client.eureka_client as eureka_client
import random

# Generate a random ID
PORT = random.randint(6000, 7000)

try:
    # Register the service in Eureka
    eureka_client.init(eureka_server="http://172.25.0.3:8761/eureka/",
                    app_name="model-service",
                    instance_port=PORT)
except Exception as e:
    print(f"Error registering in Eureka: {e}")

app = Flask(__name__)

api_bp = Blueprint('api', __name__, url_prefix='/api/face-recognition')

@api_bp.route("/", methods=["GET"])
def root():
    return jsonify({"message": "Server is running!"})

@api_bp.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "UP"})

@api_bp.route("/compareFace", methods=["POST"])
def compare_face():
    try:
        # Verificar si la imagen existe
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']
        if file.filename == '' or not file.filename.lower().endswith(('.jpg', '.jpeg')):
            return jsonify({"error": "Invalid file format. Please upload a JPEG image."}), 400

        # Guardar la imagen temporalmente
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file_path = temp_file.name
            file.save(temp_file_path)

        # Generar embedding y comparar
        embedding = get_embedding(temp_file_path)
        result = compare_embedding(embedding)
        os.remove(temp_file_path)

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

app.register_blueprint(api_bp)

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=PORT)

