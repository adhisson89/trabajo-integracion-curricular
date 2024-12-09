from flask import Flask, jsonify, request
import uuid
import py_eureka_client.eureka_client as eureka_client

from deepface import DeepFace
import cv2
import numpy as np
from scipy.spatial import distance
from pymongo import MongoClient

import os
import tempfile

db_string = 'mongodb+srv://adhisson:XVNqbidUA8Lu7iAm@tic.cerq8.mongodb.net/FacialDB?retryWrites=true&w=majority&appName=TIC'

# Generate a random ID
service_id = str(uuid.uuid4())

# Configure Eureka client
# eureka_client.init(eureka_server="http://172.25.0.3:8761/eureka/",
#                    app_name="deepface-service",
#                    instance_port=8761)
# ec = EurekaClient(
#     app_name="deepface-service",
#     instance_id=service_id,
#     #eureka_domain_name="test.yourdomain.net",
#     #region="eu-west-1",
#     # vip_address="http://172.25.0.3:8761/eureka/",
#     vipAddress="deepface-service",
#     port=8761,
#     #secure_vip_address="https://app.yourdomain.net/",
#     #secure_port=443,
#     # ipAddr="172.25.0.3",
#     ipAddr="127.0.0.1",
#     metadata={
#         "health_check_path": "/health",
#         "primary_endpoint": "/my-service-endpoint",
#         "secondary_endpoint": "/secondary-endpoint",
#         "version": "1.0.0"
#     }
# )
# ec = EurekaClient("MyApplication",
#                 #   eureka_domain_name="test.yourdomain.net",
#                 #   region="eu-west-1",
#                   vip_address="http://app.yourdomain.net/",
#                   port=80,
#                   secure_vip_address="https://app.yourdomain.net/",
#                   secure_port=443
# )
# ec.register()

# Flask app
app = Flask(__name__)

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "UP"})

# send img to save on db
@app.route("/addFace/<user_id>", methods=["POST"])
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
        print("generated embedding", photo_embedding)
        os.remove(temp_file_path)
        update_result = add_db_people_embedding(user_id,photo_embedding)
        print('adding people', update_result)

        return jsonify({"message": "ok"})
        # return jsonify({"message": update_result})
        # return jsonify({"message": "Face added successfully", "result": update_result}), 200

    except Exception as e:
        return jsonify({"error":str(e)}), 500
    

# compare img
@app.route("/compareFace", methods=["POST"])
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

        people = get_db_people()
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

def add_db_people_embedding(user_id, new_photo_vector):
    client = MongoClient(db_string)

    try:
        # Access the database
        db = client["FacialDB"]  # Replace with your database name
        # Access the collection
        people = db["people"]  # Replace with your collection name
         # add new embedding
        person = people.update_one(
            {"identification": user_id},
            {"$set":{"photo_vector": new_photo_vector}}
        )
        if person.matched_count > 0:
            print(f"Document with ID {user_id} updated successfully.")
            return True
        else:
            print(f"No document found with ID {user_id}.")
            return False

    except Exception as e:
        print("error on add_db_people_embedding", e)
    finally:
        print("add_db_people_embedding went to finally")

def get_db_people():
    
    client = MongoClient(db_string)

    try:
        # Access the database
        db = client["FacialDB"]  # Replace with your database name
        # Access the collection
        people = db["people"]  # Replace with your collection name
        # Fetch all documents in the collection
        return list(people.find())

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
    try:
        for person in people:
            reference_embedding = person['photo_vector']
            if reference_embedding and photo_embedding:
                cosine_dist = distance.cosine(photo_embedding, reference_embedding)
                if cosine_dist < threshold:
                    return {"status":str(True), "person":person["name"],"id":person["identification"]}
                else:
                    return {"status":str(False)}
    except Exception as e:
        return {"status":str(False)}

if __name__ == "__main__":
    # app.run(host="172.25.0.3", port=80)
    app.run(host="127.0.0.1", port=8761)
