from flask import Flask, jsonify, request
from model import get_embedding, compare_embedding
import tempfile
import os

app = Flask(__name__)

@app.route("/", methods=["GET"])
def root():
    return jsonify({"message": "Server is running!"})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "UP"})

@app.route("/compareFace", methods=["POST"])
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

if __name__ == "__main__":
    app.run(debug=False, host="0.0.0.0", port=5000)

