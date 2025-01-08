from flask import Flask, jsonify, request, Blueprint
from model import extract_face_embedding, store_embedding_for_user, retrieve_all_embeddings, compare_with_db
from pymongo import MongoClient
import os
import random
import tempfile
import time
import signal


# MongoDB connection details
DB_STRING = "mongodb+srv://adhisson:XVNqbidUA8Lu7iAm@tic.cerq8.mongodb.net/PoliceDB?retryWrites=true&w=majority&appName=TIC"
client = MongoClient(DB_STRING)
db = client["PoliceDB"]
vector_collection = db["vectores"]

import py_eureka_client.eureka_client as eureka_client
# Generate a random ID
PORT = random.randint(6000, 7000)

try:
    # Register the service in Eureka
    eureka_client.init(eureka_server="http://172.25.0.3:8761/eureka/",
                    app_name="face-recognition-service",
                    instance_port=PORT)
except Exception as e:
    print(f"Error registering in Eureka: {e}")

def deregister_from_eureka():
    try:
        eureka_client.stop()  # Desregistra el cliente de Eureka
        print("Successfully deregistered from Eureka")
    except Exception as e:
        print(f"Error during Eureka deregistration: {e}")

# Manejador de señales
def handle_shutdown_signal(signum, frame):
    print(f"Received shutdown signal: {signum}")
    deregister_from_eureka()
    exit(0)

signal.signal(signal.SIGINT, handle_shutdown_signal)  # Ctrl+C
signal.signal(signal.SIGTERM, handle_shutdown_signal)  # Docker u otros procesos

app = Flask(__name__)

# Define the API Blueprint
api_bp = Blueprint('api', __name__, url_prefix='/api/face-recognition')

# Home route
@api_bp.route("/", methods=["GET"])
def home():
    start_time = time.time()  # Medir el tiempo de inicio
    response = jsonify({"message": "Server is running!"})
    end_time = time.time()  # Medir el tiempo de fin
    print(f"Home route time: {end_time - start_time} seconds")
    return response

# Health check route
@api_bp.route("/health", methods=["GET"])
def health_check():
    start_time = time.time()  # Medir el tiempo de inicio
    response = jsonify({"status": "UP"})
    end_time = time.time()  # Medir el tiempo de fin
    print(f"Health check time: {end_time - start_time} seconds")
    return response

# Endpoint to add a new face and store its embedding
@api_bp.route("/addFace", methods=["POST"])
def add_face():
    try:
        start_time = time.time()  # Start timer for execution time

        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']
        ext = file.filename.split('.')[-1].lower()

        if ext not in ['jpeg', 'jpg', 'png']:
            return jsonify({"error": "Invalid file format. Please upload a JPEG, JPG, or PNG image."}), 400

        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp_file:
            temp_file_path = temp_file.name
            file.save(temp_file_path)

        # Generate the embedding for the image
        face_embedding = extract_face_embedding(temp_file_path)

        # Store the embedding in the database (only store the vector)
        success = store_embedding_for_user(face_embedding)

        # Remove the temporary file
        os.remove(temp_file_path)

        execution_time = time.time() - start_time  # Calculate execution time
        print(f"Execution time for addFace: {execution_time} seconds")

        if success:
            return jsonify({"message": f"Face added and embedding stored successfully.", "_id": str(success)}), 200
        else:
            return jsonify({"error": "Failed to store the embedding."}), 500

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint to compare an uploaded face image with stored embeddings
@api_bp.route("/compareFace", methods=["POST"])
def compare_face():
    try:
        start_time = time.time()  # Start timer for execution time

        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']
        ext = file.filename.split('.')[-1].lower()

        if ext not in ['jpeg', 'jpg', 'png']:
            return jsonify({"error": "Invalid file format. Please upload a JPEG, JPG, or PNG image."}), 400

        with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as temp_file:
            temp_file_path = temp_file.name
            file.save(temp_file_path)

        # Generate the embedding for the image
        face_embedding = extract_face_embedding(temp_file_path)

        # Compare the uploaded face embedding with stored ones
        comparison_result = compare_with_db(face_embedding)

        # Remove the temporary file
        os.remove(temp_file_path)

        execution_time = time.time() - start_time  # Calculate execution time
        print(f"Execution time for compareFace: {execution_time} seconds")

        return jsonify(comparison_result)  # Return the comparison result as JSON

    except Exception as e:
        return jsonify({"error": str(e)}), 500

app.register_blueprint(api_bp)

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=PORT)