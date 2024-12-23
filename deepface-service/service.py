from flask import Flask, jsonify, request, Blueprint

import py_eureka_client.eureka_client as eureka_client
from deepface import DeepFace
import cv2
import numpy as np
from scipy.spatial import distance
from pymongo import MongoClient

import os
import tempfile
import random

#db_string = 'mongodb+srv://adhisson:XVNqbidUA8Lu7iAm@tic.cerq8.mongodb.net/FacialDB?retryWrites=true&w=majority&appName=TIC'
           
db_string   = 'mongodb+srv://adhisson:XVNqbidUA8Lu7iAm@tic.cerq8.mongodb.net/FacialDB?retryWrites=true&w=majority&appName=TIC'
# Generate a random ID


PORT = random.randint(5000, 6000)

try:
    # Register the service in Eureka
    eureka_client.init(eureka_server="http://172.25.0.3:8761/eureka/",
                    app_name="deepface-service",
                    instance_port=PORT)
except Exception as e:
    print(f"Error registering in Eureka: {e}")


# Flask app
app = Flask(__name__)

api_bp = Blueprint('api', __name__, url_prefix='/api/deepface')


@api_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "UP"})

# send img to save on db
@api_bp.route("/addFace/<user_id>", methods=["POST"])
def add_face(user_id):
    try:
        # Get the image file from the request
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']
        # print("user_id", user_id)
        # print("file", file.read())

        ext = ('.jpeg', '.jpg')

        # Ensure the file is a JPEG
        if file.filename == '' or not file.filename.lower().endswith(ext):
            return jsonify({"error": "Invalid file format. Please upload a JPEG or JPG image."}), 400
        else:
            print("good file")

        # cambiar para que ponga el suffix correcto
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file_path = temp_file.name  # Get the file path
            file.save(temp_file_path)  # Save the uploaded file to the temp file

        photo_embedding = get_embedding_representation(temp_file_path)
     #  photo_embedding = get_embedding_representation(img_path=temp_file_path, model_name='VGG-Face')
        print("generated embedding", photo_embedding)
        os.remove(temp_file_path)
        update_result = add_db_deepfacedb_embedding(user_id,photo_embedding)
        print('adding to deepfacedb', update_result)

        return jsonify({"message": "ok"})
        # return jsonify({"message": update_result})
        # return jsonify({"message": "Face added successfully", "result": update_result}), 200

    except Exception as e:
        return jsonify({"error":str(e)}), 500


# compare img
@api_bp.route("/compareFace", methods=["POST"])
def compare_face():
     try:
        # Get the image file from the request
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']
        # print("file", file.read())

        ext = ('.jpeg', '.jpg')

        # Ensure the file is a JPEG
        if file.filename == '' or not file.filename.lower().endswith(ext):
            print("bad file")
            raise Exception("bad file")
        else:
            print("good file")

        # cambiar para que ponga el suffix correcto
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            temp_file_path = temp_file.name  # Get the file path
            file.save(temp_file_path)  # Save the uploaded file to the temp file

        photo_embedding = get_embedding_representation(temp_file_path)
        print("generated embedding", photo_embedding)
        os.remove(temp_file_path)

        people = get_db_deepfaceDB()
        print('printing people', people)
        comparation_result = compare_img_people(photo_embedding, people)

        print("comparation result", comparation_result)

        return jsonify({"message": str(comparation_result)})
    except Exception as e:
        print("Error on compare_face: ", str(e))
        return jsonify({"error":str(e)})
    # finally:
    #     print("compare_face went to finally")
    #     return jsonify({"message": str(False)})


def get_embedding_representation(my_img):
    print("going to get embedding for", my_img)
    return DeepFace.represent(img_path=my_img, model_name='VGG-Face', enforce_detection=False)[0]['embedding']

# def save_embedding(my_embedding, embedding_name):
#     np.save(embedding_name, reference_embedding)

# def load_embedding(embedding_name):
#     return np.load("reference_embedding.npy", allow_pickle=True)

def add_db_deepfacedb_embedding(user_id, new_photo_vector):
    client = MongoClient(db_string)

    try:
        # Accede a la base de datos
        db = client["FacialDB"]  # Nombre de la base de datos
        # Accede a la colección
        deepfacePerson = db["deepfaceDB"]  # Nombre de la colección

        # Añade o actualiza el embedding
        result = deepfacePerson.update_one(
            {"identification": user_id},  # Filtro para buscar el documento
            {"$set": {"photo_vector": new_photo_vector}},  # Actualización
            upsert=True  # Crea un nuevo documento si no existe
        )

        if result.matched_count > 0:
            print(f"Document with ID {user_id} updated successfully.")
            return True
        elif result.upserted_id is not None:
            print(f"Document with ID {user_id} created successfully.")
            return True
        else:
            print("No changes were made.")
            return False

    except Exception as e:
        print("Error on add_db_deepfacedb_embedding:", e)
        return False
    finally:
        print("add_db_deepfacedb_embedding finished execution.")

def get_db_deepfaceDB():

    client = MongoClient(db_string)

    try:
        # Access the database
        db = client["FacialDB"]  # Replace with your database name5000
        # Access the collection
        deepfacePerson = db["deepfaceDB"]  # Replace with your collection name
        # Fetch all documents in the collection
        return list(deepfacePerson.find())

        # Optionally: Extract and return only the embeddings data
        # return [doc.get("embedding") for doc in embeddings if "embedding" in doc]

    except Exception as e:
        print(f"Error while accessing MongoDB: {e}")
        return []

    finally:
        # Close the connection
        client.close()

def compare_img_people(photo_embedding, people):
    threshold = 0.9
    best_match = None
    best_score = float('inf')  # La menor distancia encontrada

    try:
        for person in people:
            reference_embedding = person['photo_vector']

            if reference_embedding and photo_embedding:
                cosine_dist = distance.cosine(photo_embedding, reference_embedding)
                print(f"Comparing with {person['identification']} - Distance: {cosine_dist}")

                # Si la distancia es mejor que la actual
                if cosine_dist < best_score:
                    best_score = cosine_dist
                    best_match = person

        # Verificar si el mejor match está debajo del umbral
        if best_score < threshold:
            return {"status": str(True), "id": best_match["identification"], "score": best_score}
        else:
            return {"status": str(False), "score": best_score}

    except Exception as e:
        print(f"Error during comparison: {e}")
        return {"status": str(False), "error": str(e)}


app.register_blueprint(api_bp)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)
