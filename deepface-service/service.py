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

           
db_string   = 'mongodb+srv://adhisson:XVNqbidUA8Lu7iAm@tic.cerq8.mongodb.net/FacialDB?retryWrites=true&w=majority&appName=TIC'



PORT = random.randint(5000, 6000)

try:
    # Register the service in Eureka
    eureka_client.init(eureka_server="http://172.25.0.3:8761/eureka/",
                    app_name="face-recognition-service",
                    instance_port=PORT)
except Exception as e:
    print(f"Error registering in Eureka: {e}")


# Flask app
app = Flask(__name__)

api_bp = Blueprint('api', __name__, url_prefix='/api/face-recognition')


@api_bp.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "UP"})

# send img to save on db
@api_bp.route("/addFace", methods=["POST"])
def add_face():
    try:
        # Get the image file from the request
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']

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
        print("generated embedding", photo_embedding)
        os.remove(temp_file_path)
        update_result = add_db_deepfacedb_embedding(photo_embedding)
        print('adding to deepfacedb', update_result)
        
        if update_result:
            return jsonify({"message": "Face added successfully", "_id": str(update_result)}), 200
        else:
            return jsonify({"error": "Failed to add face to the database"}), 500


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
    


def get_embedding_representation(my_img):
    print("going to get embedding for", my_img)
    return DeepFace.represent(img_path=my_img, model_name='VGG-Face', enforce_detection=False)[0]['embedding']


def add_db_deepfacedb_embedding(new_photo_vector):
    client = MongoClient(db_string)

    try:
        # Accede a la base de datos
        db = client["FacialDB"]  # Nombre de la base de datos
        # Accede a la colección
        deepfacePerson = db["deepfaceDB"]  # Nombre de la colección

        # Añade o actualiza el embedding
        new_document = {"photo_vector": new_photo_vector}
        result = deepfacePerson.insert_one(new_document)

        if result.inserted_id:
            print(f"Document created successfully with ObjectID: {result.inserted_id}")
            return result.inserted_id  # Retorna el ObjectID del documento recién creado
        else:
            print("Failed to create a new document.")
            return None

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
    threshold = 0.8
    best_match = None
    best_score = float('inf')  # La menor distancia encontrada

    try:
        for person in people:
            reference_embedding = person['photo_vector']

            if reference_embedding and photo_embedding:
                cosine_dist = distance.cosine(photo_embedding, reference_embedding)
                print(f"Comparing with {person['_id']} - Distance: {cosine_dist}")

                # Si la distancia es mejor que la actual
                if cosine_dist < best_score:
                    best_score = cosine_dist
                    best_match = person

        # Verificar si el mejor match está debajo del umbral
        if best_score < threshold and best_match:
            match_id = best_match["_id"]
            print(type(str(match_id)))  
            print("match_id",str(match_id))
            client = MongoClient(db_string)
            db = client["FacialDB"]
            people_collection = db["people"]
            print(people_collection.name)  # Check the collection name


            person_details = people_collection.find_one(
                {"photo_vector": str(match_id)}, # Filtrar por el ID encontrado
                {"name": 1, "surname": 1, "role": 1, "identification": 1, "_id": 0}  # Proyección
            )
            print("person_details", person_details)
            
            if person_details:
                return {
                    "status": str(True),
                    "match_details": person_details,
                    "score": best_score
                }
            else:
                print(f"No details found for match ID: {match_id}")
                return {"status": str(False), "score": best_score}

        else:
            return {"status": str(False), "score": best_score}

    except Exception as e:
        print(f"Error during comparison: {e}")
        return {"status": str(False), "error": str(e)}


app.register_blueprint(api_bp)

if __name__ == "__main__":
    app.run(debug=False,host="0.0.0.0", port=PORT)
